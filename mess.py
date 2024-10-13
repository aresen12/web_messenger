import json
import os
import sqlite3

from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from data import db_session
from data.user import User
from flask_login import current_user
from data.message import Message
from data.chat import Chat

mg = Blueprint('messenger', __name__, url_prefix='/m')


def get_chats():
    db_sess = db_session.create_session()
    chats = db_sess.query(Chat).all()
    db_sess.close()
    new = []
    print(chats)
    for i in chats:
        print(i.members)
        if i.status == 1 and str(current_user.id) in i.members.split():
            new.append({"id": i.id, "name": i.name, "primary_chat": i.primary_chat})
    return new


def get_new_not_read_m(chat_id):
    try:
        conn = sqlite3.connect("db/master_paste.db")
        curr = conn.cursor()
        res = curr.execute(f"""SELECT * FROM message
                        WHERE chat_id = {int(chat_id)} AND read = 0 AND id_sender != '{current_user.id}'""").fetchall()
        conn.close()
    except Exception as e:
        print(e)
        return []
    return res

# @mg.route("/<email_recipient>", methods=["GET", "POST"])
# def m(email_recipient):
#     if request.method == 'GET':
#         if current_user.is_authenticated:
#             db_sess = db_session.create_session()
#             emails = db_sess.query(User.email).all()
#             print(emails)
#             message = db_sess.query(Message).filter(Message.email_recipient == current_user.email).all()
#             mes2 = db_sess.query(Message).filter(Message.email_sender == current_user.email).all()
#             message = message + mes2
#             # print(request.form["about"])
#             print(message)
#             message.sort(key=lambda x: x.time)
#             for mess in message:
#                 if mess.email_recipient == current_user.email:
#                     mess.read = True
#             db_sess.commit()
#             db_sess.close()
#             return render_template("form_admin.html", title='ответить', emails=emails, message=message,
#                                    email_recipient=email_recipient)
#         return render_template("forms.html", title='Заказать')
#     elif request.method == "POST":
#         f = request.files["img"]
#         print(
#         )
#         db_sess = db_session.create_session()
#         if request.form["about"].strip() == "" and f.filename == "":
#             return redirect('/m')
#         mess = Message()
#         db_sess.query(User).filter(User.email == current_user.email)
#         mess.name_sender = current_user.name
#         mess.email_sender = current_user.email
#         mess.message = request.form["about"]
#         if f.filename != "":
#             ex = f.filename.split(".")[-1]
#             os.chdir('static/img')
#             dd = len(os.listdir())
#             os.chdir("..")
#             os.chdir("..")
#             file = open(f"static/img/{dd}.{ex}", mode="wb")
#             file.write(f.read())
#             file.close()
#             mess.img = f"{dd}.{ex}"
#         mess.email_recipient = email_recipient
#         db_sess.add(mess)
#         db_sess.commit()
#         db_sess.close()
#         return redirect(f'/m/{email_recipient}')


@mg.route("/update/<int:chat_id>", methods=["GET", "POST"])
def m_update(chat_id):
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        message = db_sess.query(Message).filter(Message.chat_id == chat_id).all()
        message.sort(key=lambda x: x.time)
        db_sess.close()
        return render_template("t.html", message=message, email_recipient=chat_id)
    return render_template("t.html")


@mg.route("/", methods=["GET", "POST"])
def m_st():
    if request.method == 'GET':
        if not current_user.is_authenticated:
            return render_template("forms.html", title='Заказать')
        if current_user.is_authenticated:
            chats = get_chats()
            return render_template("form_admin.html", title='ответить', chats=chats, email_recipient="")
        return render_template("forms.html", title='Заказать', date="no date", message="",
                               email_recipient="")
    else:
        f = request.files["img"]
        if request.form["about"].strip() == "" and f.filename == "":
            return redirect('/m')
        db_sess = db_session.create_session()
        mess = Message()
        db_sess.query(User).filter(User.email == current_user.email)
        mess.name_sender = current_user.name
        mess.id_sender = current_user.id
        mess.message = request.form["about"]
        chat_id = request.form["chat_id"]
        mess.read = 0
        html_text = request.form["html_m"]
        if html_text.strip() != "":
            mess.html_m = html_text
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
        mess.chat_id = chat_id
        db_sess.add(mess)
        db_sess.commit()
        db_sess.close()
        return {"log": True}


@mg.route("/create_chat", methods=["POST"])
def create_chat():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = Chat()
    chat.name = data["name"]
    chat.members = data["list_members"]  # list of id users
    chat.primary_chat = data["primary"]
    db_sess.add(chat)
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/edit_message", methods=["POST"])
def edit_mess():
    data = request.get_json()
    db_sess = db_session.create_session()
    mess = db_sess.query(Message).filter(Message.id == data["id"]).first()
    if mess.email_sender == current_user.email:
        mess.message = data["new_text"]
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/sing_out_chat")
def sing_out_chat():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["id_chat"]).first()
    ch_mem = chat.members.split()
    if current_user.id in ch_mem:
        del ch_mem[ch_mem.index(str(current_user.id))]
    chat.members = " ".join(ch_mem)
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/get_users")
def get_users():
    db_sess = db_session.create_session()
    users = db_sess.query(User.email, User.name, User.id).all()
    db_sess.close()
    n = [list(_) for _ in users]
    return {"users": n}


@mg.route("/get_user/<int:id_>")
def get_user(id_):
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == id_).first()
    db_sess.close()
    n = user.name
    return {"user": n}


@mg.route("/get_chat_user/<int:id_>")  # chat id
def get_chat_user(id_):
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == id_).first()
    db_sess.close()
    n = chat.members.split()
    return {"user": n}


@mg.route("/delete", methods=["DELETE"])
def delete_mess():
    data = request.get_json()
    db_sess = db_session.create_session()
    mes = db_sess.query(Message).filter(Message.id == data["id"]).first()
    db_sess.delete(mes)
    db_sess.commit()
    db_sess.close()
    return {"log": "True"}


@mg.route("/get_chats")
def mg_get_chats():
    return {"chats": get_chats()}


@mg.route("/delete_chat", methods=["DELETE"])
def del_chat():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["id_chat"]).first()
    if str(current_user.id) in chat.members.split():
        chat.status = 2
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/block_chat", methods=["POST"])
def block_chat():
    data = request.get_json()  # нужно добавить в чёрный список у пользователя
    db_sess = db_session.create_session()
    print(data["id_chat"])
    chat = db_sess.query(Chat).filter(Chat.id == data["id_chat"]).first()
    if str(current_user.id) in chat.members.split():
        chat.status = 3
    print(chat.status)
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/html_new", methods=["POST"])
def html_new():
    db_sess = db_session.create_session()
    data = request.get_json()
    if current_user.is_authenticated:
        chat_id = data["id"]
        message = db_sess.query(Message).filter(Message.chat_id == chat_id).all()
        for m in message:
            if m.id_sender != current_user.id:
                m.read = True
        db_sess.commit()
        message.sort(key=lambda x: x.time)
        db_sess.close()
        return render_template("t.html", message=message, email_recipient=chat_id)
    db_sess.close()
    return ""


@mg.route("/get_new", methods=["POST"])
def get_new():
    data = request.get_json()
    if not current_user.id is None:
        chat_id = data["id"]
        message = get_new_not_read_m(chat_id)
        print(message)
        if message != list():
            return {"message": [1]}
        
    return {"message": []}


@mg.route("/c_get_user")
def c_get_user():
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.id == current_user.id).first()
        db_sess.close()
        u = {"id": user.id, "name": user.name, "email": user.email}
        return {"user": u}
    return {"user": None}


@mg.route("/v/<int:id_chat>")
def v(id_chat):
    db_sess = db_session.create_session()
    c = db_sess.query(Chat).filter(Chat.id == id_chat).first()
    c.status = 1
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/edit_prof", methods=["POST"])
def edit_prof():
    if current_user.id is None:
        return {"log": False}
    data = request.get_json()
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    user.email = data["email"]
    user.name = data["name"]
    db_sess.commit()
    db_sess.close()
    return {"log": True}

