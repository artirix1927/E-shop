
import os


def delete_empty_dirs(path):
    if os.path.isdir(path) and not os.listdir(path):
        os.rmdir(path)
        parent_dir = os.path.dirname(path)
        delete_empty_dirs(parent_dir)



  
