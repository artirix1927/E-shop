

from admin.classes.admin_reg import Admin

from shop.cache_class import QuerysetCache


admin: Admin = Admin.get_class_instance(redis_cache=QuerysetCache("admin"))
