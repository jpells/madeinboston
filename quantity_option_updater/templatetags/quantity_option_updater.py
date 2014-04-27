from __future__ import unicode_literals
from cartridge.shop.models import ProductVariation
from decimal import Decimal
from json import dumps
from mezzanine.template import Library

register = Library()

@register.as_tag
def variations_json(variations):
    """
    Gets variations including the num_in_stock attribute into json format.
    """
    fields = [field.name for field in ProductVariation.option_fields()]
    variations_json = dumps([dict([(field, str(getattr(variation, field))) if isinstance(getattr(variation, field), Decimal) else (field, getattr(variation, field))
        for field in fields + ["sku", "image_id", "num_in_stock"]]) for variation in variations])
    return variations_json

@register.as_tag
def has_available_variations(variations):
    """
    Determines if any variation of the product has a price and a quantity in stock.
    """
    return any([variation.has_price() and variation.num_in_stock for variation in variations])