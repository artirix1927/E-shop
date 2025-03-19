import { ModelsPanel } from "./modelsPanel"

export const AdminLayout = ({children, ...props}) => {




    return <div className="row">
            <div className="models-panel col-xl-3 col-lg-3 col-md-4 col-xs-12">
                <ModelsPanel></ModelsPanel>
            </div>
            
            <div className="other-content col-xl-9 col-lg-9 col-md-8 col-xs-12"> 
                {children}
            </div>
        </div>

} 