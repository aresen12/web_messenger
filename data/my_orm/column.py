import datetime


class Column:
    type_ = None
    name = None
    sql = "TEXT"

    def __init__(self, name):
        self.name = name
        self.value = None

    def __hash__(self):
        return hash(self.name)

    def __repr__(self):
        return "Column"

    def get_value(self):
        if self.value is None:
            return "''"
        return f"'{self.value}'"


class INEGERColumn(Column):
    def __init__(self, name, default=0):
        super().__init__(name)
        self.type_ = "INTEGER"
        self.sql = f"{self.name} INTEGER"
        self.value = default

    def get_value(self):
        return str(self.value)


class BoolColumn(INEGERColumn):
    def __init__(self, name, default=0):
        super().__init__(name)
        self.type_ = "BOOLEAN"
        self.sql = f"{self.name} BOOLEAN"
        self.value = default


class IDColumn(INEGERColumn):
    def __init__(self, name):
        super().__init__(name)
        # self.type = "INTEGER"
        self.sql = f"{self.name} INTEGER PRIMARY KEY AUTOINCREMENT"

    def get_value(self):
        return " "


class TextColumn(Column):
    def __init__(self, name):
        super().__init__(name)
        self.sql = f"{self.name} TEXT"


class DataTime(Column):
    def __init__(self, name, default=datetime.datetime.now()):
        super().__init__(name)
        self.sql = f"{self.name} TEXT"
        self.value = default

