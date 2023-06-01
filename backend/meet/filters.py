from django_filters import FilterSet, CharFilter

from meet.models import Room


class RoomFilter(FilterSet):
    search = CharFilter(field_name='title', lookup_expr='icontains')

    class Meta:
        model = Room
        fields = ('search',)
