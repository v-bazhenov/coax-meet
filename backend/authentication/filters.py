from django.db.models import Q
from django_filters import FilterSet, CharFilter

from authentication.models import User


class UserFilter(FilterSet):
    search = CharFilter(method='filter_by_full_name')

    class Meta:
        model = User
        fields = ('search',)

    def filter_by_full_name(self, queryset, name, value):
        return queryset.filter(
            Q(first_name__icontains=value) | Q(last_name__icontains=value)
        ).exclude(id=self.request.user.id)
