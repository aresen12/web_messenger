from data.my_orm.column import IDColumn


class Table:
    def __init__(self, table_name):
        self.table_name = table_name
        self.id = IDColumn("id")

    def create_table(self):
        names = self.__dict__
        column = [names[key] for key in names.keys() if not ("__" in key or names[key] is None
                                                             or isinstance(names[key], str)
                                                             or isinstance(names[key], tuple))]
        sql = ", ".join([_.sql for _ in column])
        return f'''CREATE TABLE IF NOT EXISTS {self.table_name}({sql})'''

    def add(self):
        names = self.__dict__
        column = [names[key] for key in names.keys() if not (
                    "__" in key or names[key] is None or isinstance(names[key], str) or isinstance(names[key], tuple))]
        del column[0]
        return column

    def update(self):
        names = self.__dict__
        column = [names[key] for key in names.keys() if not (
                "__" in key or names[key] is None or isinstance(names[key], str) or isinstance(names[key], tuple))]
        del column[0]
        sp = [f'{c.name} = ?' for c in column]
        return (f'''UPDATE {self.table_name} SET {", ".join(sp)} WHERE {self.table_name}.id = {self.id.value}''',
                [c.value for c in column])

    def __hash__(self):
        return hash(self.id)

    def get_columns(self):
        names = self.__dict__
        column = [names[key] for key in names.keys() if
                  not ("__" in key or names[key] is None or isinstance(names[key], str))]
        return column

