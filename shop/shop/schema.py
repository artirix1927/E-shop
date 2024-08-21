from graphene import Schema

schema = None


def set_schema(new_schema: Schema) -> None:
    global schema
    schema = new_schema





