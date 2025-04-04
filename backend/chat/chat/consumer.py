import json


import json

from channels.generic.websocket import AsyncWebsocketConsumer


from asgiref.sync import sync_to_async

# from chat.funcs import get_camelcased_dict, serialize_message, create_message
from chat.funcs import get_cached_user_or_request
from streaming_logic.produce import send_chat_message_to_streaming


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["ticket_id"]
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()
        # sending previous message through websockets
        # async for m in await get_all_chat_messages():
        # await self.send(text_data=json.dumps({"message": f"user {str(m)}" }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):

        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        ticket_id = text_data_json["ticket_id"]
        user_id = text_data_json["user_id"]

        user: dict = get_cached_user_or_request(user_id)
        # msg = await funcs.create_message(message, ticket_id, user_id)
        msg = {"sentBy": user, "message": message,
               "ticket": ticket_id}
        await sync_to_async(send_chat_message_to_streaming)(msg)
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.message", "message": msg}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        # serialized_message = await sync_to_async(funcs.serialize_message)(message)

        # serialized_message = await sync_to_async(funcs.get_camelcased_dict)(serialized_message)

        await self.send(text_data=json.dumps(message))
