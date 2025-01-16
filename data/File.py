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


def get_files(chat_id, db_sess):
    files = db_sess.query(File).filter(File.chat_id == chat_id).all()
    files2 = {}
    for f in files:
        files2[str(f.id)] = [f.name, f.path]
    return files2
