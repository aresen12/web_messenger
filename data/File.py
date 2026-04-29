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
    list_messages = sqlalchemy.Column(sqlalchemy.String, nullable=True)

    def __repr__(self):
        return f"{self.path} {self.name}"


def get_files(chat_id, db_sess):
    files = db_sess.query(File).filter(File.chat_id == chat_id).all()
    files2 = {}
    for f in files:
        files2[str(f.id)] = [f.name, f.path]
    return files2


def get_unique_file_name(name, db_sess):
    file_names = db_sess.query(File.path, File.id).all()
    if file_names == list():
        return name
    for _ in file_names:
        if name in _[0]:
            rashirenie = name.split(".")[-1]
            lent = len(name) - len(rashirenie) - 1
            if lent < 15:
                k = 15 - lent
            else:
                k = 0
            return f"{name[0:15 - k]}{"kazbek_messenge"[0:k]}{file_names[-1][1] + 1}.{rashirenie}"
    return name
