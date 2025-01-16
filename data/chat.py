import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
from data import db_session
from flask_login import current_user


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
    chats = db_sess.query(Chat).all()
    db_sess.close()
    new = []
    for i in chats:
        if i.status == 1 and str(current_user.id) in i.members.split():
            new.append({"id": i.id, "name": i.name, "primary_chat": i.primary_chat, "status": i.status})
    return new
