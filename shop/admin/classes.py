from rest_framework.serializers import BaseSerializer

from .funcs import is_jsonable

#import django.forms.renderers

# from django.core.serializers.json import DjangoJSONEncoder

# class DecimalEncoder(DjangoJSONEncoder):
#     def default(self, o):
#         if isinstance(o, decimal.Decimal):
#             return str(o)
#         return super(DecimalEncoder, self).default(o)


class FormSerializer(BaseSerializer):
    '''Custom Form Serializer that 
    serializes model form  in order to get that form in admin'''
    
    
    def to_representation(self, instance: dict):
        return self.serialize_form()


    def serialize_form(self):
        form_fields = {'fields': []}
        
        form_fields['fields'] = self.get_fields_data()
        
        return form_fields
    
    def get_fields_data(self) -> list[dict]:
        '''getting dict with regular data for every field'''
        return [self.get_field_data(field_name, field) 
                            for field_name, field in self.instance.fields.items()]
            
    
    def get_field_data(self, field_name, field) -> dict:
        '''getting dict with data that every field has'''
        field_data = {
                "name": field_name,
                "type": field.widget.__class__.__name__,
                "required": field.required,
                "label": field.label,
                "help_text": field.help_text,
                "initial": self.get_initial(field_name,),
            }
        
        if hasattr(field, 'choices'):
                choices = self.get_list_of_field_choices(field.choices)
                field_data["choices"]  = choices
           
           
        #gotta do something with password fields in the future     
        if field_name is 'password':
            field_data['readonly'] = True
            
        return field_data
    
    def get_list_of_field_choices(self, choices) -> list[tuple[str,str]]:
        '''field choices of some specific select field '''
        #str(choice[0]) converting the select value 
        # object to string in order to get the data
        return [(str(choice[0]), choice[1]) for choice in choices]
    
    
    def get_initial(self, field):
        #if it is jsonable return the initial value if not trying to convert it to str
        #because in most cases the inital value classes return their value in str method
        if is_jsonable(self.instance.initial.get(field, '')):
            return self.instance.initial.get(field, '')
        
        try: 
            return str(self.instance.initial.get(field, ''))
        except Exception as e:
            raise e
        



    



class FormRenderer():
    DJANGO_WIDGET_TO_HTML_INPUT = {
    "TextInput": "text",
    "NumberInput": "number",
    "Textarea": "textarea",
    "Select": "select",
    "DateInput": "date",
    "EmailInput": "email",
    "URLInput": "url",
    "PasswordInput": "password",
    "CheckboxInput": "checkbox",
    "DateTimeInput": "datetime",
    "SelectMultiple": "select",
    "ClearableFileInput": "file",
    }
    
    def __init__(self, serialized_instance: dict):
        self.instance = serialized_instance.copy()
        self.rendered_instance = {}
        
    def render(self) -> dict:
        self.rendered_instance = self.set_html_input_types()
        return self.rendered_instance 

    def set_html_input_types(self) -> None:
        
        new_fields = [self.set_html_input_type(field) for field in self.instance.get('fields')]#for regular fields

        return {'fields': new_fields}
        
            
            
    def set_html_input_type(self, field:dict) -> dict:
        #making copy of every field because it is dict and 
        # if we change it it will affect the pre rendered dict 
        
        field_to_change = field.copy()
        field_to_change['multiple'] = True if field_to_change['type'] == 'SelectMultiple' else False
   
        field_to_change['type'] = self.DJANGO_WIDGET_TO_HTML_INPUT.get(field_to_change.get('type'))
        
        
        return field_to_change
