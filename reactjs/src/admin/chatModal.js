
import { useLazyQuery } from "@apollo/client";
import { GET_SUPPORT_TICKET_MESSAGES } from "../gql/queries";

import { forwardRef, useEffect, useRef, useState} from "react";



import "react-chat-elements/dist/main.css"
import { Button, Input, MessageList} from "react-chat-elements";

import { useCookies } from "react-cookie";




export const ChatModal = forwardRef((props,ref) =>{ 
    const [cookies] = useCookies(['user'])

    const [messagesSource, setMessagesSource] = useState([])

    const [getMessages, {data}] = useLazyQuery(GET_SUPPORT_TICKET_MESSAGES)


    const getMessageToPush=(msg) => {  
        const msgFloat = (parseInt(cookies.user.id) === msg.sentBy.id) ? 'right' : 'left';

        return {position: msgFloat,
                title: msg.sentBy.username,
                type: 'text',text: 
                msg.message
                }
    }
    

    useEffect(()=>{
        if (props.isConnected){
            props.wsRef.current.onmessage = (event) => {
                
                const msg = JSON.parse(event.data);
    
                const messageToPush = getMessageToPush(msg)
    
                setMessagesSource((prevMessages) => [...prevMessages, messageToPush]);
            };

        }
    },[props.wsRef, props.isConnected, setMessagesSource, cookies.user.id])

    //load previous messages
    useEffect(()=>{
        const messages = []
        if (data){
            data.getMessagesByTicket.map((msg)=>{
                const messageToPush = getMessageToPush(msg)

                messages.push(messageToPush)
                return 0
            })

            setMessagesSource(messages);
        }

    }, [data, cookies.user.id])

    //when ticket is chosen fetch previous messages
    useEffect(()=>{
        if (props.currentTicketId)
            getMessages({variables:{id: props.currentTicketId}})
    }, [props.currentTicketId, getMessages])



    return <>
        <div className="chat-modal-container">
            <div ref={ref} className="chat-modal">
                
                    <ChatMessagesList messagesSource={messagesSource}/>

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
            messagesList.current.scrollIntoView({ behavior: "smooth" });
        
    }, [props.messagesSource]);

    return <>
        <MessageList 
                    dataSource={props.messagesSource} 
                    lockable={true}
                    toBottomHeight={'80%'}
                    className="messages-list" 
                    referance={messagesList}>
        </MessageList>

    </>

}