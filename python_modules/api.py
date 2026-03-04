import os
from flask import (
    Blueprint, redirect, render_template, request,
)
from data import db_session
from data.user import User
from flask_login import current_user, logout_user
from flask_socketio import emit
from data.my_orm.message import new_mess
from data.chat import get_chats
from data.File import File
from data.my_orm.message import Message
from data.my_orm.engine import SessionDB
from data.my_orm.my_message import new_mess_my

api = Blueprint('api', __name__, url_prefix='/api')


@api.route("/logout_device")
def logout_device():
    logout_user()
    return redirect("/")


@api.route("/android", methods=["GET", "POST"])
def android_base():
    if request.method == 'GET':
        if current_user.is_authenticated:
            chats = get_chats()
            return render_template("messenger.html", device="android", title='Kazbek', chats=chats,
                                   my_bg=current_user.id)
        return redirect("/login")
    else:
        if not current_user.is_authenticated:
            return redirect("/login")
        f = request.files["img"]
        if request.form["about"].strip() == "" and f.filename == "" and request.form["html_m"] == "":
            return redirect('/m')
        db_sess = db_session.create_session()
        c_user = db_sess.query(User).filter(User.email == current_user.email).first()
        try:
            int(request.form["chat_id"])
            my_sess = SessionDB(f"db/chats/chat{request.form["chat_id"]}.db")
            mess = new_mess(name_sender=c_user.name, message=request.form["about"], id_sender=c_user.id,
                            html=request.form["html_m"])
        except ValueError:
            my_sess = SessionDB(f"db/my/{request.form["chat_id"]}.db")
            mess = new_mess_my(name_sender=c_user.name, message=request.form["about"], id_sender=c_user.id,
                               html=request.form["html_m"])
        x = ""
        name = ""
        if f.filename != "":
            file_db = File()
            file_db.name = f.filename
            ex = f.filename.split(".")[-1]
            os.chdir('static/img/data')
            dd = len(os.listdir())
            os.chdir("..")
            os.chdir("..")
            os.chdir("..")
            file = open(f"static/img/data/{dd}.{ex}", mode="wb")
            file.write(f.read())
            file.close()
            file_db.path = f"data/{dd}.{ex}"
            x = file_db.path
            name = file_db.name
            db_sess.add(file_db)
            db_sess.commit()
            file_db.chat_id = request.form["chat_id"]
            mess.img.value = file_db.id
        my_sess.add(mess)
        my_sess.commit()
        my_sess.close()
        db_sess.commit()
        t_ = mess.get_time()
        db_sess.close()
        emit('message', {"message": mess.message.value, "time": t_, "id_m": mess.id.value,
                         "file2": [name, x], "html": request.form["html_m"], "name": mess.name_sender.value,
                         "read": 0, "id_sender": mess.id_sender.value}, to=request.form["chat_id"], namespace="/")
        return {"log": True}


@api.route("/search_in_chat", methods=["POST"])
def search_response():
    data = request.get_json()
    db_sess = SessionDB(f"db/chats/chat{data["chat_id"]}.db")
    json_response = {"list_message": []}
    messages = db_sess.query(Message()).all()
    for message in messages:
        if not (message[2] is None) and data["search_text"] in message[2]:
            json_response["list_message"].append(message[0])
    db_sess.close()
    return json_response
