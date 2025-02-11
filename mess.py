import os
from flask import (
    Blueprint, redirect, render_template, request
)
from data import db_session
from data.user import User
from flask_login import current_user
from data.message import Message, get_summ_id
from data.chat import Chat, get_chats
from data.File import File, get_files

mg = Blueprint('messenger', __name__, url_prefix='/m')


@mg.route("/", methods=["GET", "POST"])
def m_st():
    if request.method == 'GET':
        if current_user.is_authenticated:
            chats = get_chats()
            return render_template("form_admin.html", title='ответить', chats=chats, email_recipient="")
        return redirect("/login")
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
        new_m = Message()
        new_m.message = data["new_text"]
        new_m.chat_id = mess.chat_id
        new_m.name_sender = mess.name_sender
        new_m.id_sender = mess.id_sender
        new_m.html_m = mess.html_m
        new_m.time = mess.time
        new_m.read = 0
        db_sess.add(new_m)
        db_sess.delete(mess)
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
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        users = db_sess.query(User.email, User.name, User.id).all()
        db_sess.close()
        n = [list(_) for _ in users]
        return {"users": n, "c_user": current_user.id}
    return redirect("/login")


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


@mg.route("/delete", methods=["DELETE"])
def delete_mess():
    data = request.get_json()
    db_sess = db_session.create_session()
    mes = db_sess.query(Message).filter(Message.id == data["id"]).first()
    db_sess.delete(mes)
    db_sess.commit()
    db_sess.close()
    return {"log": "True"}


@mg.route("/delete_chat/<int:id_>", methods=["DELETE"])
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
        return {"log": False, "error": "Permission error"}
    except Exception:
        return {"log": False}


@mg.route("/block_chat", methods=["POST"])
def block_chat():
    data = request.get_json()  # нужно добавить в чёрный список у пользователя
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["id_chat"]).first()
    if str(current_user.id) in chat.members.split():
        chat.status = 3
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/get_new", methods=["POST"])
def get_new():
    data = request.get_json()
    if current_user.is_authenticated:
        chat_id = data["id"]
        message = get_summ_id(chat_id)
        return {"summ_id": message}
    return {"summ_id": 0}


@mg.route("/c_get_user")
def c_get_user():
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.id == current_user.id).first()
        db_sess.close()
        u = {"id": user.id, "name": user.name, "email": user.email}
        return {"user": u}
    return {"user": None}


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


@mg.route("/edit_password", methods=["POST"])
def edit_password():
    if current_user.id is None:
        return {"log": False}
    data = request.get_json()
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    if user.check_password(data["old_password"]):
        user.set_password(data["new_password"])
        db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/get_json_mess", methods=["POST"])
def get_json_message():
    if current_user.is_authenticated:
        data = request.get_json()
        db_sess = db_session.create_session()
        mem = db_sess.query(Chat.members).filter(Chat.id == data["chat_id"]).first()
        if not (str(current_user.id) in mem[0].split()):
            return {"log": "Permission error"}
        messages = db_sess.query(Message).filter(Message.chat_id == data["chat_id"]).all()
        js = {"messages": [], "files": get_files(data["chat_id"], db_sess), "current_user": current_user.id}
        summ = 0
        f = False
        messages.sort(key=lambda x: x.time)
        for m in messages:
            summ += m.id
            if m.id_sender != js["current_user"] and not m.read:
                m.read = 1
                f = True
            js["messages"].append({"id": m.id, "read": m.read, "html_m": m.html_m, "text": m.message, 'time': m.time,
                                   "file": m.img, "id_sender": m.id_sender})
        if f:
            db_sess.commit()
        db_sess.close()
        js["summ_id"] = summ
        return js


@mg.route("/get_not_read", methods=["POST"])
def get_not_read():
    data = request.get_json()
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        m = db_sess.query(Message.read, Message.id_sender).filter(Message.chat_id == data["chat_id"]).all()
        db_sess.close()
        le = 0
        for i in range(len(m) - 1, -1, -1):
            if not m[i][0] and current_user.id != m[i][1]:
                le += 1
            else:
                break
        return {"r": le}
    return {"log": "error"}
