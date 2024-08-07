
import { useQuery } from '@apollo/client'
import '../../css/adminpanel.scss'
import { GET_ADMIN_APPS } from '.././gql/queries'

import { useNavigate } from "react-router-dom";

export const ModelsPanel = () => {
    const {data, loading} = useQuery(GET_ADMIN_APPS)

    if (loading) return <></>
    
    return <>

    <div className="sidebar">
        <div className='sidebar-content'>
            
                {data.allApps.map((app, index) => {

                    return <AppSection key={index} name={app.appName} models={app.models}/>
                })}
            
        </div>
    </div>
    </>


}


const AppSection = (props) => {
    const navigate = useNavigate()


    const modelOnClick = (event) => {
        navigate('/admin/model-instances', {state:{appName: props.name, modelName:event.target.innerHTML}})

    }


    const CreateOnClick = (event, model) => {
        navigate('/admin/instance-create', {state:{appName: props.name, modelName:model}})

    }

    return <>
        <div className="app">
            <p className="app-name">{props.name}</p>
            <div className='app-models'>
                <table className='app-models-list'>
                    <tbody>
                        {props.models.map((model, index) => <tr key={index} ><th>

                            <span onClick={modelOnClick}>{model}</span>

                            <span className='create-button' onClick={(event)=>{CreateOnClick(event,model)}}>+</span>
                            
                        </th></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    </>

}

