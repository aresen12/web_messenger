import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
import hashlib


class DCode(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'dcode'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    code = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    id_user = sqlalchemy.Column(sqlalchemy.String, nullable=True)

    def __repr__(self):
        return f"{self.code}"

    def set_password(self, password):
        password = str(password)
        print(password)
        salt = "5gz"
        data_base_password = password + salt
        hashed = hashlib.md5(data_base_password.encode())
        self.code = hashed.hexdigest()

    def check_password(self, password):
        salt = "5gz"
        data_base_password = str(password) + salt
        hashed = hashlib.md5(data_base_password.encode())
        return self.code == hashed.hexdigest()



