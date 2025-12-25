from telebot import types, TeleBot
from python_modules.keys import bot_key
from data import db_session
from data.bot_db import BotDB
db_session.global_init('db/master_paste.db')
bot = TeleBot(bot_key)


@bot.message_handler(commands=['start'])
def url(message):
    markup = types.InlineKeyboardMarkup()
    db_sess = db_session.create_session()
    print(message.from_user.username)
    user = db_sess.query(BotDB).filter(BotDB.user_name == "@" + message.from_user.username).first()
    user: BotDB
    if user is None:
        btn2 = types.InlineKeyboardButton(text='Наш сайт', url='https://kaz-m.ru/m')
        markup.add(btn2)
        bot.send_message(message.from_user.id, "Ваше username не заррегистрированно."
                                               " Проверьте корректность заполнения формы на сайте", reply_markup=markup)
    else:
        if user.notification:
            user.chat_id_tg = message.chat.id
            db_sess.commit()
            bot.send_message(message.from_user.id, "Теперь вы будете получать уведомления в тг из kazbek messenger")
    btn1 = types.InlineKeyboardButton(text='Наш сайт', url='https://kaz-m.ru/m')
    markup.add(btn1)
    db_sess.close()
    bot.send_message(message.from_user.id, "По кнопке ниже можно перейти в мессенджер", reply_markup=markup)


# для автоматического перезапуска
while True:
    try:
        bot.polling(none_stop=True, interval=0)
    except Exception:
        continue
