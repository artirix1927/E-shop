import "../../css/supporttickets.scss";
import { createRef, useMemo, useState } from "react";
import { TicketsInfiniteScroll } from "./ticketsInfiniteScroll";
import { useChatWs } from "../../hooks";
import { ChatModal } from "./ChatModal/chatModal";
import { SupportTicketItem } from "./supportTicketItem";
import { TicketsSearch } from "./supportTicketsFilter";
import { useFilterTickets } from "./hooks";

export const SupportTicketsList = () => {
    const chatModalRef = createRef();
    const [tickets, setTickets] = useState([]);
    const [filterParams, setFilterParams] = useState({ searchQuery: "", filter: "all" });

    const [currentTicketId, setCurrentTicketId] = useState();
    const [currentTicketClosed, setCurrentTicketClosed] = useState();
    const [ws, isConnected] = useChatWs(currentTicketId);

    // Memoized filtered tickets for better performance
    const filteredTickets = useFilterTickets(tickets, filterParams)

    return (
        <div className="row">
            <div className="support-tickets-list col-xl-3 col-lg-4 col-md-5 col-xs-12">
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
            
            <div className="col-xl-9 col-lg-8 col-md-7 col-xs-12">
                <ChatModal
                    ref={chatModalRef}
                    currentTicketId={currentTicketId}
                    currentTicketClosed={currentTicketClosed}
                    setCurrentTicketId={setCurrentTicketId}
                    wsRef={ws}
                    isConnected={isConnected}
                />
            </div>
        </div>
    );
};

