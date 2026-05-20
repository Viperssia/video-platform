from rest_framework import serializers
from .models import Video, Like, Comment

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Comment
        fields = ['id', 'username', 'text', 'created_at']
        read_only_fields = ['user', 'created_at']

class VideoSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.ReadOnlyField(source='uploaded_by.username')
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    user_has_liked = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'video_file', 'thumbnail', 
                  'uploaded_by', 'uploaded_by_name', 'views', 'created_at',
                  'likes_count', 'comments_count', 'user_has_liked', 'comments']
        read_only_fields = ['uploaded_by', 'views', 'created_at', 'likes_count', 'comments_count']
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(video=obj, user=request.user).exists()
        return False