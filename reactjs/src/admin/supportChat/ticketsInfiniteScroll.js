import { useLazyQuery } from "@apollo/client";
import { GET_SUPPORT_TICKETS } from ".././gql/queries";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';

export const TicketsInfiniteScroll = (props) => {

    const limit = 10;
    const [index, setIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [getTickets, {data, networkStatus }] = useLazyQuery(GET_SUPPORT_TICKETS, {notifyOnNetworkStatusChange: true});

    const setTicketsState = props.setItems;

    // Trigger fetch when scrolling
    const fetchMoreTickets = useCallback(() => {
        getTickets({ variables: { offset: index, limit: limit } });
    }, [getTickets, index, limit]);

    // Trigger initial fetch if no items are present
    useEffect(() => {
        if (!props.items.length && hasMore) {
            fetchMoreTickets();
        }
    }, [props.items, fetchMoreTickets, hasMore]);

    // Handle refetch (when networkStatus === 4) - we reset the state when we want to
    useEffect(() => {
            if (networkStatus === 4) {
            setTicketsState([]); // Resetting state to avoid old data showing
            setHasMore(true);    // Set hasMore to true to allow fetching more
            setIndex(0);         // Reset index for pagination
        }
    }, [networkStatus, setTicketsState]);

    // Handle new data from the query
    useEffect(() => {
        if (data) {
            const tickets = Object.values(data)[0];
            setTicketsState((prevItems) => [...prevItems, ...tickets]);
            setHasMore(tickets.length > 0); // Update hasMore flag
            setIndex((prevIndex) => prevIndex + limit); // Update pagination index
        }
    }, [data, setTicketsState]);

    return <>
    <InfiniteScroll
        dataLength={props.items.length}
        next={fetchMoreTickets}
        hasMore={hasMore}
        loader={<></>} // Custom loader
        scrollableTarget={props.scrollableTarget}
    >
        {props.children}
    </InfiniteScroll>
    </>
}