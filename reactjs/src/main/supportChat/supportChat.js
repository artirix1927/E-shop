import { useMutation, useQuery } from "@apollo/client"
import { GET_SUPPORT_TICKETS_BY_USER } from ".././gql/queries"
import { useCookies } from "react-cookie"
import { useEffect, useRef, useState } from "react"
import { ClientChatModal } from "./chatModal"
import { useChatWs } from "../../hooks"
import { CREATE_TICKET } from "../gql/mutations"

export const SupportChatModal = () => {
  const [cookies] = useCookies(['user']);
  let { data, loading } = useQuery(GET_SUPPORT_TICKETS_BY_USER, { 
    variables: { user: parseInt(cookies.user.id) } 
  });
  const chatRef = useRef();
  const [currentTicketId, setCurrentTicketId] = useState();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ws, isConnected] = useChatWs(currentTicketId);

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setCurrentTicketId(null);
  };



  useEffect(() => {
      const handleClickOutside = (event) => {
          if (chatRef.current && !chatRef.current.contains(event.target)) {
              closeChat(); // Close chat if clicked outside
          }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [closeChat]);


  if (loading) return <></>;

  data = data ? data.ticketsByUser : [];

  return (
    <>
      <i 
        className={`bi bi-chat-right-text-fill open-support-tickets-chat ${isChatOpen ? 'hidden' : ''}`} 
        onClick={openChat}
      ></i>

      <div className={`support-tickets-chat ${isChatOpen ? 'open' : ''}`} ref={chatRef}>
        <div className="chat-header">
          <TicketsList
            data={data}
            setCurrentTicketId={setCurrentTicketId}
            closeChat={closeChat}
          />
        </div>
        <div className="chat-content">
          <ClientChatModal 
            currentTicketId={currentTicketId} 
            wsRef={ws} 
            isConnected={isConnected} 
          />
        </div>
      </div>
    </>
  );
};



const CreateTicket = () => {
    const [createTicket, {}] = useMutation(CREATE_TICKET, {refetchQueries:['TicketssByUser', 'AllTickets']}); // Mutation for creating new ticket
    const [cookies] = useCookies(['user']);

    const handleCreateTicket = () => {
        createTicket({
            variables: { userId: parseInt(cookies.user.id) }
        });
    };


    return <>
        <button className="create-ticket-btn" onClick={handleCreateTicket}>+</button>
    </>
}

const TicketsList = ({data,setCurrentTicketId, closeChat, ...props}) => {

    
    const handleTicket = (event) =>{ 

        setCurrentTicketId(parseInt(event.target.id))
    }


    return <>
        <div className="support-tickets-list">


            <div className="support-ticket-item create-ticket" key={-1}>
                <CreateTicket/>
            </div>

            {data.map((ticket,index) => (
                <div className="support-ticket-item" key={index}>
                    <button className="support-ticket-item-btn" id={ticket.id} onClick={handleTicket}>Ticket #{ticket.id}</button>
                </div>
            ))}
            
        </div>
    </>
}