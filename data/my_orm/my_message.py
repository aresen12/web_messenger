from data.my_orm.message import Message
import datetime


class MyMessage(Message):
    def __init__(self):
        super().__init__()


def new_mess_my(message, id_sender, name_sender, html, file_id="", read=False, pinned_m=False):
    mess = MyMessage()
    mess.message.value = message
    mess.id_sender.value = id_sender
    mess.name_sender.value = name_sender
    mess.pinned.value = pinned_m
    mess.read.value = read
    mess.img.value = file_id
    mess.html_m.value = html
    mess.time.value = datetime.datetime.now()
    return mess
