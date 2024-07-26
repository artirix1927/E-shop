import { useContext, useEffect, useState } from 'react';

import { useLazyQuery } from "@apollo/client";

import { filtersContext } from '../providers/filtersProvider';

import {  GET_PRODUCTS } from '../gql/queries';

import InfiniteScroll from 'react-infinite-scroll-component';





export const ProductsInfiniteScroll = (props) => {

    const limit = 10;
    const {filterData} = useContext(filtersContext)

    const [index, setIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [filterVariables, setFilterVariables] = useState({})
    const [query, setQuery] = useState(GET_PRODUCTS)

    const checkForDifferentFilter = () => {
        return (JSON.stringify(filterData.variables) !== JSON.stringify(filterVariables) || filterData.query !== query)
    }

    const fetchMoreProducts = () => {
        getProducts({variables: { ...filterVariables, offset: index, limit: limit}})
    }
   
    const [getProducts, {data}] = useLazyQuery(query)

    useEffect(()=>{
        //resetting items if getting products
        if (filterData && checkForDifferentFilter()){
            props.setItems([])
            setIndex(0)
            setHasMore(true)
            setFilterVariables(filterData.variables)
            setQuery(filterData.query)
        }
    }, [filterData])



    useEffect(()=>{
        //init fetching if no items on the screen
        if (!props.items.length){
            fetchMoreProducts()
        }
    }, [props.items])


    useEffect(() => {
        //adding objects to items
        if (data) {
            const products = Object.values(data)[0];
            props.setItems((prevItems) => [...prevItems, ...products]);
            setHasMore(products.length > 0);
            setIndex((prevIndex) => prevIndex + limit);
        }
    }, [data]);

    return <>
    <InfiniteScroll
        dataLength={props.items.length}
        next={fetchMoreProducts}
        hasMore={hasMore}
        loader={(<></>)}
    >
        {props.children}

    </InfiniteScroll>
    </>
    
    
}