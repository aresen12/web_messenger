import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
import datetime
import hashlib


class Voting(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'voting'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    text = sqlalchemy.Column(sqlalchemy.String, nullable=True, default="")
    id_user = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    permissions = sqlalchemy.Column(sqlalchemy.String, nullable=True, default="")
    voting_users = sqlalchemy.Column(sqlalchemy.String, default="")
    yes = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=0)
    no = sqlalchemy.Column(sqlalchemy.Integer, nullable=True, default=0)

    def voting_yes(self):
        pass

    def __repr__(self):
        return f"{self.text} {self.permissions}"

