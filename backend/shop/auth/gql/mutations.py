
import graphene

import auth.gql.mutations_logic as mutations_logic


class RegistrationMutations(graphene.ObjectType):
    create_user = mutations_logic.CreateUser.Field()
    login_user = mutations_logic.LoginUser.Field()
    logout_user = mutations_logic.LogoutUser.Field()
