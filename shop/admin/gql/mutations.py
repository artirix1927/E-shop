import graphene

import admin.gql.mutations_logic as mutations_logic

class ModelInstanceMutations(graphene.ObjectType):
    update_model_instance = mutations_logic.UpdateInstance.Field()
    delete_instances = mutations_logic.DeleteInstances.Field()
    create_model_instance = mutations_logic.CreateInstance.Field()
    