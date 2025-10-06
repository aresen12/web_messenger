import datetime
import random
import sys
from keys import api_key
from flask import Flask, request, render_template, redirect
from forms.login_form import LoginForm
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from data import db_session
from data.user import User
from forms.register_form import RegisterForm
from api import api
from data.message import Message
from data.chat import Chat
from data.File import File
from data.black_list import Black
from data.bot_db import BotDB
import hashlib
from data.reset_passwords import DCode
from flask_cors import CORS
from mess import mg
from events_io import socketio
from bot_def import send_random_key

application = Flask(__name__)
application.config['SECRET_KEY'] = 'certificate'
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
application.register_blueprint(api)
socketio.init_app(application)
CORS(application, supports_credentials=True)


@application.route("/login_device", methods=["POST", "GET"])
def login_device():
    data = request.get_json()
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.email == data["user_name"]).first()
    if user and user.check_password(data["password"]):
        login_user(user, remember=True, duration=datetime.timedelta(hours=24*90), force=True)
        return {"log": True, "name": current_user.name, "id_user": current_user.id, "api_key": api_key,
                "username": current_user.email}
    else:
        db_sess.close()
        return {"log": "Bad password"}


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
            db_sess.close()
            return render_template('register.html', title='Регистрация',
                                   form=form,
                                   message="Такой пользователь уже есть")
        user = User()
        user.name = form.name.data
        user.email = form.email.data
        user.set_password(form.password.data)
        db_sess.add(user)
        db_sess.commit()
        db_sess.close()
        return redirect('/login')
    return render_template('register.html', title='Регистрация', form=form)


@application.route("/reset_password")
def reset_pass_def():
    return render_template("reset_password.html")


@application.route("/send_code_tg", methods=["POST"])
def send_code_tg_server():
    data = request.get_json()
    code = random.randint(100000, 999999)
    db_sess = db_session.create_session()
    user_id = db_sess.query(User.id).filter(User.email == data["login"]).first()
    test = send_random_key(user_id, code)
    code_status, message = test[0], test[1]
    db_sess.close()
    return {"status": code_status, "message": message}


@application.route("/check_code_and_login", methods=["POST"])
def check_code_and_login():
    data = request.get_json()
    code = data["dcode"]
    new_password = data["new_password"]
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.email == data["login"]).first()
    dcode = db_sess.query(DCode).filter(DCode.id_user == user.id).first()
    if dcode.check_password(code):
        user.set_password(new_password)
        db_sess.delete(dcode)
        db_sess.commit()
        db_sess.close()
        return {"status": 200}
    db_sess.close()
    return {"status": 500}


# потом дописать и код возврата!!!!


@application.route("/main", methods=["GET", "POST"])
@application.route("/", methods=["GET", "POST"])
def main():
    if request.method == "GET":
        return render_template("main.html", title='главная')


@application.route("/stop_messenger")
def stop_app():
    sys.exit(0)


if __name__ == "__main__":
    socketio.run(application, host='0.0.0.0', debug=True, )

