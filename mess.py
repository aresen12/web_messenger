import os
from flask import (
    Blueprint, redirect, render_template, request,
)
from data import db_session
from data.user import User
from flask_login import current_user
from data.message import Message, new_mess
from data.chat import Chat, get_chats
from data.File import File, get_files
from data.black_list import Black
from flask_socketio import emit
from data.bot_db import BotDB

mg = Blueprint('messenger', __name__, url_prefix='/m')


@mg.route("/", methods=["GET", "POST"])
def m_st():
    if request.method == 'GET':
        if current_user.is_authenticated:
            chats = get_chats()
            return render_template("messenger.html", title='Kazbek', chats=chats, my_bg=current_user.id)
        return redirect("/login")
    else:
        f = request.files["img"]
        if request.form["about"].strip() == "" and f.filename == "":
            return redirect('/m')
        db_sess = db_session.create_session()
        if current_user.is_authenticated:
            c_user = db_sess.query(User).filter(User.email == current_user.email).first()
        else:
            c_user = db_sess.query(User).filter(User.email == request.form["id_user"]).first()
        mess = new_mess(name_sender=c_user.name, message=request.form["about"], id_sender=c_user.id,
                        chat_id=request.form["chat_id"], html=request.form["html_m"])
        c_user: User
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
            mess.img = file_db.id
        db_sess.add(mess)
        db_sess.commit()
        t_ = mess.get_time()
        db_sess.close()
        emit('message', {"message": mess.message, "time": t_, "id_m": mess.id,
                         "file2": [name, x], "html": request.form["html_m"], "name": mess.name_sender,
                         "read": 0, "id_sender": mess.id_sender}, to=request.form["chat_id"], namespace="/")
        return {"log": True}


@mg.route("/create_chat", methods=["POST"])
def create_chat():
    data = request.get_json()
    db_sess = db_session.create_session()
    if data["primary"]:
        mem = data["list_members"].split()
        mem1 = db_sess.query(Black.list_b).filter(Black.id_user == mem[0]).first()
        mem2 = db_sess.query(Black.list_b).filter(Black.id_user == mem[1]).first()
        if (not (mem2 is None) and (mem[1] in mem2[0].split() or mem[0] in mem2[0].split())) or (
                not (mem1 is None) and (mem[0] in mem1[0].split() or mem[1] in mem1[0].split())):
            db_sess.close()
            return {"log": 'PermissionError'}
    chat = Chat()
    chat.name = data["name"]
    chat.members = data["list_members"]  # list of id users
    chat.primary_chat = data["primary"]
    db_sess.add(chat)
    db_sess.commit()
    chat_id = chat.id
    if chat.primary_chat:
        members = chat.members.split()
        del members[members.index(str(current_user.id))]
        if len(members) != 0:
            name = db_sess.query(User.name).filter(User.id == members[0]).first()
            try:
                emit("create_chat", {"chat_id": str(chat_id),
                                     "name": name, "is_primary": data["primary"]},
                     to=f"u{members[0]}")
            except Exception:
                print("ERROR")
    else:
        members = chat.members.split()
        c_id = str(current_user.id)
        for member in members:
            if c_id != member:
                try:
                    emit("create_chat", {"chat_id": str(chat_id),
                                         "name": chat.name, "is_primary": data["primary"]},
                         to=f"u{member}")
                except Exception:
                    print("ERROR")
        db_sess.close()
    print(chat_id)
    return {"chat_id": str(chat_id), "name": data["name"], "is_primary": data["primary"]}


@mg.route("/pinned", methods=["POST"])
def pinned():
    data = request.get_json()
    db_sess = db_session.create_session()
    mess = db_sess.query(Message).filter(Message.id == data["mess_id"]).first()
    mess.pinned = True
    db_sess.commit()
    db_sess.close()
    # добавить socketio
    return {"log": True}


@mg.route("/un_pinned", methods=["POST"])
def an_pinned():
    data = request.get_json()
    db_sess = db_session.create_session()
    mess = db_sess.query(Message).filter(Message.id == data["mess_id"]).first()
    mess.pinned = False
    db_sess.commit()
    db_sess.close()
    # добавить socketio
    return {"log": True}


@mg.route("/last_m", methods=["POST"])
def last_m():

    # добавить socketio
    return {"log": True}


@mg.route("/get_files_menu", methods=["POST"])
def get_files_menu():
    data = request.get_json()
    db_sess = db_session.create_session()
    files = db_sess.query(File).filter(File.chat_id == data["chat_id"]).all()
    json_res = []
    for file in files:
        file: File
        mess_id = db_sess.query(Message.id).filter(Message.img == file.id).first()
        json_res.append({"name": file.name, "mess_id": mess_id[0]})
    db_sess.close()
    return json_res


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


@mg.route("/send_voice/<chat_id>", methods=["POST"])
def send_voice(chat_id):
    db_sess = db_session.create_session()
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
    file_db.chat_id = chat_id
    file_db.path = f"data/{dd}.mp3"
    file_db.name = "voice.mp3"
    mess = Message()
    mess.name_sender = current_user.name
    mess.id_sender = current_user.id
    mess.chat_id = chat_id
    db_sess.add(file_db)
    db_sess.commit()
    mess.img = file_db.id
    db_sess.add(mess)
    db_sess.commit()
    db_sess.close()
    return {"log": True}


# @mg.route("/send_message", methods=["POST"])
# def send_message():
#     data = request.get_json()
#     db_sess = db_session.create_session()
#     mess = Message()
#     mess.message = data["new_text"]
#     mess.read = 0
#     mess.html_m = data["html"]
#     mess.id_sender = current_user.id
#     mess.chat_id = data["chat_id"]
#     mess.name_sender = current_user.name
#     chat_mem = db_sess.query(Chat.members).filter().first()
#     db_sess.add(mess)
#     db_sess.commit()
#     id_m = mess.id
#     t_ = mess.get_time()
#     db_sess.close()
#     return {"id": id_m, "time": t_}
# кажется устарело нужно проверить

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
    # return {"test":True}
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


@mg.route("/block_chat", methods=["POST"])
def block_chat():
    data = request.get_json()  # нужно добавить в чёрный список у пользователя
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["id_chat"]).first()
    mem = chat.members.split()
    if str(current_user.id) in chat.members.split():
        chat.status = 3
        if chat.primary_chat:
            bl_list = db_sess.query(Black).filter(Black.id_user == current_user.id).first()
            print(bl_list)
            del mem[mem.index(str(current_user.id))]
            if bl_list is None:
                bl_list = Black()
                bl_list.id_user = current_user.id
                bl_list.list_b = mem[0]
                db_sess.add(bl_list)
            else:
                bl_list.list_b += mem[0]
        db_sess.commit()
    db_sess.close()
    return {"log": True}


@mg.route("/c_get_user")
def c_get_user():
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.id == current_user.id).first()
        db_sess.close()
        u = {"id": user.id, "name": user.name, "email": user.email}
        return {"user": u}
    return {"user": None}


@mg.route("/set_username_tg", methods=["POST"])
def ser_username_tg():
    if current_user.is_authenticated:
        db_sess = db_session.create_session()
        data = request.get_json()
        user = db_sess.query(BotDB).filter(BotDB.id_user == current_user.id).first()
        if user is None:
            user = BotDB()
            user.id_user = current_user.id
            db_sess.add(user)
            db_sess.commit()
        user.user_name = data["username"]
        db_sess.commit()
        db_sess.close()
        return {"log": True}
    return {"log": False}


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
                pass
            js["messages"].append({"id": m.id, "read": m.read, "html_m": m.html_m, "text": m.message, 'time': m.time,
                                   "file": m.img, "id_sender": m.id_sender, "name_sender": m.name_sender,
                                   "pinned": m.pinned})
        if f:
            db_sess.commit()
        db_sess.close()
        js["summ_id"] = summ
        return js
    return {"log": "NOT auth"}


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


@mg.route("/mail", methods=["POST"])
def mail():
    if current_user.is_authenticated:
        data = request.get_json()
        db_sess = db_session.create_session()
        if not (str(current_user.id) in db_sess.query(Chat).filter(
                Chat.id == data["mail_id_chat"]).first().members.split()):
            db_sess.close()
            return {"log": 'PermissionError'}
        message = db_sess.query(Message).filter(Message.id == data["mess_id"]).first()
        new_mail = Message()
        new_mail.chat_id = data["mail_id_chat"]
        new_mail.message = message.message
        new_mail.name_sender = message.name_sender
        new_mail.html_m = message.html_m
        new_mail.id_sender = current_user.id
        db_sess.add(new_mail)
        db_sess.commit()
        db_sess.close()
        return {"log": True}
    return {'log'}


@mg.route("/get_cnt_m", methods=["POST"])
def get_cnt_m():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    ch_mem = chat.members.split()
    if str(current_user.id) in ch_mem:
        c = db_sess.query(Message.id).filter(Message.chat_id == data["chat_id"]).all()
        return {"len": len(c)}
    db_sess.close()
    return {"log": "PermissionError"}


@mg.route("/get_json_mess_cast", methods=["POST"])
def get_json_mess():
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
        for m in range(0, data["cnt"], -1):
            summ += messages[m].id
            if messages[m].id_sender != js["current_user"] and not m.read:
                m.read = 1
                f = True
            js["messages"].append({"id": messages[m].id, "read": messages[m].read, "html_m": messages[m].html_m,
                                   "text": messages[m].message, 'time': messages[m].time,
                                   "file": messages[m].img, "id_sender": messages[m].id_sender,
                                   "name_sender": messages[m].name_sender})
        if f:
            db_sess.commit()
        db_sess.close()
        js["summ_id"] = summ
        return js


@mg.route("/get_cnt_m_cast", methods=["POST"])
def get_cnt_m_cast():
    data = request.get_json()
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    ch_mem = chat.members.split()
    if str(current_user.id) in ch_mem:
        c = db_sess.query(Message.id).filter(Message.chat_id == data["chat_id"]).all()
        return {"len": len(c[-20:])}
    db_sess.close()
    return {"log": "PermissionError"}


@mg.route("/users_bg", methods=["POST"])
def users_bg():
    file = request.files["file"]
    print(file)
    file2 = open(f"static/img/bg_users/{current_user.id}.jpg", mode="wb+")
    file2.write(file.read())
    file2.close()
    return {"log": True}


@mg.route("/set_read", methods=["POST"])
def set_raed():
    data = request.get_json()
    db_sess = db_session.create_session()
    mess = db_sess.query(Message).filter(Message.chat_id == data["chat_id"])
    f = False
    for m in mess:
        if not m.read and current_user.id != m.id_sender:
            m.read = 1
            f = True
    if f:
        db_sess.commit()
    db_sess.close()
    return {"log": 200}
