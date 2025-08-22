from flask_login import current_user
from flask_socketio import emit, SocketIO, join_room, leave_room, rooms
from data import db_session
from data.chat import Chat
from data.message import Message
socketio = SocketIO(cors_allowed_origins="*")


@socketio.on('join')
def on_join(data):
    room = data['room']
    users = rooms()
    print(users)
    join_room(room)
    emit('join_event', {"id_user": current_user.id, "users": users}, to=room)


@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    emit('leave_event', {"id_user": current_user.id}, to=room)


@socketio.on('edit_mess')
def edit_event(data):
    room = data['room']
    emit("edit_mess", {"new_text": data["new_text"], "id_mess": data["id_m"], }, to=room)


@socketio.on('room_message')
def room_message(data):
    db_sess = db_session.create_session()
    chat = db_sess.query(Chat).filter(Chat.id == data["room"]).first()
    chat:Chat
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
        print(file2)
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
