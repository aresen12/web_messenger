import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
import datetime


class Message(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'message'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    name_sender = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    id_sender = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    message = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    read = sqlalchemy.Column(sqlalchemy.Boolean, default=False,)
    time = sqlalchemy.Column(sqlalchemy.String, default=datetime.datetime.now)
    chat_id = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    img = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    html_m = sqlalchemy.Column(sqlalchemy.String, nullable=True, default="")

    def __repr__(self):
        return f"{self.message} {self.time}"

    def get_time(self):
        return str(self.time).split()[1]

    def get_date(self):
        print(self.time)
        date = str(self.time).split()[0].split("-")
        return f"{date[2]}.{date[1]}.{date[0]}"
