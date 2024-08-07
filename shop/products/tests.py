import json

from graphene_django.utils.testing import GraphQLTestCase

from shop.test_utils import get_reponse_data, create_product_examples



class ProductsTests(GraphQLTestCase):
    def setUp(self):
        super().setUp()
        create_product_examples()

        

    def test_get_all_categories(self):
        response = self.query('''
        query{
            allCategories{
                name
            }
        }
        ''',
        )

        self.assertResponseNoErrors(response)
        resp_data = get_reponse_data(response)
        self.assertEqual(resp_data, [{"name": "Phones"}, {"name":"Accessories"}])
    
    def test_all_products(self):

        response = self.query('''
        query{
            allProducts{
                name
            }
        }
        ''',
        )

        self.assertResponseNoErrors(response)

        resp_data = get_reponse_data(response)
        self.assertEqual(resp_data, [{'name': 'Iphone 15'}, {'name': 'Iphone 15 case'}])


    def test_product_by_id(self):
        operation_name="ProductById"
        operation_variables = {"id": 1}

        response = self.query('''
        query ProductById($id: Int!){
            productById(id:$id){
                name
            }
        }
        ''',
        operation_name=operation_name,
        variables=operation_variables 
        )

        self.assertResponseNoErrors(response)

        resp_data = get_reponse_data(response)
        self.assertEqual(resp_data, {'name': 'Iphone 15'})

    
    def test_product_by_category(self):
        operation_name="ProductsByCategory"
        operation_variables = {"category": "Phones"}

        response = self.query('''
        query ProductsByCategory($category: String!){
            productsByCategory(category:$category){
                name
            }
        }
        ''',
        operation_name=operation_name,
        variables=operation_variables 
        )

        self.assertResponseNoErrors(response)
        resp_data = get_reponse_data(response)
        self.assertEqual(resp_data, [{'name': 'Iphone 15'}])

    
    def test_products_by_search_with_category(self):
        operation_name="ProductsBySearch"
        operation_variables = {"category": "Phones","search": "15"}

        response = self.query(
        '''
        query ProductsBySearch($category: String!, $search:String!){
            productsBySearch(category:$category, search:$search){
                name
            }
        }
        ''',
        operation_name=operation_name,
        variables=operation_variables 
        )

        self.assertResponseNoErrors(response)

        resp_data = get_reponse_data(response)
        self.assertEqual(resp_data, [{'name': 'Iphone 15'}])


    def test_products_by_search_without_category(self):
        operation_name="ProductsBySearch"
        operation_variables = {"category": "all","search": "15"}
        response = self.query('''
        query ProductsBySearch($category: String!, $search:String!){
            productsBySearch(category:$category, search:$search){
                name
            }
        }
        ''',
        operation_name=operation_name,
        variables=operation_variables 
        )
        
        resp_data = get_reponse_data(response)
        self.assertResponseNoErrors(response)
        self.assertEqual(resp_data, [{'name': 'Iphone 15'},
                                     {'name': 'Iphone 15 case'}])