import os
from flask import (
    Blueprint, redirect, render_template, request,
)
from data import db_session
from data.user import User
from flask_login import current_user, login_user, logout_user
from data.message import Message
from data.chat import Chat, get_chats
from data.File import File, get_files
from data.black_list import Black
import datetime
from keys import api_key
api = Blueprint('api', __name__, url_prefix='/api')


@api.route("/login_device", methods=["POST", "GET"])
def login_device():
    data = request.get_json()
    if data["key"] == api_key:
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.email == data["user_name"]).first()
        if user and user.check_password(data["password"]):
            login_user(user, remember=True, duration=datetime.timedelta(hours=24*90))
            db_sess.close()
            return {"log": True}
        else:
            db_sess.close()
            return {"log": "Bad password"}
    else:
        return {'log': "Bad api key"}


@api.route("/get_chats/<id_user>/<api_key2>")
def api_get_chats(id_user, api_key2):
    db_sess = db_session.create_session()
    chats = db_sess.query(Chat).all()
    db_sess.close()
    new = []
    for i in chats:
        if i.status == 1 and str(id_user) in i.members.split():
            new.append({"id": i.id, "name": i.name, "primary_chat": i.primary_chat, "status": i.status})
    return {"chats": new}

@api.route("/logout_device")
def logout_device():
    data = request.get_json()
    if data["key"] == api_key:
        logout_user()
    else:
        return {'log': "Bad api key"}


@api.route("/get_json_mess", methods=["POST"])
def get_json_message_api():
    data = request.get_json()
    db_sess = db_session.create_session()
    mem = db_sess.query(Chat.members).filter(Chat.id == data["chat_id"]).first()
    # if not (str(current_user.id) in mem[0].split()):
    #     return {"log": "Permission error"}
    messages = db_sess.query(Message).filter(Message.chat_id == data["chat_id"]).all()

    js = {"messages": [], "files": get_files(data["chat_id"], db_sess)}
    f = False
    messages.sort(key=lambda x: x.time)
    for m in messages:
        # if m.id_sender != js["current_user"] and not m.read:
        #     m.read = 1
        #     f = True
        js["messages"].append({"id": m.id, "read": m.read, "html_m": m.html_m, "text": m.message, 'time': m.time,
                                   "file": m.img, "id_sender": m.id_sender, "name_sender": m.name_sender,
                                   "pinned": m.pinned})
    if f:
        db_sess.commit()
    db_sess.close()
    return js


@api.route("/set_read", methods=["POST"])
def set_raed_api():
    data = request.get_json()
    if api_key == data["api_key"]:
        db_sess = db_session.create_session()
        mess = db_sess.query(Message).filter(Message.chat_id == data["chat_id"])
        f = False
        for m in mess:
            if not m.read and data["id_user"] != m.id_sender:
                m.read = 1
                f = True
        if f:
            db_sess.commit()
        db_sess.close()
        return {"log": 200}
    return {"log": "Bad Api key"}


@api.route("/send_voice/", methods=["POST"])
def send_voice_api():
    db_sess = db_session.create_session()
    c_user = db_sess.query(User).filter(User.id == request.form["id_user"]).first()
    f = request.files['voice']
    print(f.filename)
    os.chdir('static/img/data')
    dd = len(os.listdir())
    os.chdir("..")
    os.chdir("..")
    os.chdir("..")
    file = open(f"static/img/data/{dd}.mp3", mode="wb")
    file.write(f.read())
    file.close()
    file_db = File()
    file_db.chat_id = request.form["chat_id"]
    file_db.path = f"data/{dd}.mp3"
    file_db.name = "voice.mp3"
    mess = Message()
    mess.name_sender = c_user.name
    mess.id_sender = c_user.id
    mess.chat_id = request.form["chat_id"]
    db_sess.add(file_db)
    db_sess.commit()
    mess.img = file_db.id
    db_sess.add(mess)
    db_sess.commit()
    db_sess.close()
    return {"log": True}


@api.route("/get_users", methods=["POST"])
def get_users_api():
    data = request.get_json()
    if data["api_key"] == api_key:
        db_sess = db_session.create_session()
        users = db_sess.query(User.email, User.name, User.id).all()
        db_sess.close()
        n = [list(_) for _ in users]
        return {"users": n}
    return {"log": "Bad api key"}


@api.route("register_device", methods=["POST"])
def register_device_api():
    data = request.get_json()
    try:
        if data["password"] == data["password2"]:
            db_sess = db_session.create_session()
            check = db_sess.query(User.id).filter(User.email == data["user_name"]).first()
            if not (check is None):
                raise EOFError
            new_user = User()
            new_user.name = data["name"]
            new_user.email = data["user_name"]
            new_user.set_password(data['password'])
            db_sess.add(new_user)
            db_sess.commit()
            id_user = new_user.id
            db_sess.close()
            return {"api_key": api_key, "name": data["name"], "username": data["user_name"], "id_user": id_user, "log":True}
        return {"log": False, "message": "p!2"}
    except EOFError:
        return {"log": False, "message": "username!"}
