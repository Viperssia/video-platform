from django.contrib import admin
from .models import Video

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'uploaded_by', 'views', 'created_at')
    list_filter = ('uploaded_by', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('id', 'created_at')