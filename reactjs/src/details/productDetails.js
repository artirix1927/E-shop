
import '../css/productDetails.scss'




import { useQuery } from "@apollo/client";

import { createRef} from 'react';
import { useParams } from "react-router-dom";


// import { ADD_TO_CART, GET_PRODUCT_BY_ID } from '../gqlQueries';

import { GET_PRODUCT_BY_ID } from '../gql/queries';
import { BuyCard } from './buyCard';
import { Gallery } from './gallery';


export const ProductDetails = () => {
    const {id} = useParams();


    const buyCardRef = createRef()

    let { data,loading,error} = useQuery(GET_PRODUCT_BY_ID, {variables:{id:parseInt(id)},});




    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>

    data = data.productById;
    
    return <div className='product-container'>
    
        <div className='row'>
            <div className='col gallery'>
                <Gallery attachments={data.attachments} buyCardRef={buyCardRef}></Gallery>
            </div>

            <div className='content col-6'>
                <ProductContent data={data}/>
            </div>

            <div className='card col-4'>
                <BuyCard price={data.price} piecesLeft={data.piecesLeft} ref={buyCardRef}></BuyCard>
            </div>
            

        </div>

        <div className='description-full'>
            <h5>Full Description</h5>
            <p>{data.description}</p>
        </div>
    </div>
}

const ProductContent = (props) => {
    const data = props.data;

    return <>
        <div className='name'>
            <h2>{data.name}</h2>
        </div>

        <hr/>

        <div className='price'>
            <h2>{data.price} $CAD</h2>
        </div>

        <hr/>

        <div className='description-short'>
            <p>{data.description}</p>
        </div>

        { data.characteristics.length > 0 &&
        <div className='characteristics-scroll-div'>
            <CharacteristicsTable characteristics={data.characteristics}/>
        </div>
        }
    </>
}




const CharacteristicsTable = (props) => {
    return <table className='characteristics-table table table-borderless'>
                        
                        {props.characteristics.map((char)=>{
                        return <tr>
                                <td>{char.characteristic.name} :</td>
                                <td>{char.value}</td>
                            </tr>
                        })}
                    
        </table>
}