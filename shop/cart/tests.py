from graphene_django.utils.testing import GraphQLTestCase
from shop.test_utils import get_reponse_data,create_product_examples
import json

from products.models import Product
from django.contrib.auth.models import User

from .models import CartItem,Order

from .signals import send_order_email_to_user

from django.test.utils import override_settings

from django.db.models.signals import post_save

class CartTests(GraphQLTestCase):

    def setUp(self):
        super().setUp()
        user=User(username="user", email="useremail@gmail.com")
        user.set_password("password")
        user.save()

        _, second_product = create_product_examples()

        CartItem(user=user,product=second_product, quantity=1).save()
    
       
    
    def test_add_to_cart(self):
        query = '''
        mutation AddToCart($userId: Int!, $productId: Int!, $quantity: Int!){
            addToCart(userId:$userId, productId:$productId, quantity:$quantity){
                cartItem{
                    quantity
                }
            }             
        }
        '''
        operation_name="AddToCart"
        operation_variables={"userId": 1, "productId": 1, "quantity":1}

        response = self.query(query,
                             operation_name=operation_name,
                             variables=operation_variables,
        )

        self.assertResponseNoErrors(response)


        response_data = get_reponse_data(response)
        self.assertEqual(response_data.get('cartItem'), {'quantity':1})




        operation_variables={"userId": 1, "productId": 1, "quantity":3}

        response = self.query(query,
                             operation_name=operation_name,
                             variables=operation_variables,
        )
        response_data = get_reponse_data(response)
        self.assertEqual(response_data.get('cartItem'), {'quantity':4})

        
    def test_change_item_cart_quantity(self):

        operation_name = "ChangeItemCartQuantity"
        operation_variables = {"id":1, "quantity":10}
        response = self.query(
        '''
        mutation ChangeItemCartQuantity ($id:Int!, $quantity:Int!){
            changeCartItemQuantity(id:$id, quantity:$quantity){
                cartItem{
                    quantity          
                }     
                            
            }                
        }
        ''',
        operation_name=operation_name,
        variables=operation_variables
        )

        self.assertResponseNoErrors(response)

        response_data = get_reponse_data(response)
        
        self.assertEqual(response_data.get("cartItem"), {"quantity":10})

    def test_cart_by_user(self):
        operation_name = "CartByUser"
        operation_variables = {"id":1}

        response = self.query('''
        query CartByUser($id: Int!){
            cartByUser(id:$id){
                id
            }    
        }
        ''',
        operation_name=operation_name,
        variables=operation_variables)

        self.assertResponseNoErrors(response)



#@override_settings(EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend')
class OrderTests(GraphQLTestCase):


    def setUp(self) -> None:
        user=User(username="user", email="mrartirix1927@gmail.com")
        user.set_password("password")
        user.save()

        first_product, second_product = create_product_examples()

        CartItem(user=user,product=second_product, quantity=1).save()
        CartItem(user=user,product=first_product, quantity=2).save()


    def test_create_order(self):
              
        operation_name = "CreateOrder"
        operation_variables = {"fullName":"art", "phoneNumber":"+972533302094", "country":"Canada", 
                        "adress":"marconi","city":"london","state":"ontario", "postalCode":"n5y zxc", 
                        "user":1, "items":json.dumps([1,2])}


        response = self.query('''
        mutation CreateOrder($fullName: String!, $phoneNumber: String!, $country: String!, 
                              $adress: String!, $city: String!, $state: String!, 
                              $postalCode: String!, $user:Int!, $items:String!){

            createOrder(fullName:$fullName, phoneNumber:$phoneNumber, country:$country, 
                        adress:$adress,city:$city,state:$state, postalCode:$postalCode, 
                        user:$user, items:$items)
                        {
                            success
                        }
        }

        ''',operation_name=operation_name, variables=operation_variables)


        self.assertResponseNoErrors(response)   

    # def test_send_email_signal(self):
    #     post_save.connect(send_order_email_to_user, sender=Order)
    #     Order.objects.create({"fullName":"art", "phoneNumber":"+972533302094", "country":"Canada", 
    #                     "adress":"marconi","city":"london","state":"ontario", "postalCode":"n5y zxc", 
    #                     "user":1, "items":json.dumps([1,2])})
        
       



        
        
        





