import { useLazyQuery,} from "@apollo/client";
import { GET_SUPPORT_TICKETS } from "../../gql/queries";

import { useCallback, useEffect, useState} from "react";


import InfiniteScroll from 'react-infinite-scroll-component';

export const TicketsInfiniteScroll = (props) => {

    const limit = 10;

    const [index, setIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [getTickets, {data}] = useLazyQuery(GET_SUPPORT_TICKETS)


    const setTicketsState = props.setItems

    const fetchMoreTickets = useCallback(() => {
        getTickets({variables: {offset: index, limit: limit}})
    }, [getTickets, index, limit])

    useEffect(()=>{
        //init fetching if no items on the screen
        if (!props.items.length){
            fetchMoreTickets()
        }
    }, [props.items, fetchMoreTickets])


    useEffect(() => {
        //adding objects to items
        if (data) {
            const tickets = Object.values(data)[0];
            setTicketsState((prevItems) => [...prevItems, ...tickets]);
            setHasMore(tickets.length > 0);
            setIndex((prevIndex) => prevIndex + limit);
        }
    }, [data]);

    return <>
    <InfiniteScroll
        dataLength={props.items.length}
        next={fetchMoreTickets}
        hasMore={hasMore}
        loader={(<></>)}
        scrollableTarget={props.scrollableTarget}
    >
        {props.children}

    </InfiniteScroll>
    </>
    
    
}