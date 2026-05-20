from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse, Http404
from .models import Video, Like, Comment
from .serializers import VideoSerializer, CommentSerializer
import os
import re

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-created_at')
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_views(self, request, pk=None):
        video = self.get_object()
        video.increment_views()
        return Response({'views': video.views})
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        video = self.get_object()
        like, created = Like.objects.get_or_create(user=request.user, video=video)
        if not created:
            like.delete()
            liked = False
        else:
            liked = True
        return Response({'liked': liked, 'likes_count': video.likes.count()})
    
    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        video = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, video=video)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def stream(self, request, pk=None):
        video = self.get_object()
        video_path = video.video_file.path
        
        if not os.path.exists(video_path):
            raise Http404("Video not found")
        
        range_header = request.headers.get('Range', None)
        file_size = os.path.getsize(video_path)
        
        if range_header:
            m = re.search(r'bytes=(\d+)-(\d*)', range_header)
            start = int(m.group(1))
            end = int(m.group(2)) if m.group(2) else file_size - 1
            length = end - start + 1
            
            with open(video_path, 'rb') as f:
                f.seek(start)
                data = f.read(length)
            
            response = HttpResponse(data, status=206, content_type='video/mp4')
            response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
            response['Accept-Ranges'] = 'bytes'
            response['Content-Length'] = length
            return response
        else:
            response = HttpResponse(content_type='video/mp4')
            response['Accept-Ranges'] = 'bytes'
            with open(video_path, 'rb') as f:
                response.write(f.read())
            return response