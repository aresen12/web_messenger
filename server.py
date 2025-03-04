import datetime
import os

from flask import Flask, request, render_template, redirect
from forms.login_form import LoginForm
from flask_login import LoginManager, login_user, login_required, logout_user
from data import db_session
from data.user import User
from forms.register_form import RegisterForm
from data.message import Message
from data.chat import Chat
from data.File import File
from data.black_list import Black

app = Flask(__name__)

app.config['SECRET_KEY'] = 'certificate'
hash_password = '7cb8fa366d774761d198d3dc6244740c'
port = 8080
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    db_sess = db_session.create_session()
    rs = db_sess.get(User, user_id)
    db_sess.close()
    return rs
    
    
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")
    
    
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.email == form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data, duration=datetime.timedelta(hours=24*90))
            return redirect("/m")
        return render_template('login.html',
                               message="Неправильный логин или пароль",
                               form=form)
    return render_template('login.html', title='Авторизация', form=form)   
    
    
@app.route('/register', methods=['GET', 'POST'])
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

     
@app.route("/main", methods=["GET", "POST"])
@app.route("/", methods=["GET", "POST"])
def main():
    if request.method == "GET":
        return render_template("main.html", title='главная')

    
if __name__ == "__main__":
    try:
        os.chdir("static/img/data")
        os.chdir("..")
        os.chdir("..")
        os.chdir("..")
        db_session.global_init('db/master_paste.db')
    except Exception:
        os.mkdir("db")
        os.chdir("static/img")
        os.mkdir("data")
        os.chdir("..")
        os.chdir("..")
        db_session.global_init('db/master_paste.db')
    from mess import mg
    app.register_blueprint(mg)
    # from gevent import pywsgi
    # http_server = pywsgi.WSGIServer(('0.0.0.0', 8080), app, keyfile='privateKey.key', certfile='certificate.crt')
    # http_server.serve_forever()
    app.run(host='0.0.0.0', debug=True, port=port, ssl_context=('certificate.crt', 'privateKey.key'))  # ssl_context="adhoc"
