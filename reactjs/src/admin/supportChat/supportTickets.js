import { useMutation } from "@apollo/client";
import { GET_SUPPORT_TICKETS } from "../../gql/queries";

import '../../css/supporttickets.scss'
import { createRef , useEffect, useRef, useState} from "react";


import { ChatModal } from "./chatModal";
import { CLOSE_TICKET } from "../../gql/mutations";
import { TicketsInfiniteScroll } from "./ticketsInfiniteScroll";




export const SupportTicketsList = () => {
    const chatModalRef = createRef()

    const [tickets, setTickets] = useState([])
    const [currentTicketId, setCurrentTicketId] = useState()
    const [currentTicketClosed, setCurrentTicketClosed] = useState()

    const wsRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    //for infinite scroll
    const listOfTicketsId = 'support-tickets-list'

    useEffect(()=>{
        const websocket = new WebSocket(
            'ws://' + window.location.hostname + ':8000/ws/ticket/' + currentTicketId + '/'
        );

        websocket.onopen = () => setIsConnected(true)

        websocket.onclose = () => setIsConnected(false)

        wsRef.current = websocket;

        return () => websocket.close()


    },[currentTicketId])


    return <>
        <div>
            <div className="support-tickets-list" id={listOfTicketsId}>
                    
                    <TicketsInfiniteScroll
                        setItems={setTickets} items={tickets}
                        scrollableTarget={listOfTicketsId}
        
                    >
                    <div className="ticket-buttons-container">
                        {tickets.map((item)=>{
                            return <SupportTicketItem   chatModalRef={chatModalRef} 
                                                        setCurrentTicketId={setCurrentTicketId}
                                                        setCurrentTicketClosed={setCurrentTicketClosed}
                                                        ticket={item}
                                                        key={item.id} 
                                                        
                                                        
                                    />
                        })}
                    </div>
                    </TicketsInfiniteScroll>
                    
                    
            </div> 
            
            <div>
                <ChatModal  ref={chatModalRef} 
                            currentTicketId={currentTicketId} 
                            currentTicketClosed={currentTicketClosed}
                            wsRef={wsRef}
                            isConnected={isConnected}/>
            </div>
        </div>

        
    </>
}



const SupportTicketItem = (props) => {
    const item=props.ticket

    const ticketOnClick = (event) => {
        const ticketId = parseInt(event.currentTarget.id)
        props.chatModalRef.current.style.display = 'block';

        props.setCurrentTicketId(ticketId)
        props.setCurrentTicketClosed(item.closed)
    }

    

    const openOrClosedStyleClass = item.closed ? 'closed' : ''

    return <>
        <div className={`ticket-button ${openOrClosedStyleClass}`} key={item.id} id={item.id} onClick={ticketOnClick}>
            <p className="ticket-name">{`Ticket #${item.id},  ${item.user.username}`} </p> 

            {!item.closed && <CloseTicket ticketId={item.id}/>}
        </div>
    
    </>
}



const CloseTicket = (props) => {
    const [closeTicket] = useMutation(CLOSE_TICKET, {refetchQueries: [
        GET_SUPPORT_TICKETS, // DocumentNode object parsed with gql
        
      ]});


    const handleConfirm = () => {
        closeTicket({variables:{ticketId: parseInt(props.ticketId)}})
    };

    return (
        <>
           

            <i className="bi bi-x-lg close-ticket" data-bs-toggle="modal"  data-bs-target={`#closeTicket-${props.ticketId}`}></i>
            
            <div className="modal" tabIndex="-1" id={`closeTicket-${props.ticketId}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Are you sure you want to close the ticket?</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={handleConfirm}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};