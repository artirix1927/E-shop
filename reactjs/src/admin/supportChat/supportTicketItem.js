import { useMutation } from "@apollo/client";
import { GET_SUPPORT_TICKETS } from ".././gql/queries";
import "../../css/supporttickets.scss";
import { CLOSE_TICKET } from ".././gql/mutations";



export const SupportTicketItem = (props) => {
    const item=props.ticket

    const ticketOnClick = (event) => {
        const ticketId = parseInt(event.currentTarget.id)
    

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