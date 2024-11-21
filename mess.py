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
from data.File import File

mg = Blueprint('messenger', __name__, url_prefix='/m')


def get_chats():
    db_sess = db_session.create_session()
    chats = db_sess.query(Chat).all()
    db_sess.close()
    new = []
    for i in chats:
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


@mg.route("/update/<int:chat_id>", methods=["GET", "POST"])
def m_update(chat_id):
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        message = db_sess.query(Message).filter(Message.chat_id == chat_id).all()
        message.sort(key=lambda x: x.time)
        files = db_sess.query(File).filter(File.chat_id == chat_id).all()
        files2 = {}
        for f in files:
            files2[str(f.id)] = [f.name, f.path]
        print(files2)
        db_sess.close()
        return render_template("t.html", message=message, email_recipient=chat_id, f_n=files2)
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
            file_db = File()
            file_db.name = f.filename
            ex = f.filename.split(".")[-1]
            os.chdir('static/img')
            dd = len(os.listdir())
            os.chdir("..")
            os.chdir("..")
            file = open(f"static/img/{dd}.{ex}", mode="wb")
            file.write(f.read())
            file.close()
            file_db.path = f"{dd}.{ex}"
            db_sess.add(file_db)
            db_sess.commit()
            file_db.chat_id = chat_id
            mess.img = file_db.id
        mess.chat_id = chat_id
        db_sess.add(mess)
        db_sess.commit()
        id_m = mess.id
        t_ = mess.get_time()
        db_sess.close()
        return {"id": id_m, "time": t_}


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
    if mess.id_sender == current_user.id:
        mess.message = data["new_text"]
        mess.read = 0
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/send_message", methods=["POST"])
def send_message():
    data = request.get_json()
    db_sess = db_session.create_session()
    mess = Message()
    mess.message = data["new_text"]
    mess.read = 0
    mess.html_m = data["html"]
    mess.id_sender = current_user.id
    mess.chat_id = data["chat_id"]
    mess.name_sender = current_user.name
    db_sess.add(mess)
    db_sess.commit()
    id_m = mess.id
    t_ = mess.get_time()
    db_sess.close()
    return {"id": id_m, "time": t_}


@mg.route("/sing_out_chat", methods=["POST"])
def sing_out_chat():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    ch_mem = chat.members.split()
    if str(current_user.id) in ch_mem:
        del ch_mem[ch_mem.index(str(current_user.id))]
    chat.members = " ".join(ch_mem)
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/add_in_chat", methods=["POST"])
def add_in_chat():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    ch_mem = chat.members.split()
    if str(current_user.id) in ch_mem:
        chat.members += data["list_members"]
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/get_users")
def get_users():
    db_sess = db_session.create_session()
    users = db_sess.query(User.email, User.name, User.id).all()
    db_sess.close()
    n = [list(_) for _ in users]
    return {"users": n, "c_user": current_user.id}


@mg.route("/get_user/<int:id_>")
def get_user(id_):
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == id_).first()
    db_sess.close()
    n = user.name
    e = user.email
    return {"user": n, "email": e}


@mg.route("/get_chat_user/<int:id_>")  # chat id
def get_chat_user(id_):
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == id_).first()
    db_sess.close()
    n = chat.members.split()
    is_pr = chat.primary_chat
    return {"user": n, 'primary_chat': is_pr}


@mg.route("/get_chats_all")  # chat id
def get_chat():
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).all()
    db_sess.close()
    n = []
    for i in chat:
        n.append({"id": i.id, "mem": i.members, "pr": i.primary_chat})
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


@mg.route("/delete_chat/<int:id_>", methods=["GET"])
def delete_chat(id_):
    if not current_user.admin:
        return redirect("/")
    db_sess = db_session.create_session()
    mes = db_sess.query(Chat).filter(Chat.id == id_).first()
    db_sess.delete(mes)
    db_sess.commit()
    db_sess.close()
    return {"log": "True"}


@mg.route("/get_chats")
def mg_get_chats():
    return {"chats": get_chats()}


@mg.route("/delete_chat", methods=["DELETE"])
def del_chat():
    try:
        data = request.get_json()
        db_sess = db_session.create_session()
        chat = db_sess.query(Chat).filter(Chat.id == data["id_chat"]).first()
        if str(current_user.id) in chat.members.split():
            chat.status = 2
        else:
            db_sess.close()
            raise PermissionError
        db_sess.commit()
        db_sess.close()
        return {"log": True}
    except PermissionError:
        return {"log": False, "error": "PermissionError"}
    except Exception:
        return {"log": False}


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
        print(chat_id)
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


@mg.route("/edit_name_chat", methods=["POST"])
def edit_name_chat():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    if str(current_user.id) in chat.members.split():
        print(data["new_name"])
        chat.name = data["new_name"]
    db_sess.commit()
    db_sess.close()
    return {'log': True}


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

