import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


import json

from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Message, SupportTicket

from asgiref.sync import sync_to_async

from .serializers import MessageSerializer

from django.contrib.auth.models import User


@sync_to_async
def create_message(message, ticket_id, user_id):
    ticket = SupportTicket.objects.get(id=ticket_id)
    user = User.objects.get(id=user_id)

    m = Message(message=message,ticket=ticket,sent_by=user)
    m.save()

    return m


@sync_to_async
def get_all_chat_messages():
    queryset = Message.objects.all().order_by('datetime')
    return queryset

@sync_to_async
def serialize_message(message):
    return MessageSerializer(instance=message).data



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["ticket_id"]
        self.room_group_name = f"chat_{self.room_name}"
        # Join room group
        
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        
        
        await self.accept()
        # async for m in await get_all_chat_messages():
        #     await self.send(text_data=json.dumps({"message": f"user {str(m)}" }))

        

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
    
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        ticket_id = text_data_json["ticket_id"]
        user_id = text_data_json["user_id"]

        msg = await create_message(message, ticket_id, user_id)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.message", "message":msg}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
       
        # Send message to WebSocket
        serialized_message = await serialize_message(message)

        serialized_message = await get_camelcased_dict(serialized_message)
        
        await self.send(text_data=json.dumps(serialized_message))



@sync_to_async
def get_camelcased_dict(dictionary: dict):
    new_dict = {}
    for key,value in dictionary.items():

        new_key = underscore_to_camelcase(key)

        new_dict[new_key] = value

    return new_dict


def underscore_to_camelcase(value):
    def camelcase(): 
        yield str.lower
        while True:
            yield str.capitalize

    c = camelcase()
    return "".join(next(c)(x) if x else '' for x in value.split("_"))