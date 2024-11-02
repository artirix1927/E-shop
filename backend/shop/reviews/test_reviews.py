import pytest
from shop.test_utils import get_reponse_data
from shop.fixtures import client_query, first_product, second_product, user, first_review, phone_category


@pytest.mark.django_db
def test_create_review(client_query, first_product, user):
    response = client_query('''
                             mutation CreateReview ($userId: Int!, $stars:Int!, $text: String!, $productId: Int!, fils: Upload!){
                                 createReview(userId:$userId,stars:$stars text:$text, productId$productId files:$files){
                                     success
                                 }
                             }
                             
                             ''', operation_name="CreateReview",
                            variables={"userId": user.id, "stars": 5, "text": "123,123,4321", "productId": first_product.id})

    assert 'errors' not in response


@pytest.mark.django_db
def test_all_reviews(client_query, first_review, user):
    response = client_query('''
                             query AllReviews{
                                 allReviews{
                                    stars
                                    text
                                 }
                             }
                             
                             ''', operation_name="AllReviews")

    assert 'errors' not in response
    assert get_reponse_data(response) == [{"stars": 5, "text": "123,123,123"}]
