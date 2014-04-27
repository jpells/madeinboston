from __future__ import unicode_literals
from mezzanine.template import Library

register = Library()

@register.as_tag
def available_for_purchase(product):
    """
    Check if product variations are available for purchase.
    """
    variations = product.variations.all()
    return any([variation.has_price() and variation.num_in_stock for variation in variations])
