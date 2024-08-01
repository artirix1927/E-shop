import os
import importlib.util
import inspect
from django.apps import apps

from main.schema import set_schema

import graphene

class GqlQueriesAndMutationCollector():
    '''class that collects all the mutations and queries classes in all apps gql folders'''
    
    mutation_classes = []
    query_classes = []
    
    
    directory_to_look_in= 'gql'
    files_to_look_in = ['queries.py', 'mutations.py']
    
    def __call__(self, *args, **kwargs) -> dict:
        self.collect_and_process_files()
       
        Mutations = type('Mutations', tuple(self.mutation_classes), {})
        Queries = type('Queries', tuple(self.query_classes), {})
        return {"Mutations": Mutations, "Queries":Queries}
    
    def collect_and_process_files(self):
        apps_to_look_in = [app for app in apps.get_app_configs() if not self.is_installed_package(app)]
        for app in apps_to_look_in:
            self.process_app_files(app)
            

    def is_installed_package(self, app):
        '''if package is installed the app will be in venv directory'''
        app_path = self.get_app_path(app)
        
        path_component = app_path.split(os.sep)

        return ".venv" in path_component
    
    
    def get_app_gql_folder_path(self, app): 
        app_path = self.get_app_path(app)
        
        gql_folder_path = None
        
        for root, dirs, files in os.walk(app_path):
            if self.directory_to_look_in in dirs:
                gql_folder_path = root+'/'+self.directory_to_look_in
                
        return gql_folder_path

    def process_app_files(self, app):
        gql_folder_path = self.get_app_gql_folder_path(app)
                
        gql_folder_contents = os.listdir(gql_folder_path)
        
        files_present_in_gql_folder = set(gql_folder_contents).intersection(set(self.files_to_look_in))
        
        for file in files_present_in_gql_folder:
            file_path = gql_folder_path+'/'+file
            self.add_gql_classes_to_scheme_list(file_path)
            
            
    def get_app_path(self, app):
        try:
            module = importlib.import_module(app.name)
            return os.path.dirname(module.__file__)
        except ImportError:
            return None
          
            
            

    def add_gql_classes_to_scheme_list(self, file_path):
        spec = importlib.util.spec_from_file_location("module.name", file_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        for name, obj in inspect.getmembers(module, inspect.isclass):
            if 'Queries' in name: 
                self.query_classes.append(obj)    
    
            if 'Mutations' in name: 
                self.mutation_classes.append(obj)
                
            
            