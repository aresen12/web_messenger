import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin


class File(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'files'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    path = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    status = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=1)  # 1 - current 2 - deleted 3 - blocked
    chat_id = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)

    def __repr__(self):
        return f"{self.path} {self.name}"
