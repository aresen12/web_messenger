import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
import datetime


class Black(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'black_list'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    list_b = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    id_user = sqlalchemy.Column(sqlalchemy.String, nullable=True)

    def __repr__(self):
        return f"{self.list_b} {self.id_user}"


# Запустить при отсутствии таблицы black_list в базе данных
def create_lists():
    pass
