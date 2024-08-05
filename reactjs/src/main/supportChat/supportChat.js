import { useQuery } from "@apollo/client"
import { GET_SUPPORT_TICKETS_BY_USER } from "../../gql/queries"
import { useCookies } from "react-cookie"
import { useRef, useState } from "react"
import { ClientChatModal } from "./chatModal"
import { useChatWs } from "../../hooks"


export const SupportChatModal = (props) => {
    const [cookies] = useCookies(['user'])

    let {data, loading} = useQuery(GET_SUPPORT_TICKETS_BY_USER, {variables:{user:parseInt(cookies.user.id)}})

    const chatRef = useRef()

    const [currentTicketId, setCurrentTicketId] = useState()

    const [ws, isConnected] = useChatWs(currentTicketId)

    const openChat = (event) => {
        chatRef.current.style.display = "flex"; 
        event.target.display="none";
    }

    const closeChat = (event) => {
        chatRef.current.style.display = "none"; 
        event.target.display="block";
    }

    if (loading) return <></>

    data = data.ticketsByUser

    

    return <>

        <div>
            <i className="bi bi-chat-right-text-fill open-support-tickets-chat" onClick={openChat}></i>
        </div>


        <div className="support-tickets-chat" ref={chatRef}>

           
            <div>
                <TicketsList data={data} 
                            setCurrentTicketId={setCurrentTicketId}
                            closeChat={closeChat}
                />


            </div>
            
            <div>
                <ClientChatModal
                currentTicketId={currentTicketId} 
                wsRef={ws}
                isConnected={isConnected}
                />
            </div>
        </div>
    </>
}


const TicketsList = ({data,setCurrentTicketId, closeChat, ...props}) => {

    
    const handleTicket = (event) =>{ 

        setCurrentTicketId(parseInt(event.target.id))
    }


    return <>
       
        <div className="support-tickets-list">
            <i  className="bi bi-x-lg close-chat" onClick={closeChat}></i>
            {data.map((ticket) => (
                <div className="support-ticket-item">
                    <button className="support-ticket-item-btn" id={ticket.id} onClick={handleTicket}>Ticket #{ticket.id}</button>
                </div>
            ))}
            
        </div>
    </>
}