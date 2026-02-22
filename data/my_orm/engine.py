import sqlite3
from data.my_orm.tables import Table


class SessionDB:
    def __init__(self, name_db):
        self.connection = None
        self.connection: sqlite3.Connection
        self.cursor = None
        self.name_db = name_db
        self.connect(name_db)

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
        self.cursor.execute(f'''SELECT * FROM {args.table_name}''')
        return self

    def filter(self, logical):
        self.cursor.execute(f'''WHERE {logical}''')

    def all(self):
        return self.cursor.fetchall()

    def first(self):
        return self.cursor.fetchone()

    def add(self, new_data: Table):
        self.connection.execute(new_data.add())

    def delete_(self, object_: Table):
        self.connection.execute(f'''DELETE FROM {object_.table_name} WHERE {object_.table_name}.id = {object_.id_}''')

    def create_table(self, table):
        self.connection.execute(table.create_table())
