

from django.contrib.auth.models import User

from .serializers import MessageSerializer

import chat.models as db_models


def get_camelcased_dict(dictionary: dict) -> dict:
    new_dict = {}
    for key, value in dictionary.items():

        new_key = underscore_to_camelcase(key)

        new_dict[new_key] = value

    return new_dict


def underscore_to_camelcase(value: str) -> str:
    def camelcase():
        yield str.lower
        while True:
            yield str.capitalize

    c = camelcase()
    return "".join(next(c)(x) if x else '' for x in value.split("_"))


def serialize_message(message: db_models.Message) -> dict:
    return MessageSerializer(instance=message).data


async def create_message(
        message: db_models.Message,
        ticket_id: int,
        user_id: int) -> db_models.Message:
    ticket = await db_models.SupportTicket.objects.aget(id=ticket_id)
    user = await User.objects.aget(id=user_id)
    msg = await db_models.Message.objects.acreate(message=message, ticket=ticket, sent_by=user)

    return msg
