import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
from data import db_session
from flask_login import current_user
from data.message import Message
from data.user import User
import datetime


class Chat(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'chats'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    members = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    primary_chat = sqlalchemy.Column(sqlalchemy.Boolean, nullable=True)
    status = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=1)  # 1 - current 2 - deleted 3 - blocked

    def __repr__(self):
        return f"{self.members} {self.name}"


def get_chats():
    db_sess = db_session.create_session()
    chats = db_sess.query(Chat).filter(Chat.status == 1).all()
    db_sess.close()
    new = []
    for i in chats:
        if str(current_user.id) in i.members.split():
            name = i.name
            if i.primary_chat:
                id_user = i.members.split()
                print(id_user, i.members, i.id)
                del id_user[id_user.index(str(current_user.id))]
                id_user = id_user[0]
                name = db_sess.query(User.name).filter(User.id == id_user).first()[0]
            mess2 = db_sess.query(Message).filter(Message.chat_id == i.id).all()
            if len(mess2) != 0:
                mess = mess2[-1]
                new.append({"id": i.id, "name": name, "primary_chat": i.primary_chat, "status": i.status,
                            "last_message": {"text": mess.message, "time": mess.time,
                                             "name_sender": mess.name_sender
                                             }})
            else:
                mess: Message
                new.append({"id": i.id, "name": name, "primary_chat": i.primary_chat, "status": i.status,
                            "last_message": {"text": "", "time": "2023-01-01 00:00:00.0",
                                             "name_sender": ""
                                             }})
    new.sort(key=lambda x: x["last_message"]["time"], reverse=True)
    return new
