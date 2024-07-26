import { useLazyQuery,} from "@apollo/client";
import { GET_SUPPORT_TICKET_MESSAGES } from "../gql/queries";

import { useCallback, useEffect, useRef, useState} from "react";


import InfiniteScroll from 'react-infinite-scroll-component';
import { useCookies } from "react-cookie";


export const MessagesInfiniteScroll = (props) => {
    const limit = 15;

    const [cookies] = useCookies(['user']);
    

    const setMessagesState = props.setItems;

    const [ticketId, setTicketId] = useState(props.ticketId);
    const [index, setIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [getMessages, { data }] = useLazyQuery(GET_SUPPORT_TICKET_MESSAGES);


    const getMessageToPush = (msg) => {  
        const msgFloat = (parseInt(cookies.user.id) === msg.sentBy.id) ? 'right' : 'left';
        return {
            position: msgFloat,
            title: msg.sentBy.username,
            type: 'text',
            text: msg.message
        };
    };

    const fetchMoreMessages = useCallback(() => {
        if (ticketId)
            getMessages({ variables: { id: ticketId, offset: index, limit: limit } });
    }, [getMessages, index, limit, ticketId]);


    useEffect(() => {
        if (!props.items.length) {
            fetchMoreMessages();
        }
    }, [props.items]);

    useEffect(() => {
        if (data) {
            const messages = Object.values(data)[0];
            const messagesToSet = messages.map((msg) => getMessageToPush(msg));
            setMessagesState((prevItems) => [...prevItems, ...messagesToSet]);
            setHasMore(messages.length > 0);
            setIndex((prevIndex) => prevIndex + limit);
        }
    }, [data, setMessagesState]);

    useEffect(() => {
        if (props.ticketId !== ticketId) {
            setMessagesState([]);
            setTicketId(props.ticketId);
            setIndex(0);
            setHasMore(true);
        }
    }, [props.ticketId, setMessagesState, ticketId]);

    return (
        <InfiniteScroll
            dataLength={props.items.length}
            next={fetchMoreMessages}
            hasMore={hasMore}
            loader={<></>}
            scrollableTarget={props.scrollableTarget}
            inverse={true}
        >
            {props.children}
        </InfiniteScroll>
    );
};