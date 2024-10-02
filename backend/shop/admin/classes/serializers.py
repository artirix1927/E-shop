

from rest_framework.serializers import BaseSerializer
from django.contrib.admin.filters import FieldListFilter


from admin.funcs import is_jsonable


class FormSerializer(BaseSerializer):
    '''Custom Form Serializer that
    serializes model form  in order to get that form in admin'''

    def to_representation(self, instance):
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

        input_type = field.widget.input_type if hasattr(
            field.widget, "input_type") else 'text'

        # input_type = str(input_type)
        field_data = {
            "name": field_name,
            "widget": field.widget.__class__.__name__,
            "type": input_type,
            "required": field.required,
            "label": field.label,
            "help_text": field.help_text,
            "initial": self.get_initial(field_name,),
        }

        if hasattr(field, 'choices'):
            choices = self.get_list_of_field_choices(field.choices)
            field_data["choices"] = choices

        # gotta do something with password fields in the future
        if field_name == 'password':
            field_data['readonly'] = True

        return field_data

    def get_list_of_field_choices(self, choices) -> list[tuple[str, str]]:
        '''field choices of some specific select field '''
        # str(choice[0]) converting the select value
        # object to string in order to get the data
        return [(str(choice[0]), choice[1]) for choice in choices]

    def get_initial(self, field):
        # if it is jsonable return the initial value if not trying to convert it to str
        # because in most cases the inital value classes return their value in
        # str method
        if is_jsonable(self.instance.initial.get(field, '')):
            return self.instance.initial.get(field, '')

        try:
            return str(self.instance.initial.get(field, ''))
        except Exception as e:
            raise e


class FilterSerializer(BaseSerializer):

    '''serializes filter_data intsance_field that is a subclass of simple list filter
    just calls for __dict__.items() for that field
    '''

    def to_representation(self, instance: list):
        # print(instance)
        return self.serialize_filter_data()

    def serialize_filter_data(self) -> list:
        serialized_filter_data = [self.serialize_one_filter(
            filter) for filter in self.instance]

        return serialized_filter_data

    def serialize_one_filter(self, filter: dict) -> dict:
        '''serializing one filter dict'''
        filter = filter.copy()
        for key, value in filter.items():

            if isinstance(value, FieldListFilter):
                filter[key] = value.__dict__.copy()

        return filter
