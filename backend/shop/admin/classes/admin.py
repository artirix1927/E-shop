

from admin.classes.admin_reg import Admin

from shop.redis_cache_class import QuerysetCache


admin: Admin = Admin.get_class_instance(redis_cache=QuerysetCache("admin"))
