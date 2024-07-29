import { useQuery } from "@apollo/client"
import { useLocation, useNavigate } from "react-router-dom"
import { GET_MODEL_INSTANCES } from "../../gql/queries"
import { AdminPanel } from "./panel"



export const ModelInstancesList = () => {
    const {state} = useLocation()
    const navigate = useNavigate()

    const {data,loading} = useQuery(GET_MODEL_INSTANCES, {variables: {appName: state.appName, modelName: state.modelName}})
    if (loading) return <></>
    
    const parsedModelInstances = JSON.parse(data.modelInstances.instances)
    
    const instanceOnClick = (event) => {
      
       navigate('/admin/instance-update', {state: {...state, id:event.currentTarget.id}})
    }

    
    return <>
        <div>
            <div>
                <AdminPanel></AdminPanel>
            </div>


            <div className="instances-table" >
                <table >
                    <tbody>
                        {parsedModelInstances.map((instance)=>{
                            return <tr id={instance.id} onClick={instanceOnClick} key={instance.id}><th>{instance.instance}</th></tr>})
                        
                        }
                    </tbody>
                </table>
            </div>
        </div>
        
      
    
    
    </>
}