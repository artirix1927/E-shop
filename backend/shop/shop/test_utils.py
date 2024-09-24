import json
from products.models import Category, Product


def get_reponse_data(resp):
    '''graphql responses are always 'data' -> query name -> actual data
       so getting the first key of 'data' is always will get me the actual data
       in the response
    '''
    response_data = json.loads(resp.content)['data']

    first_key = tuple(response_data.keys())[0]

    return response_data.get(first_key)


def create_product_examples() -> tuple[Product, Product]:
    try:
        category = Category.objects.create(name="Phones", shortname="phns")
        prodcut_data = {
            "name": "Iphone 15",
            "price": 2999.00,
            "pieces_left": 1,
            "description": "Basically 13 iphone but more expensive!",
            "category": category,
            "weight": 1.1}

        first_product = Product(**prodcut_data)

        category = Category.objects.create(
            name="Accessories", shortname="accssrs")
        prodcut_data = {
            "name": "Iphone 15 case",
            "price": 49.99,
            "pieces_left": 5,
            "description": "Cool phone case",
            "category": category,
            "weight": 0.1}

        second_product = Product(**prodcut_data)

        first_product.save()
        second_product.save()

        return first_product, second_product
    except Exception as e:
        pass
