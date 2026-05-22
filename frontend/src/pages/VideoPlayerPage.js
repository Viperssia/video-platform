import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

function VideoPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [viewRecorded, setViewRecorded] = useState(false);

  const getToken = () => localStorage.getItem('access');

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/videos/${id}/`);
      setVideo(response.data);
      setLiked(response.data.user_has_liked || false);
      setLoading(false);
      
      if (!viewRecorded) {
        try {
          await axios.post(`${API_URL}/api/videos/${id}/increment_views/`);
          setVideo(prev => ({ ...prev, views: (prev?.views || 0) + 1 }));
        } catch (e) {
          console.log('Просмотр не засчитан');
        }
        setViewRecorded(true);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Видео не найдено');
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/videos/${id}/like/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLiked(response.data.liked);
      setVideo(prev => ({ ...prev, likes_count: response.data.likes_count }));
    } catch (error) {
      console.error('Ошибка лайка:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/api/videos/${id}/comment/`, 
        { text: commentText },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setVideo(prev => ({
        ...prev,
        comments: [response.data, ...(prev.comments || [])],
        comments_count: (prev.comments_count || 0) + 1
      }));
      setCommentText('');
    } catch (error) {
      console.error('Ошибка комментария:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить это видео?')) return;
    
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/api/videos/${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('✅ Видео удалено');
      navigate('/');
    } catch (error) {
      alert('❌ Не удалось удалить видео');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
        <p>Загрузка видео...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div style={{ textAlign: 'center', padding: 50, color: 'red' }}>
        ❌ {error || 'Видео не найдено'}
      </div>
    );
  }

  const videoUrl = `${API_URL}/api/videos/${id}/stream/`;
  const currentUser = (() => {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username;
    } catch (e) {
      return null;
    }
  })();
  const isAuthor = currentUser === video.uploaded_by_name;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 16px' }}>
      {/* СТАНДАРТНЫЙ HTML5 ПЛЕЕР */}
      <div style={{
        backgroundColor: '#000',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20
      }}>
        <video
          src={videoUrl}
          controls
          autoPlay
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '70vh',
            objectFit: 'contain',
            display: 'block'
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Ваш браузер не поддерживает видео тег.
        </video>
      </div>

      {/* Информация о видео */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 20,
        padding: '16px 20px',
        marginBottom: 20
      }}>
        <h1 style={{ fontSize: 'clamp(18px, 5vw, 24px)', marginBottom: 12 }}>{video.title}</h1>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6c757d', flexWrap: 'wrap' }}>
            <span>👤 {video.uploaded_by_name}</span>
            <span>👁️ {video.views} просмотров</span>
            <span>❤️ {video.likes_count || 0} лайков</span>
          </div>
          
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleLike}
              style={{
                background: liked ? '#f093fb' : '#f0f0f0',
                border: 'none',
                fontSize: 14,
                padding: '8px 20px',
                borderRadius: 40,
                cursor: 'pointer',
                color: liked ? 'white' : '#666',
                fontWeight: 500
              }}
            >
              {liked ? '❤️' : '🤍'} {video.likes_count || 0}
            </button>
            
            {isAuthor && (
              <button
                onClick={handleDelete}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: 40,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                🗑️ Удалить
              </button>
            )}
          </div>
        </div>
        
        <p style={{ color: '#555', lineHeight: 1.5, fontSize: 14 }}>
          {video.description || 'Нет описания'}
        </p>
      </div>

      {/* Комментарии */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 20,
        padding: '16px 20px',
        marginBottom: 20
      }}>
        <h3 style={{ marginBottom: 16, fontSize: 'clamp(16px, 4vw, 18px)' }}>
          💬 Комментарии ({video.comments_count || 0})
        </h3>
        
        <form onSubmit={handleComment} style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Напишите комментарий..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #e9ecef',
              borderRadius: 30,
              fontSize: 14,
              outline: 'none',
              minWidth: 150
            }}
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 30,
              border: 'none',
              cursor: 'pointer',
              opacity: (submitting || !commentText.trim()) ? 0.6 : 1
            }}
          >
            {submitting ? '...' : 'Отправить'}
          </button>
        </form>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {video.comments && video.comments.length > 0 ? (
            video.comments.map(comment => (
              <div key={comment.id} style={{
                padding: 12,
                background: 'rgba(0,0,0,0.03)',
                borderRadius: 16
              }}>
                <div style={{ fontWeight: 600, marginBottom: 6, color: '#667eea' }}>
                  {comment.username}
                </div>
                <div style={{ fontSize: 14, color: '#333', marginBottom: 6 }}>
                  {comment.text}
                </div>
                <div style={{ fontSize: 11, color: '#aaa' }}>
                  {new Date(comment.created_at).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
              💬 Пока нет комментариев. Будьте первым!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayerPage;