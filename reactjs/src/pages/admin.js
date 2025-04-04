
import { FiltersProvider } from "../providers/filtersProvider";

import { SupportTicketsList } from "../admin/supportChat/supportTickets";
import { AdminPanel } from "../admin/panel/panel";
import { ModelInstancesList } from "../admin/panel/modelInstances";
import { UpdateModelInstance } from "../admin/panel/forms/updateModelInstsance";
import { CreateModelInstance } from "../admin/panel/forms/createModelInstance";
import { AdminLayout } from "../admin/panel/Layout";


export const SupportTicketsPage = () => {
    return <div className="App">
        <AdminPanel>
        <SupportTicketsList></SupportTicketsList>
        </AdminPanel>
      </div>
  }
  
  
  
  
  export const AdminPage = () =>  {
    return <div className="App">
      <AdminPanel></AdminPanel>
    </div>
  }
  
  export const ModelPanelPage = () => {
  
  
    return <div className="App"> 
        <AdminPanel>
          <AdminLayout></AdminLayout>
        </AdminPanel>
  
    </div>
  }
  
  export const ModelInstancesPage = () =>  {
    return <div className="App">
       <FiltersProvider>
        <AdminPanel>
          <ModelInstancesList></ModelInstancesList>
        </AdminPanel>
       </FiltersProvider>
      
    </div>
  }
  
  
  export const UpdateModelInstancePage = () => {
    return <div className="App">
      <AdminPanel>
        <UpdateModelInstance></UpdateModelInstance>
      </AdminPanel>
      
    </div>
  
  }
  
  export const CreateModalInstancePage = () => {
    return <div className="App">
      <AdminPanel>
        <CreateModelInstance></CreateModelInstance>
      </AdminPanel>
      
    </div>
  
    
  }