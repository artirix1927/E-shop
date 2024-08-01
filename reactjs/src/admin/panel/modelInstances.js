import { useMutation, useQuery } from "@apollo/client"
import { useLocation, useNavigate } from "react-router-dom"
import { GET_MODEL_INSTANCES } from "../../gql/queries"
import { AdminPanel } from "./panel"
import { useState } from "react"
import { DELETE_INSTANCES } from "../../gql/mutations"



export const ModelInstancesList = () => {
    const {state} = useLocation()

    const [selectedInstances, setSelectedInstances] = useState([])

    const {data,loading} = useQuery(GET_MODEL_INSTANCES, {variables: {appName: state.appName, modelName: state.modelName}})
    
    if (loading) return <></>

    return <>
        <div>
            <div>
                <AdminPanel></AdminPanel>
            </div>


            <div className="instances-table" >
                
                <DeleteSelectedButton selectedInstances={selectedInstances}/>
                <InstancesTable data={data} setSelectedInstances={setSelectedInstances} selectedInstances={selectedInstances}></InstancesTable>
                
            </div>
        </div>
        
      
    
    
    </>
}


const InstancesTable = ({data, setSelectedInstances, selectedInstances, ...props}) => {
    const navigate = useNavigate()

    const parsedModelInstances = JSON.parse(data.modelInstances.instances)

    const {state} = useLocation()
    
    const instanceOnClick = (event) => {
       navigate('/admin/instance-update', {state: {...state, id:event.target.id}})
    }


    const selectInstanceOnClick = (e, instanceId) => {

        if (e.target.checked === true)
            setSelectedInstances((prevInstances)=>[...prevInstances, instanceId])
        else
            setSelectedInstances(selectedInstances.filter(id => id !== instanceId))

    }


    return <>
    
    <table>
            <tbody>
            {parsedModelInstances.map((instance)=>{
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

    const {state} = useLocation()

    const deleteInstancesOnClick = (e) => {
        deleteSelectedInstances({variables:{appName: state.appName, 
                                            modelName: state.modelName, 
                                            instances: JSON.stringify(selectedInstances)
                                            }, 
                                            
                                            refetchQueries:[GET_MODEL_INSTANCES, 'ModelInstances']})
    }

    return <>
    <button className="btn btn-secondary" onClick={deleteInstancesOnClick}>Delete Selected Instances?</button><br/><br/>
    
    </>
}