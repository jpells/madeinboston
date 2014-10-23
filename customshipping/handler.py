from __future__ import unicode_literals

from django.utils.translation import ugettext as _

from mezzanine.conf import settings

from cartridge.shop.utils import set_shipping

def billship_handler(request, order_form):
    """
    Custom billing/shipping handler - called when the first step in
    the checkout process with billing/shipping address fields is
    submitted. Implement your own and specify the path to import it
    from via the setting ``SHOP_HANDLER_BILLING_SHIPPING``.
    This function will typically contain any shipping calculation
    where the shipping amount can then be set using the function
    ```cartridge.shop.utils.set_shipping``. The Cart object is also
    accessible via ``request.cart``
    """
    if not request.session.get("free_shipping"):
        settings.use_editable()
        if order_form.cleaned_data['shipping_detail_country'].lower() in ['united states', 'usa', 'us',]:
            set_shipping(request, _("Shipping"),
                settings.SHOP_DEFAULT_SHIPPING_VALUE)
        else:
            set_shipping(request, _("Shipping"),
                settings.SHOP_FOREIGN_SHIPPING_VALUE)
