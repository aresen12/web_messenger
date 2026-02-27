from data.my_orm.tables import Table
from data.my_orm.column import BoolColumn, TextColumn, IDColumn, INEGERColumn, DataTime


class Message(Table):
    def __init__(self):
        super().__init__("message")
        # self.id = IDColumn("id"),
        self.read = BoolColumn("read")
        self.message = TextColumn("message")
        self.img = TextColumn("img")
        self.html_m = TextColumn("html_m")
        self.pinned = BoolColumn("pinned")
        self.name_sender = TextColumn("name_sender")
        self.id_sender = INEGERColumn("id_sender")
        self.time = DataTime("time")
        self.type = INEGERColumn("type")

    def get_date(self):
        # print(self.time)
        date = str(self.time.value).split()[0].split("-")
        return f"{date[2]}.{date[1]}.{date[0]}"

    def get_time(self):
        return str(self.time.value).split()[1]


def new_mess(message, id_sender, name_sender, html="", file_id="", read=False, pinned_m=False, type=1):
    mess = Message()
    mess.message.value = message    
    mess.id_sender.value = id_sender
    mess.name_sender.value = name_sender
    mess.pinned.value = pinned_m
    mess.read.value = read
    mess.img.value = file_id
    mess.html_m.value = html
    mess.type.value = type
    return mess


def new_emoji(text, id_mess, id_sender, name_sender):
    mess = Message()
    mess.type.value = 2
    mess.message.value = text
    mess.html_m.value = id_mess
    mess.id_sender.value = id_sender
    mess.name_sender.value = name_sender
    return mess
