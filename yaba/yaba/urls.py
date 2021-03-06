from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import RedirectView
from .settings import MEDIA_URL
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.http import HttpResponse

from django.views.decorators.csrf import csrf_exempt
from allauth.socialaccount.providers.facebook.views import login_by_token


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'yaba0.views.home', name='home'),
    # url(r'^yaba0/', include('yaba0.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    url(r'^', include('yaba0.urls', namespace='yaba0')),
    url(r'^robots\.txt$', lambda r: HttpResponse("User-agent: *\nDisallow: /",mimetype="text/plain")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls',namespace='rest_framework')),
    url(r'^accounts/facebook/login/token/$', csrf_exempt(login_by_token)),
    url(r'^accounts/', include('allauth.urls')),
    #url(r'^favicon\.ico$', RedirectView.as_view(url=MEDIA_URL + 'favicon.ico'))
)

urlpatterns += staticfiles_urlpatterns()
