"""
Default settings for the ``customshipping`` app. Each of these can be
overridden in your project's settings module, just like regular
Django settings. The ``editable`` argument for each controls whether
the setting is editable via Django's admin.

Thought should be given to how a setting is actually used before
making it editable, as it may be inappropriate - for example settings
that are only read during startup shouldn't be editable, since changing
them would require an application reload.
"""
from __future__ import unicode_literals

from django.utils.translation import ugettext_lazy as _

from mezzanine.conf import register_setting


register_setting(
    name="SHOP_FOREIGN_SHIPPING_VALUE",
    label=_("Foreign Shipping Cost"),
    description=_("Cost of shipping to foreign countries."),
    editable=True,
    default=25.0,
)
