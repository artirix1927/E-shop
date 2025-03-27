import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { useNavigate, useParams } from "react-router-dom"
import { GET_FILTERED_INSTANCES, GET_MODEL_FILTERS, GET_MODEL_INSTANCES, GET_SEARCHED_INSTANCES } from "../gql/queries"
import { useContext, useEffect, useRef, useState } from "react"
import { DELETE_INSTANCES } from "../gql/mutations"
import { ModelsPanel } from "./modelsPanel"
import { filtersContext } from "../../providers/filtersProvider"
import { AdminLayout } from "./Layout"



export const ModelInstancesList = () => {
    const {setFiltersData} = useContext(filtersContext)

    const {appName,modelName} = useParams()

    const [selectedInstances, setSelectedInstances] = useState([])
    //fetch policy bcz when deleting the instance, refetch query doesnt work
    const {data, loading, error} = useQuery(GET_MODEL_INSTANCES, {variables: {appName: appName, modelName: modelName}})
    
    useEffect(()=>{
        if (data)
            setFiltersData(data.modelInstances)
    }, [data])


    const [filterString, setFilterString] = useState()




    return <>
            <AdminLayout>
                <div className="instances-table" >
                    <DeleteSelectedButton selectedInstances={selectedInstances}/>
                    <ModelSearch filterString={filterString}/>



                    <div className="row">
                    
                        <div className="col-xl-9 col-lg-8 col-md-8 col-sm-12 order-1 order-sm-12 "> 
                            <InstancesTable setSelectedInstances={setSelectedInstances} selectedInstances={selectedInstances}></InstancesTable>
                        </div>

                        <div className="filters-wrapper col-xl-3 col-lg-4 col-md-4 col-sm-12 order-sm-1" >
                            <ModelFilters setFilterString={setFilterString}/>
                        </div>
                        
                    </div>
                </div>
            </AdminLayout>
    
    </>
}


const InstancesTable = ({setSelectedInstances, selectedInstances, ...props}) => {
    const navigate = useNavigate()

    const {filterData} = useContext(filtersContext)

    const [parsedInstances, setParsedInstances] = useState()

    const {appName,modelName} = useParams()
    
    const instanceOnClick = (event) => {
       navigate(`/admin/instance-update/${appName}/${modelName}/${event.target.id}`)
    }


    useEffect(()=>{
        if (filterData){
            setParsedInstances(JSON.parse(filterData.instances))
        }

    }
    ,[filterData])


    const selectInstanceOnClick = (e, instanceId) => {

        if (e.target.checked === true)
            setSelectedInstances((prevInstances)=>[...prevInstances, instanceId])
        else
            setSelectedInstances(selectedInstances.filter(id => id !== instanceId))

    }


    return <>
    
    <table>
            <tbody>
            {parsedInstances && parsedInstances.map((instance)=>{
                return <tr key={instance.id}>
                    <th>
                        <span>
                            <input type="checkbox" onClick={(e)=>selectInstanceOnClick(e,instance.id)} className="form-check-input"/> 
                            <span onClick={instanceOnClick} id={instance.id} style={{marginInline: 6}}>{instance.instance}</span>
                        </span>
                    </th>
                </tr>})
            
            }
        </tbody>
    </table>
    </>
}

const DeleteSelectedButton = ({selectedInstances, ...props}) => {
    const [deleteSelectedInstances] = useMutation(DELETE_INSTANCES)

    const {appName,modelName} = useParams()

    const deleteInstancesOnClick = (e) => {
        deleteSelectedInstances({variables:{appName: appName, 
                                            modelName: modelName, 
                                            instances: JSON.stringify(selectedInstances)
                                            }, 
                                            
                                            refetchQueries:['ModelInstances']})
    }

    return <>
    <button className="btn btn-secondary delete-button" data-bs-toggle="modal" data-bs-target="#deleteInstances">Delete Selected Instances?</button>
    <br/><br/>


    <div className="modal" id="deleteInstances" tabIndex="-1" aria-labelledby="deleteInstances" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" >You sure you want to delete selected instances?</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={deleteInstancesOnClick}>Yes</button>
                </div>
            </div>
        </div>
    </div>
    
    </>
}




const ModelFilters = () => {
    const { setFiltersData } = useContext(filtersContext);
    const { appName, modelName } = useParams();
    const [getInstances, res] = useLazyQuery(GET_FILTERED_INSTANCES);
    
    const [activeFilter, setActiveFilter] = useState(null); // Track active filter

    const filterOnClick = (e) => {
        const filterValue = e.target.getAttribute("value");
        setActiveFilter(filterValue); // Set active filter in state
        getInstances({ variables: { appName, modelName, queryString: filterValue } });
    };

    useEffect(() => {
        if (res.data) {
            setFiltersData(res.data.runFilter);
        }
    }, [res]);

    const { data, loading, error } = useQuery(GET_MODEL_FILTERS, { variables: { appName, modelName } });

    let parsedFiltersData = null;
    if (data) {
        let parsed = JSON.parse(data.modelFilters.filtersData);
        if (parsed) {
            for (let i = 0; i < parsed.length; i++) {
                let jsonString = parsed[i]
                    .replace(/'/g, '"')
                    .replace(/\bTrue\b/g, 'true')
                    .replace(/\bFalse\b/g, 'false');
                parsed[i] = JSON.parse(jsonString);
            }
            parsedFiltersData = parsed;
        }
    }

    if (error) console.log(error.message);

    return (
        <>
            {parsedFiltersData && (
                <div className="filters-div">
                    {parsedFiltersData.map((elem) => (
                        <div className="filters-content" key={elem.field_name}>
                            <label className="filter-label">By {elem.field_name}</label>
                            <div>
                                {elem.choices.map((choice) => (
                                    <a
                                        key={choice.query_string}
                                        value={choice.query_string}
                                        onClick={filterOnClick}
                                        className={activeFilter === choice.query_string ? "active-filter" : ""}
                                    >
                                        - {choice.display}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};


const ModelSearch = (props) => {
    const inputRef = useRef(null)

    const {setFiltersData} = useContext(filtersContext);

    const {appName,modelName} = useParams();

    const [getInstances, res] = useLazyQuery(GET_SEARCHED_INSTANCES);

    const searchOnClick = (e) => {
        getInstances({variables: {appName: appName, modelName: modelName, searchString: inputRef.current.value, filterQueryString: props.filterString}});
    }


    useEffect(()=>{
        if (res.data){  
            setFiltersData(res.data.runSearch)
        }
    }
    

    ,[res])


    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }, [props.filterString]);

    return <>
    <div className="model-instances-search-wrapper">
        <input className="form-control" placeholder="Search..." type="text" ref={inputRef} defaultValue={""}/>
        <button className="btn btn-light" onClick={searchOnClick}>Search</button>
    </div>
    
    </>
}