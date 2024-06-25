from django.db.models.signals import post_delete
from django.dispatch import receiver
from django_cleanup.signals import cleanup_post_delete
from .models import Attachment
from .funcs import delete_empty_dirs

import os


#//without django cleanup
# @receiver(post_delete, sender=Attachment)
# def delete_file(sender, instance, **kwargs):
#     print(4321)
#     file_field = instance.image
#     if file_field:
#         file_path = file_field.path
#         if os.path.isfile(file_path):
#             os.remove(file_path)
#         dir_path = os.path.dirname(file_path)
#         delete_empty_dirs(dir_path)



@receiver(cleanup_post_delete)
def cleanup_empty_dirs(sender, instance, **kwargs):
    image_path = instance.image.path
    if image_path:
        dir_path = os.path.dirname(image_path)
        delete_empty_dirs(dir_path)