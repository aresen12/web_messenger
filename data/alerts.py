import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
import datetime


class Alert(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'alerts'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    id_sender = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    text = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    time = sqlalchemy.Column(sqlalchemy.String, default=datetime.datetime.now)
    img = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    pinned = sqlalchemy.Column(sqlalchemy.Boolean, default=False)

    def get_date(self):
        date = str(self.time).split()[0].split("-")
        return f"{date[2]}.{date[1]}.{date[0]}"

    def __repr__(self):
        return f'{self.text}, {self.time}'


def new_alert(text, id_sender, pinned=False, img=""):
    alert = Alert()
    alert.text = text
    alert.id_sender = id_sender
    alert.img = img
    alert.pinned = pinned
    return alert
