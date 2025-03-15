import { useMutation } from "@apollo/client";
import { GET_SUPPORT_TICKETS } from ".././gql/queries";
import "../../css/supporttickets.scss";
import { createRef, useEffect, useMemo, useState } from "react";
import { ChatModal } from "./chatModal";
import { CLOSE_TICKET } from ".././gql/mutations";
import { TicketsInfiniteScroll } from "./ticketsInfiniteScroll";
import { useChatWs } from "../../hooks";

export const SupportTicketsList = () => {
    const chatModalRef = createRef();
    const [tickets, setTickets] = useState([]);
    const [filterParams, setFilterParams] = useState({ searchQuery: "", filter: "all" });

    const [currentTicketId, setCurrentTicketId] = useState();
    const [currentTicketClosed, setCurrentTicketClosed] = useState();
    const [ws, isConnected] = useChatWs(currentTicketId);

    // Memoized filtered tickets for better performance
    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const matchesSearch = filterParams.searchQuery
                ? ticket.user.username.toLowerCase().includes(filterParams.searchQuery.toLowerCase()) ||
                  ticket.id.toString().includes(filterParams.searchQuery)
                : true;

            const matchesFilter =
                filterParams.filter === "all" ||
                (filterParams.filter === "open" && !ticket.closed) ||
                (filterParams.filter === "closed" && ticket.closed);

            return matchesSearch && matchesFilter;
        });
    }, [tickets, filterParams]);

    return (
        <div>
            <div className="support-tickets-list">
                <TicketsSearch setFilterParams={setFilterParams} tickets={tickets} />

                <TicketsInfiniteScroll setItems={setTickets} items={tickets} scrollableTarget="support-tickets-list">
                    <div className="ticket-buttons-container">
                        {filteredTickets.map(item => (
                            <SupportTicketItem
                                chatModalRef={chatModalRef}
                                setCurrentTicketId={setCurrentTicketId}
                                setCurrentTicketClosed={setCurrentTicketClosed}
                                ticket={item}
                                key={item.id}
                            />
                        ))}
                    </div>
                </TicketsInfiniteScroll>
            </div>

            <ChatModal
                ref={chatModalRef}
                currentTicketId={currentTicketId}
                currentTicketClosed={currentTicketClosed}
                wsRef={ws}
                isConnected={isConnected}
            />
        </div>
    );
};



const TicketsSearch = ({ setFilterParams }) => {
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setFilterParams({ searchQuery, filter });
    }, [searchQuery, filter, setFilterParams]);

    return (
        <div className="filter-search-container">
            <input
                type="text"
                placeholder="Search by user or ticket ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />

            <div className="filter-buttons">
                {["all", "open", "closed"].map(type => (
                    <button
                        key={type}
                        className={`filter-btn ${filter === type ? "active" : ""}`}
                        onClick={() => setFilter(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
};



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
            <label className="ticket-name">{`Ticket #${item.id},  ${item.user.username}`} </label> 

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