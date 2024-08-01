
import graphene
from main.gql.mutations_logic import CreateUser, LoginUser, LogoutUser

class RegistrationMutations(graphene.ObjectType):
    create_user= CreateUser.Field()
    login_user = LoginUser.Field()
    logout_user = LogoutUser.Field()


