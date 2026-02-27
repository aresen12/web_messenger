from data.my_orm.column import IDColumn


class Table:
    def __init__(self, table_name):
        self.table_name = table_name
        self.id = IDColumn("id")

    def create_table(self):
        names = self.__dict__
        column = [names[key] for key in names.keys() if not ("__" in key or names[key] is None or isinstance(names[key], str) or isinstance(names[key], tuple) )]
        print(column)
        # column[1] = column[1][0]
        sql = ", ".join([_.sql for _ in column])
        return f'''CREATE TABLE {self.table_name}({sql})'''

    def add(self):
        names = self.__dict__
        column = [names[key] for key in names.keys() if not (
                    "__" in key or names[key] is None or isinstance(names[key], str) or isinstance(names[key], tuple))]
        del column[0]
        sql = ", ".join([_.get_value() for _ in column])
        return f'''INSERT INTO {self.table_name}({", ".join([_.name for _ in column])}) VALUES ({sql})'''

    def __hash__(self):
        return hash(self.id)

    def get_columns(self):
        names = self.__dict__
        column = [names[key] for key in names.keys() if
                  not ("__" in key or names[key] is None or isinstance(names[key], str))]
        # column[0] = column[0][0]
        return column

