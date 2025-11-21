import sqlalchemy
from flask_login import UserMixin
from data.db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
from data import db_session
from flask_login import current_user
from data.my_message import MyMessage


class MYChat(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'my_chats'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=False)  # 1 - current 2 - deleted 3 - blocked
    pinned = sqlalchemy.Column(sqlalchemy.Boolean, default=False, nullable=True)

    def __repr__(self):
        return f"{self.id} избранное"


def get_my_chat():
    db_sess = db_session.create_session()
    chat = db_sess.query(MYChat).filter(MYChat.id == current_user.id).first()
    if chat is None:
        my_chat = MYChat()
        my_chat.id = current_user.id
        db_sess.add(my_chat)
        db_sess.commit()
        db_sess.close()
        return {"id": f"my{current_user.id}", "pinned": False,
                "last_message": {"text": "", "time": "2023-01-01 00:00:00.0", "name_sender": "", "type": ''}}
    mess2 = db_sess.query(MyMessage).filter(MyMessage.chat_id == current_user.id).all()
    if len(mess2) != 0:
        mess = mess2[-1]
        db_sess.close()
        return {"id": f"my{chat.id}", "pinned": chat.pinned,
                "last_message": {"text": mess.message, "time": mess.time,
                                 "name_sender": mess.name_sender, "type": mess.type}}
    db_sess.close()
    return {"id": f"my{chat.id}", "pinned": chat.pinned,
            "last_message": {"text": "", "time": "2023-01-01 00:00:00.0",
                             "name_sender": "", "type": ''}}
