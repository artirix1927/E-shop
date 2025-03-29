import { useEffect, useRef } from "react";

import { MessageList} from "react-chat-elements";

import { MessagesInfiniteScroll } from "../messagesInfiniteScroll";

import "react-chat-elements/dist/main.css"


export const ChatMessagesList = (props) => {
    const messagesList = useRef()
    
    //scrolling to the end after every message
    useEffect(() => {
        if (messagesList.current)
            messagesList.current.scrollIntoView({ behavior: "smooth", block: 'end'});
        
    },[]);

    const scrollableTarget = "messages-list-wrapper" 

    return <>
            <div id={scrollableTarget} className="messages-list-wrapper" >
                <MessagesInfiniteScroll scrollableTarget={scrollableTarget} 
                            ticketId = {props.currentTicketId}
                            items={props.messagesSource} 
                            setItems={props.setMessagesSource}>
                            
                    <MessageList 
                                dataSource={props.messagesSource} 
                                lockable={true}
                                toBottomHeight={'80%'}
                                className="messages-list" 
                                referance={messagesList}>
                    </MessageList>

                </MessagesInfiniteScroll>
            </div>
    </>

}