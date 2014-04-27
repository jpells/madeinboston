"""
Default settings for the ``mezzanine_instagram_feed`` app. Each of these can be
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
    name="INSTAGRAM_ACCESS_TOKEN",
    description=_("Acess token for instagram developer API."),
    editable=False,
    default="",
)

register_setting(
    name="INSTAGRAM_USER_ID",
    description=_("User id for individual's instagram account to display media from."),
    editable=False,
    default="",
)

register_setting(
    name="INSTAGRAM_MEDIA_COUNT",
    description=_("Count of media from user's instagram account to display."),
    editable=False,
    default=25,
)