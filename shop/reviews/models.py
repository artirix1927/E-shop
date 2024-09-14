

from django.db import models

from django.contrib.auth.models import User

from products.models import Product


class Attachment(models.Model):
    '''The model enables stroing mutlitple images in one field in django'''
    
    def review_save_path(instance, filename) -> str: 
        return 'images/reviews{0}/{1}'.format(instance.review.id, filename) 
    
    image = models.ImageField(upload_to=review_save_path)
    review = models.ForeignKey('Review', on_delete=models.CASCADE, related_name='attachments')
    
    def __str__(self) -> str:
        return f"Attachment for review #{self.review.id}"




class Review(models.Model):
    STAR_CHOICES = [tuple((i,i)) for i in range(1,6)]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stars = models.IntegerField(choices=STAR_CHOICES, default=5)
    text = models.TextField()
    product = models.ForeignKey(Product,  on_delete=models.CASCADE, related_name='reviews')
    
    def __str__(self) -> str:
        return f"Review for {self.product.name} -> {self.stars} stars : {self.user.username}"
    
 