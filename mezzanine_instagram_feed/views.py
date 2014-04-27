from __future__ import unicode_literals

from instagram.client import InstagramAPI

from mezzanine.conf import settings
from mezzanine.utils.views import render


def instagram_list(request, template="instagram/list.html"):
    """
    Display a list of instagram media.
    """
    api = InstagramAPI(access_token=settings.INSTAGRAM_ACCESS_TOKEN)
    recent_media, next = api.user_recent_media(user_id=settings.INSTAGRAM_USER_ID, count=settings.INSTAGRAM_MEDIA_COUNT)
    context = {"recent_media": recent_media,}
    return render(request, template, context)