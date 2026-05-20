import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function VideoPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const viewRecordedRef = useRef(false); // Используем useRef чтобы избежать повторных вызовов

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
      
      // Отправляем просмотр только один раз за сессию
      if (!viewRecordedRef.current) {
        viewRecordedRef.current = true;
        try {
          await axios.post(`${API_URL}/api/videos/${id}/increment_views/`);
          // Обновляем счётчик в UI
          setVideo(prev => ({ ...prev, views: (prev?.views || 0) + 1 }));
        } catch (e) {
          console.log('Просмотр не засчитан');
        }
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'pulse 1.5s ease infinite' }}>🎬</div>
          <p>Загрузка видео...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50, fontSize: 18, color: 'white' }}>
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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
      {/* Видео плеер */}
      <div style={{
        backgroundColor: '#000',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 400
      }}>
        <video
          src={videoUrl}
          controls
          autoPlay
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '80vh',
            display: 'block',
            objectFit: 'contain'
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Ваш браузер не поддерживает видео тег.
        </video>
      </div>

      {/* Информация о видео */}
      <div style={{
        marginTop: 24,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 20,
        padding: 24,
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ fontSize: 28, marginBottom: 12, color: '#1a1a1a' }}>{video.title}</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 24, color: '#6c757d', fontSize: 14 }}>
            <span>👤 {video.uploaded_by_name}</span>
            <span>👁️ {video.views} просмотров</span>
            <span>❤️ {video.likes_count || 0} лайков</span>
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Кнопка лайка */}
            <button
              onClick={handleLike}
              style={{
                background: liked 
                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  : 'linear-gradient(135deg, #e0e0e0 0%, #ccc 100%)',
                border: 'none',
                fontSize: 16,
                cursor: 'pointer',
                padding: '10px 24px',
                borderRadius: 40,
                color: liked ? 'white' : '#666',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.3s ease'
              }}
            >
              {liked ? '❤️' : '🤍'} {video.likes_count || 0}
            </button>
            
            {/* Кнопка удаления (только для автора) */}
            {isAuthor && (
              <button
                onClick={handleDelete}
                style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: 40,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                🗑️ Удалить
              </button>
            )}
          </div>
        </div>
        
        <p style={{ marginTop: 20, color: '#555', lineHeight: 1.6, fontSize: 15 }}>
          {video.description || 'Нет описания'}
        </p>
      </div>

      {/* Комментарии */}
      <div style={{
        marginTop: 24,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 20,
        padding: 24,
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ marginBottom: 20, fontSize: 20 }}>💬 Комментарии ({video.comments_count || 0})</h3>
        
        <form onSubmit={handleComment} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Напишите комментарий..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{
              flex: 1,
              padding: '14px 20px',
              border: '2px solid rgba(102,126,234,0.2)',
              borderRadius: 40,
              fontSize: 14,
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(102,126,234,0.2)'}
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="btn-primary"
            style={{
              padding: '0 28px',
              borderRadius: 40,
              opacity: (submitting || !commentText.trim()) ? 0.6 : 1
            }}
          >
            {submitting ? '...' : 'Отправить'}
          </button>
        </form>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {video.comments && video.comments.length > 0 ? (
            video.comments.map(comment => (
              <div key={comment.id} style={{
                padding: '16px 20px',
                background: 'rgba(102,126,234,0.05)',
                borderRadius: 16,
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: '#667eea' }}>
                  {comment.username}
                </div>
                <p style={{ margin: 0, color: '#333', fontSize: 14, lineHeight: 1.5 }}>
                  {comment.text}
                </p>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 10 }}>
                  {new Date(comment.created_at).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: 48,
              background: 'rgba(102,126,234,0.05)',
              borderRadius: 20,
              color: '#aaa'
            }}>
              💬 Пока нет комментариев. Будьте первым!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayerPage;