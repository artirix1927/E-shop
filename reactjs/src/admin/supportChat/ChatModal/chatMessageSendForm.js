import { useRef} from "react";



import "react-chat-elements/dist/main.css"
import { Button, Input} from "react-chat-elements";

import { useCookies } from "react-cookie";




export const ChatSendMessageForm = (props) => {
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


