from flask_login import current_user
from flask_socketio import emit, SocketIO, join_room, leave_room, rooms
from data import db_session
from data.chat import Chat
from data.message import Message, new_mess, new_emoji
from data.user import User
from bot_def import send_all

socketio = SocketIO(cors_allowed_origins="*")


@socketio.on('join')
def on_join(data):
    room = data['room']
    users = rooms()
    print(users)
    join_room(room)
    if current_user.is_authenticated:
        emit('join_event', {"id_user": current_user.id, "users": users}, to=room)
    else:
        print(data)
        emit('join_event', {"id_user": data["id_user"], "users": users}, to=room)


@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    if current_user.is_authenticated:
        emit('leave_event', {"id_user": current_user.id}, to=room)
    else:
        emit('leave_event', {"id_user": data["id_user"]}, to=room)


@socketio.on('edit_mess')
def edit_event(data):
    room = data['room']
    emit("edit_mess", {"new_text": data["new_text"], "id_mess": data["id_m"], }, to=room)


def send_all2(db_sess, chat_members, text, c_id, name, prim, chat_id):
    db_sess: db_session
    if prim:
        chat_members: str
        a = chat_members.split()
        del a[not (a.index(str(c_id)))]
        user_name = db_sess.query(User.name).filter(User.id == a[0]).first()
        text = f"{user_name[0]}\n" + text
    else:
        text = f"{name}\n" + text
    if text == "":
        text = "Возможно у вас новыее сообщения"
    for user_id in chat_members.split():
        if not (str(c_id) == user_id):
            emit("message_other", {"text": text, "chat_id": chat_id}, to="u" + user_id)


@socketio.on('room_message')
def room_message(data):
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["room"]).first()
    chat: Chat
    if current_user.is_authenticated:
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
            file2 = mess.img
            chat_info = db_sess.query(Chat.members, Chat.name, Chat.primary_chat).filter(Chat.id == data["room"]).first()
            send_all(db_sess, chat_info[0], data['message'], current_user.id, chat_info[1], chat_info[2])
            send_all2(db_sess, chat_info[0], data['message'], current_user.id, chat_info[1], chat_info[2], data["room"])
            db_sess.close()
            emit('message', {"message": data['message'], "time": t_, "id_m": id_m,
                             "file2": file2, "html": data["html"], "name": current_user.name,
                             "read": 0, "id_sender": id_sender, "pinned": mess.pinned}, to=data['room'])


@socketio.on('connect')
def handle_connect():
    if current_user.is_authenticated:
        join_room(f'u{current_user.id}')
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    if current_user.is_authenticated:
        print("auth")
        leave_room(f'u{current_user.id}')
    print('Client disconnected')


@socketio.on("emoji")
def send_emoji(data):
    db_sess = db_session.create_session()
    mess = new_emoji(data["value"], data["id_mess"], data["chat_id"], current_user.id, current_user.name)
    emit('emoji_client', {"id_emoji": mess.id, "id_mess": data["id_mess"], "name": mess.name_sender,
                          "id_sender": mess.id_sender, "value": data["value"]}, to=data["chat_id"])
    db_sess.add(mess)
    db_sess.commit()
    db_sess.close()


@socketio.on("send_call_to_user")
def send_call(data):
    # print(data)
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    data["name_call"] = current_user.name
    for member in chat.members.split():
        if member != current_user.id:
            emit("send_call", data, to="u" + member)
    db_sess.close()


@socketio.on("send_number")
def send_number(data):
    print(data)
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["chat_id"]).first()
    for member in chat.members.split():
        if member != str(current_user.id):
            emit("send_call_by_number", {"data": data, "current_user": current_user.id}, to="u" + member)
            # emit("send_call", data, to="u" + member)
    # print(data, "of2")
    db_sess.close()

# @socketio.on("send_candidate1")
# def send_candidate1(data):
#     print(data, 1)
#     if "data" in data.keys():
#         emit("send_cand_to_user1", data, to=data["chat_id"])
# # @socketio.on("open")
# # def open_peer(data):
# #     emit("open", r)
#
# @socketio.on("send_candidate2")
# def send_candidate2(data):
#     print(data, "TESSTTTHJKL;'")
#     emit("send_cand_to_user2", data, to=data["chat_id"])
#
