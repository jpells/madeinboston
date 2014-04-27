from __future__ import unicode_literals

from django.conf.urls import patterns, url

from mezzanine.conf import settings


# Trailing slash for urlpatterns based on setup.
_slash = "/" if settings.APPEND_SLASH else ""

# Instagram patterns.
urlpatterns = patterns("mezzanine_instagram_feed.views",
    url("^$", "instagram_list", name="instagram_list"),
)
