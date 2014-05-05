from cartridge.shop.forms import OrderForm
from cartridge.shop.payment.paypal import COUNTRIES
from django import forms

class MyOrderForm(OrderForm):
    def __init__(self, *args, **kwargs):
        super(MyOrderForm, self).__init__(*args, **kwargs)
        if not isinstance(self.fields['billing_detail_country'].widget, forms.widgets.HiddenInput):
            billing_country = forms.Select(choices=COUNTRIES)
            self.fields['billing_detail_country'].widget = billing_country
        if not isinstance(self.fields['shipping_detail_country'].widget, forms.widgets.HiddenInput):
            shipping_country = forms.Select(choices=COUNTRIES)
            self.fields['shipping_detail_country'].widget = shipping_country
