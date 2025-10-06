from telebot import TeleBot
from data.user import User
from keys import bot_key
from data.bot_db import BotDB
from data import db_session
from data.reset_passwords import DCode

def send_all(db_sess, chat_members, text, c_id, name, prim):
    db_sess: db_session
    bot = TeleBot(bot_key)
    if prim:
        chat_members: str
        a = chat_members.split()
        del a[not (a.index(str(c_id)))]
        user_name = db_sess.query(User.name).filter(User.id == a[0]).first()
        text = f"{user_name[0]}\n" + text
    else:
        text = f"{name}\n" + text
    if text == "":
        text = "Возможно у вас новыее сообщения"
    for user_id in chat_members.split():
        chat = db_sess.query(BotDB.chat_id_tg, BotDB.notification).filter(BotDB.id_user == user_id).first()
        if not (chat is None or chat[0] is None or str(c_id) == user_id) and chat[1]:
            bot.send_message(chat[0], text)


def send_random_key(c_id, key):
    bot2 = TeleBot(bot_key)
    db_sess = db_session.create_session()
    chat = db_sess.query(BotDB.chat_id_tg).filter(BotDB.id_user == str(c_id[0])).first()
    if chat is None:
        message = "У вас не подключены уведомления!"
        code = 500
    else:
        message = "Код успешно отправлен"
        code = 200
        dcode = db_sess.query(DCode).filter(DCode.id_user == str(c_id[0])).first()
        if dcode is None:
            dcode2 = DCode()
            dcode2.id_user = str(c_id[0])
            dcode2.set_password(key)
            db_sess.add(dcode2)
        else:
            dcode.set_password(code)
        db_sess.commit()
        bot2.send_message(chat[0], f"Код для востановления пароля:\n{key}")
    db_sess.close()
    return [code, message]
