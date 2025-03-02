import graphene

import products.gql.types as gql_types

from products.models import Category, Product

from django.db.models import Q

from shop.cache_class import QuerysetCache
from django.core.cache import cache


redis_cache = QuerysetCache("products")

# cache.set('foo', 'bar')


class ProductQueries(graphene.ObjectType):
    all_products = graphene.List(
        gql_types.ProductType,
        offset=graphene.Int(),
        limit=graphene.Int())
    products_by_category = graphene.List(
        gql_types.ProductType,
        category=graphene.String(),
        offset=graphene.Int(),
        limit=graphene.Int())
    product_by_id = graphene.Field(
        gql_types.ProductType,
        offset=graphene.Int(),
        limit=graphene.Int(),
        id=graphene.Int())
    products_by_search = graphene.List(
        gql_types.ProductType,
        offset=graphene.Int(),
        limit=graphene.Int(),
        search=graphene.String(),
        category=graphene.String())

    def resolve_all_products(root, info, offset, limit):
        query = Product.objects.prefetch_related('attachments').all()[
            offset: offset+limit]
        queryset = redis_cache.get(query)
        return queryset

    def resolve_product_by_id(root, info, id):
        return Product.objects.get(pk=id)

    def resolve_products_by_category(root, info, offset, limit, category):
        query = Product.objects.prefetch_related('attachments').filter(
            category__name=category)[offset:offset + limit]

        queryset = redis_cache.get(query)
        return queryset

    def resolve_products_by_search(
            root,
            info,
            offset,
            limit,
            category,
            search):

        category_for_filter = Category.get_category_by_dropdown_value(category)

        products_with_name_annotated = Product.objects.prefetch_related(
            'attachments').annotate(name_matches=Q(name__icontains=search))
        products_filtered_by_search = products_with_name_annotated.filter(
            (Q(description__icontains=search) | Q(name_matches=True)) & category_for_filter)
        products_ordered_by_name_matches = products_filtered_by_search.order_by(
            "-name_matches")

        return redis_cache.get(products_ordered_by_name_matches[offset:offset + limit])


class CategoryQueries(graphene.ObjectType):
    all_categories = graphene.List(gql_types.CategoryType)

    def resolve_all_categories(root, info):
        return Category.objects.all()
