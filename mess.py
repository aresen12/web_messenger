import os
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from data import db_session
from data.user import User
from flask_login import current_user
from data.message import Message

mg = Blueprint('messenger', __name__, url_prefix='/m')


@mg.route("/<email_recipient>", methods=["GET", "POST"])
def m(email_recipient):
    if request.method == 'GET':
        if current_user.is_authenticated:
            db_sess = db_session.create_session()
            emails = db_sess.query(User.email).all()
            print(emails)
            message = db_sess.query(Message).filter(Message.email_recipient == current_user.email).all()
            mes2 = db_sess.query(Message).filter(Message.email_sender == current_user.email).all()
            message = message + mes2
            # print(request.form["about"])
            print(message)
            message.sort(key=lambda x: x.time)
            for mess in message:
                if mess.email_recipient == current_user.email:
                    mess.read = True
            db_sess.commit()
            db_sess.close()
            return render_template("form_admin.html", title='ответить', emails=emails, message=message,
                                   email_recipient=email_recipient)
        return render_template("forms.html", title='Заказать')
    elif request.method == "POST":
        f = request.files["img"]
        print(
        )
        db_sess = db_session.create_session()
        if request.form["about"].strip() == "" and f.filename == "":
            return redirect('/m')
        mess = Message()
        db_sess.query(User).filter(User.email == current_user.email)
        mess.name_sender = current_user.name
        mess.email_sender = current_user.email
        mess.message = request.form["about"]
        if f.filename != "":
            ex = f.filename.split(".")[-1]
            os.chdir('static/img')
            dd = len(os.listdir())
            os.chdir("..")
            os.chdir("..")
            file = open(f"static/img/{dd}.{ex}", mode="wb")
            file.write(f.read())
            file.close()
            mess.img = f"{dd}.{ex}"
        mess.email_recipient = email_recipient
        db_sess.add(mess)
        db_sess.commit()
        db_sess.close()
        return redirect(f'/m/{email_recipient}')


@mg.route("/update/<re>", methods=["GET", "POST"])
def m_update(re):
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        message = db_sess.query(Message).filter(Message.email_recipient == current_user.email).all()
        mes2 = db_sess.query(Message).filter(Message.email_sender == current_user.email).all()
        message = message + mes2
        message.sort(key=lambda x: x.time)
        db_sess.close()
        return render_template("t.html", message=message, email_recipient=re)
    return render_template("t.html")


@mg.route("/", methods=["GET", "POST"])
def m_st():
    if request.method == 'GET':
        if not current_user.is_authenticated:
            return render_template("forms.html", title='Заказать')
        if current_user.is_authenticated:
            db_sess = db_session.create_session()
            emails = db_sess.query(User.email).all()
            print(emails)
            return render_template("form_admin.html", title='ответить', emails=emails, email_recipient="")
        db_sess = db_session.create_session()
        message = db_sess.query(Message).filter(Message.email_recipient == current_user.email).all()
        mes2 = db_sess.query(Message).filter(Message.email_sender == current_user.email).all()
        message = message + mes2
        message.sort(key=lambda x: x.time)
        for mess in message:
            if mess.email_recipient == current_user.email:
                mess.read = True
        db_sess.commit()
        return render_template("forms.html", title='Заказать', date="no date", message=message,
                               email_recipient="")
    elif request.method == "POST":
        f = request.files["img"]
        if request.form["about"].strip() == "" and f.filename == "":
            return redirect('/m')
        db_sess = db_session.create_session()
        mess = Message()
        db_sess.query(User).filter(User.email == current_user.email)
        mess.name_sender = current_user.name
        mess.email_sender = current_user.email
        mess.message = request.form["about"]
        if f.filename != "":
            ex = f.filename.split(".")[-1]
            os.chdir('static/img')
            dd = len(os.listdir())
            os.chdir("..")
            os.chdir("..")
            file = open(f"static/img/{dd}.{ex}", mode="wb")
            file.write(f.read())
            file.close()
            mess.img = f"{dd}.{ex}"
        mess.email_recipient = request.form["email_recipient"]
        print(request.form["email_recipient"])
        db_sess.add(mess)
        db_sess.commit()
        emails = db_sess.query(User.email).all()
        print(emails)
        message = db_sess.query(Message).filter(Message.email_recipient == current_user.email).all()
        mes2 = db_sess.query(Message).filter(Message.email_sender == current_user.email).all()
        message = message + mes2
        # print(request.form["about"])
        print(message)
        message.sort(key=lambda x: x.time)
        for mess in message:
            if mess.email_recipient == current_user.email:
                mess.read = True
        db_sess.commit()
        db_sess.close()
        return render_template("form_admin.html", title='ответить', emails=emails, message=message,
                               email_recipient=request.form["email_recipient"])


@mg.route("/watch/<name>")
@mg.route("/watch/<name>/<em_r>")
def watch(name, em_r=""):
    return render_template("watch.html", name=name, em_r=em_r)


@mg.route("/delete", methods=["DELETE"])
def delete_mess():
    data = request.get_json()
    print(data["id"])
    db_sess = db_session.create_session()
    mes = db_sess.query(Message).filter(Message.id == data["id"]).first()
    db_sess.delete(mes)
    db_sess.commit()
    db_sess.close()

    return {"log": "True"}
