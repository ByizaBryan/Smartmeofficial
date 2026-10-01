from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from website.admin_site import smartme_admin_site
from website.views import dashboard_home, public_state, public_submission

urlpatterns = [
    path('', dashboard_home, name='admin_home'),
    path('dashboard/', dashboard_home, name='dashboard_home'),
    path('api/public-state/', public_state, name='public_state'),
    path('api/submissions/', public_submission, name='public_submission'),
    path('admin/', smartme_admin_site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
