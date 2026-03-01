import sqlite3
from data.my_orm.tables import Table


class SessionDB:
    def __init__(self, name_db):
        self.connection = None
        self.connection: sqlite3.Connection
        self.cursor = None
        self.name_db = name_db
        self.connect(name_db)
        self.current_table = None
        self.sql_text = ""

    def connect(self, name_db=""):
        if name_db == "":
            self.connection = sqlite3.connect(self.name_db)
        self.connection = sqlite3.connect(name_db)
        self.cursor = self.connection.cursor()

    def close(self):
        self.connection.close()

    def commit(self):
        self.connection.commit()

    def query(self, args: Table):
        self.current_table = args
        self.sql_text = f'''SELECT * FROM {args.table_name}'''
        return self

    def filter(self, logical):
        if "WHERE" in logical:
            self.sql_text += f" AND {logical}"
        else:
            self.sql_text += f''' WHERE {logical}'''
        return self

    def all(self):
        return self.cursor.execute(self.sql_text).fetchall()

    def first(self):
        value = self.cursor.execute(self.sql_text).fetchone()
        columns = self.cursor.execute(f"PRAGMA table_info({self.current_table.table_name})").fetchall()
        for i in range(len(columns)):
            try:
                getattr(self.current_table, columns[i][1]).value = value[i]
            except Exception:
                print(columns[i][1])
        r = self.current_table
        self.current_table = None
        return r

    def add(self, new_data: Table):
        res = self.connection.execute(new_data.add())
        new_data.id.value = res.lastrowid

    def delete_(self, object_: Table):
        self.connection.execute(f'''DELETE FROM {object_.table_name} WHERE {object_.table_name}.id = {object_.id}''')

    def create_table(self, table):
        self.connection.execute(table.create_table())

    def update(self, table: Table):
        self.connection.execute(table.update())
