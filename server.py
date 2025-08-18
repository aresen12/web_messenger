import datetime
import os
from flask import Flask, request, render_template, redirect
from forms.login_form import LoginForm
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from data import db_session
from data.user import User
from forms.register_form import RegisterForm
from flask_socketio import SocketIO, emit
from flask_socketio import join_room, leave_room
from data.message import Message
from data.chat import Chat
from data.File import File
from data.black_list import Black
from mess import mg

application = Flask(__name__)
application.config['SECRET_KEY'] = 'certificate'
socketio = SocketIO(application, cors_allowed_origins="*")
hash_password = '7cb8fa366d774761d198d3dc6244740c'
login_manager = LoginManager()
login_manager.init_app(application)


@login_manager.user_loader
def load_user(user_id):
    db_sess = db_session.create_session()
    rs = db_sess.get(User, user_id)
    db_sess.close()
    return rs
    
    
@application.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")


db_session.global_init('db/master_paste.db')
application.register_blueprint(mg)


@application.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.email == form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data, duration=datetime.timedelta(hours=24*90))
            return redirect("/m")
        return render_template('login.html',
                               message="Неправильный логин или пароль",
                               form=form)
    return render_template('login.html', title='Авторизация', form=form)   
    
    
@application.route('/register', methods=['GET', 'POST'])
def reqister():
    form = RegisterForm()
    if form.validate_on_submit():
        if form.password.data != form.password_again.data:
            return render_template('register.html', title='Регистрация',
                                   form=form,
                                   message="Пароли не совпадают")
        db_sess = db_session.create_session()
        if db_sess.query(User).filter(User.email == form.email.data).first():
            return render_template('register.html', title='Регистрация',
                                   form=form,
                                   message="Такой пользователь уже есть")
        user = User()
        user.name = form.name.data
        user.email = form.email.data
        user.set_password(form.password.data)
        db_sess.add(user)
        db_sess.commit()
        return redirect('/login')
    return render_template('register.html', title='Регистрация', form=form)

     
@application.route("/main", methods=["GET", "POST"])
@application.route("/", methods=["GET", "POST"])
def main():
    if request.method == "GET":
        return render_template("main.html", title='главная')


@socketio.on('join')
def on_join(data):
    username = current_user.email
    room = data['room']
    join_room(room)
    emit('message', f'{username} has joined the room {room}', to=room)


@socketio.on('leave')
def on_leave(data):
    username = current_user.email
    room = data['room']
    leave_room(room)
    emit('message', f'{username} has left the room {room}', to=room)


@socketio.on('room_message')
def room_message(data):
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["room"]).first()
    chat:Chat
    if str(current_user.id) in chat.members.split():
        mess = Message()
        mess.message = data['message']
        mess.read = 0
        mess.html_m = data["html"]
        mess.id_sender = current_user.id
        id_sender = mess.id_sender
        mess.chat_id = data["room"]
        mess.name_sender = current_user.name
        db_sess.add(mess)
        db_sess.commit()
        id_m = mess.id
        t_ = mess.get_time()
        db_sess.close()
        emit('message', {"message": data['message'], "time": t_, "id_m": id_m,
                         "file": "", "html": data["html"], "name": current_user.name, "read": 0, "id_sender": id_sender}, to=data['room'])


@socketio.on('message')
def handle_message(data):
    print('Received message: ' + data)
    emit('message', data, broadcast=True)


@socketio.on('connect')
def handle_connect():
    if current_user.is_authenticated:
        pass
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


if __name__ == "__main__":
    # application.run(host='0.0.0.0', debug=True)
    socketio.run(application, )

