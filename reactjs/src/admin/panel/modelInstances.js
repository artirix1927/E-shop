import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { GET_FILTERED_INSTANCES, GET_MODEL_FILTERS, GET_MODEL_INSTANCES } from ".././gql/queries"
import { useContext, useEffect, useState } from "react"
import { DELETE_INSTANCES } from ".././gql/mutations"
import { ModelsPanel } from "./modelsPanel"
import { filtersContext } from "../../providers/filtersProvider"



export const ModelInstancesList = () => {
    const {setFiltersData} = useContext(filtersContext)

    const {appName,modelName} = useParams()

    const [selectedInstances, setSelectedInstances] = useState([])
    //fetch policy bcz when deleting the instance, refetch query doesnt work
    const {data, loading, error} = useQuery(GET_MODEL_INSTANCES, {variables: {appName: appName, modelName: modelName}, fetchPolicy:"network-only"})
    
    useEffect(()=>{
        if (data)
            setFiltersData(data.modelInstances)
    }, [data])


    return <>
        <div>
            <div>
                <ModelsPanel></ModelsPanel>
            </div>


            <div className="instances-table" >
                <ModelFilters/>
                <DeleteSelectedButton selectedInstances={selectedInstances}/>
                <InstancesTable setSelectedInstances={setSelectedInstances} selectedInstances={selectedInstances}></InstancesTable>
            </div>

          
            
            
        </div>
        
      
    
    
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
    <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#deleteInstances">Delete Selected Instances?</button>
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
    const {setFiltersData} = useContext(filtersContext)


    const {appName,modelName} = useParams()

    const [getInstances, res] = useLazyQuery(GET_FILTERED_INSTANCES);

    const filterOnClick = (e) => {
        getInstances({variables: {appName: appName, modelName: modelName, queryString: e.target.getAttribute("value")}})
    }


    useEffect(()=>{
        if (res.data){
       
            setFiltersData(res.data.runFilter)
        }
    }
    

    ,[res])



    const {data, loading, error} = useQuery(GET_MODEL_FILTERS, {variables: {appName: appName, modelName: modelName}})

    let parsedFiltersData = null;
    if (data) {
        let parsed = JSON.parse(data.modelFilters.filtersData);
        //can be null if no filters are in the model admin
        if (parsed)
            for (let i = 0; i < parsed.length; i++) {
        
                let jsonString = parsed[i]
                    .replace(/'/g, '"') 
                    //replacing python booleans with js booleans
                    .replace(/\bTrue\b/g, 'true')    
                    .replace(/\bFalse\b/g, 'false'); 
        
                    parsed[i] = JSON.parse(jsonString);
            }
            parsedFiltersData = parsed;
    }

    if (error) console.log(error.message)

    
    return <>
        <div className="filters-div">
            {parsedFiltersData && parsedFiltersData.map((elem)=>{
                
                return <div className="filters-content">
                    
                    <p> By {elem.field_name}</p>
                    <div>
                        {elem.choices.map((choice)=>{
                        return <>
                        <a value={choice.query_string} selected={choice.selected} onClick={filterOnClick}>
                            {choice.display}  
                        </a> <br/></>})}
                       
                    </div>

                </div>
            })}
        </div>
    
    
    
    </>
}