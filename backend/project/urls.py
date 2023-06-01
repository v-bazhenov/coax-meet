from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="COAX Meet API",
        default_version='v1',
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

api_urlpatterns_v1 = [
    path("auth/", include(("authentication.urls", 'auth'))),
    path("meet/", include(("meet.urls", 'meet')))
]

urlpatterns = [
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-swagger-ui'),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/', include(api_urlpatterns_v1)),
]

urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
)
