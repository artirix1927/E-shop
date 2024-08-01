import graphene


from .mutations_logic import UpdateInstance, DeleteInstances, CreateInstance


class ModelInstanceMutations(graphene.ObjectType):
    update_model_instance = UpdateInstance.Field()
    delete_instances = DeleteInstances.Field()
    create_model_instance = CreateInstance.Field()
    