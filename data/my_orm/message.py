from data.my_orm.tables import Table
from data.my_orm.column import BoolColumn, TextColumn, IDColumn, INEGERColumn, DataTime


class Message(Table):
    def __init__(self):
        super().__init__("message")
        self.id_ = IDColumn("id"),
        self.read = BoolColumn("read")
        self.message = TextColumn("message")
        self.img = TextColumn("img")
        self.html_m = TextColumn("html_m")
        self.pinned = BoolColumn("pinned")
        self.name_sender = TextColumn("name_sender")
        self.id_sender = INEGERColumn("id_sender")
        self.time = DataTime("time")

