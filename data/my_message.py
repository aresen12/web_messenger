import sqlalchemy
import sqlite3
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
import datetime


class MyMessage(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'my_message'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    name_sender = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    id_sender = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    message = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    read = sqlalchemy.Column(sqlalchemy.Boolean, default=False, )
    time = sqlalchemy.Column(sqlalchemy.String, default=datetime.datetime.now)
    chat_id = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    img = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    html_m = sqlalchemy.Column(sqlalchemy.String, nullable=True, default="")
    pinned = sqlalchemy.Column(sqlalchemy.Boolean, default=False)
    type = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=1)

    def get_time(self):
        return str(self.time).split()[1]

    def get_date(self):
        print(self.time)
        date = str(self.time).split()[0].split("-")
        return f"{date[2]}.{date[1]}.{date[0]}"



def new_mess_my(message, id_sender, name_sender, chat_id, html, file_id="", read=False, pinned_m=False):
        mess = MyMessage()
        mess.message = message
        mess.chat_id = chat_id
        mess.id_sender = id_sender
        mess.name_sender = name_sender
        mess.pinned = pinned_m
        mess.read = read
        mess.img = file_id
        mess.html_m = html
        return mess
