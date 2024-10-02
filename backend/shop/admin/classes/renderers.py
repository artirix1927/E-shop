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

        new_fields = [self.set_html_input_type(
            # for regular fields
            field) for field in self.instance.get('fields')]

        return {'fields': new_fields}

    def set_html_input_type(self, field: dict) -> dict:
        # making copy of every field because it is dict and
        # if we change it it will affect the pre rendered dict

        field_to_change = field.copy()
        field_to_change['multiple'] = True if field_to_change['type'] == 'SelectMultiple' else False
        field_to_change['type'] = self.DJANGO_WIDGET_TO_HTML_INPUT.get(
            field_to_change.get('type'))

        return field_to_change
