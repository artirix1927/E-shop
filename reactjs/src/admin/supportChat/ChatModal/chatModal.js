import { forwardRef, useCallback, useEffect, useState} from "react";

import { useCookies } from "react-cookie";
import { ChatMessagesList } from "./chatMessagesList";
import { ChatSendMessageForm } from "./chatMessageSendForm";





export const ChatModal = forwardRef((props,ref) =>{ 
    const [cookies] = useCookies(['user']);
    const [messagesSource, setMessagesSource] = useState([]);

    useEffect(() => {
        const modal = ref.current;
        if (!modal) return;

        if (props.currentTicketId) {
            modal.classList.add('open');
        } else {
            modal.classList.remove('open');
        }
    }, [props.currentTicketId, ref]);

    const handleBackClick = () => {
        props.setCurrentTicketId();
    };

    const getMessageToPush = useCallback((msg) => {  
        const msgFloat = (parseInt(cookies.user.id) === msg.sentBy.id) ? 'right' : 'left';

        return {position: msgFloat,
                title: msg.sentBy.username,
                type: 'text',
                text: msg.message
                }
    },[cookies.user.id])
  
    

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
                    <button className="chat-back-button" onClick={handleBackClick}> </button>
                
                    <ChatMessagesList messagesSource={messagesSource} 
                                        setMessagesSource={setMessagesSource}
                                        currentTicketId={props.currentTicketId}/>

                    { !props.currentTicketClosed && <ChatSendMessageForm wsRef={props.wsRef} 
                                     currentTicketId={props.currentTicketId}/>}
                    
            </div>
        </div>
        
    </>
}) 
