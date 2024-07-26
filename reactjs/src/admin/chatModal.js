import { forwardRef, useEffect, useRef, useState} from "react";



import "react-chat-elements/dist/main.css"
import { Button, Input, MessageList} from "react-chat-elements";

import { useCookies } from "react-cookie";
import { MessagesInfiniteScroll } from "./messagesInfiniteScroll";




export const ChatModal = forwardRef((props,ref) =>{ 
    const [cookies] = useCookies(['user'])

    const [messagesSource, setMessagesSource] = useState([])

    const getMessageToPush=(msg) => {  
        const msgFloat = (parseInt(cookies.user.id) === msg.sentBy.id) ? 'right' : 'left';

        return {position: msgFloat,
                title: msg.sentBy.username,
                type: 'text',
                text: msg.message
                }
    }
    

    useEffect(()=>{
        if (props.isConnected){
            props.wsRef.current.onmessage = (event) => {
                
                const msg = JSON.parse(event.data);
    
                const messageToPush = getMessageToPush(msg)
    
                setMessagesSource((prevMessages) => [messageToPush, ...prevMessages]);
            };

        }
    },[props.wsRef, props.isConnected, setMessagesSource, getMessageToPush])

    return <>
        <div className="chat-modal-container">
            <div ref={ref} className="chat-modal">

                    
                
                    <ChatMessagesList messagesSource={messagesSource} setMessagesSource={setMessagesSource} currentTicketId={props.currentTicketId}/>



                    {
                    !props.currentTicketClosed &&
                    <ChatSendMessageForm wsRef={props.wsRef} 
                                        currentTicketId={props.currentTicketId}/>
                    }
                    
            </div>
        </div>
        
    </>
}) 


const ChatSendMessageForm = (props) => {
    const [cookies] = useCookies(['user'])

    const inputRef = useRef()

    const SendMessage = (event) => {
        const regExp = /^[A-Za-z0-9]*$/; //regexp to check if there is letters or numbers in a message
        event.preventDefault();
        if ( regExp.test(inputRef.current.value)){
            const msg = JSON.stringify({
                message: inputRef.current.value,
                ticket_id: props.currentTicketId,
                user_id: cookies.user.id,
            });

            props.wsRef.current.send(msg);

            inputRef.current.value = '';
        }
    }


    return <>
        <div className="send-message-container">
            <form className="send-message-form">
                <Input placeholder="Type here..." className="message-input-field" referance={inputRef}/>
                <Button
                    text={"Send"}
                    onClick={SendMessage}
                    title="Send"
                    backgroundColor="black"
                    className="message-input-button"
                    type="submit"
                />
            </form>
        </div>
    </>
}




const ChatMessagesList = (props) => {
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