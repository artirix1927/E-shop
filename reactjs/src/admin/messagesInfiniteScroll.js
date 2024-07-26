import { useLazyQuery,} from "@apollo/client";
import { GET_SUPPORT_TICKET_MESSAGES } from "../gql/queries";

import { useCallback, useEffect, useState} from "react";


import InfiniteScroll from 'react-infinite-scroll-component';
import { useCookies } from "react-cookie";

export const MessagesInfiniteScroll = (props) => {
    const [cookies] = useCookies(['user'])
    
    const limit = 15;

    const [index, setIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [getMessages, {data}] = useLazyQuery(GET_SUPPORT_TICKET_MESSAGES)


    const setMessagesState = props.setItems


    const getMessageToPush=(msg) => {  
        const msgFloat = (parseInt(cookies.user.id) == msg.sentBy.id) ? 'right' : 'left';
        
        return {position: msgFloat,
                title: msg.sentBy.username,
                type: 'text',
                text: msg.message
                }
    }

    const fetchMoreMessages = useCallback(() => {
        getMessages({variables: {id: props.ticketId, offset: index, limit: limit}})
    }, [getMessages, index, limit, props.ticketId])

    useEffect(()=>{
        //init fetching if no items on the screen
        if (!props.items.length){
            fetchMoreMessages()
        }
    }, [props.items, fetchMoreMessages])

    useEffect(() => {
        //adding objects to items
        if (data) {
            const messages = Object.values(data)[0];
            const messagesToSet = []
            messages.map((msg)=>messagesToSet.push(getMessageToPush(msg)))
            setMessagesState((prevItems) => [...prevItems, ...messagesToSet]);
            setHasMore(messages.length > 0);
            setIndex((prevIndex) => prevIndex + limit);
        }
    }, [data]);
    return <>
    <InfiniteScroll
        dataLength={props.items.length}
        next={fetchMoreMessages}
        hasMore={hasMore}
        loader={(<></>)}
        scrollableTarget={props.scrollableTarget}
        inverse={true}
        
    >
        {props.children}

    </InfiniteScroll>
    </>
    
    
}