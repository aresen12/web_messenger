import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin


class BotDB(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'bot'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    user_name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    id_user = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    chat_id_tg = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    notification = sqlalchemy.Column(sqlalchemy.Boolean, default=True, nullable=True)

    def __repr__(self):
        return f""
