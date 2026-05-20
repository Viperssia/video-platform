import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function MyVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const getCurrentUser = () => {
    let username = localStorage.getItem('username');
    if (username) return username;
    
    const token = localStorage.getItem('access');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        username = payload.username;
        if (username) localStorage.setItem('username', username);
        return username;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login');
      return;
    }
    
    const user = getCurrentUser();
    setCurrentUser(user);
    fetchVideos(user);
  }, [navigate]);

  const fetchVideos = async (user) => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(`${API_URL}/api/videos/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Ответ API:', response.data);
      
      // Проверяем, что response.data - это массив
      let allVideos = [];
      if (Array.isArray(response.data)) {
        allVideos = response.data;
      } else if (response.data.results && Array.isArray(response.data.results)) {
        allVideos = response.data.results;
      } else {
        console.error('API вернул не массив:', response.data);
        allVideos = [];
      }
      
      // Фильтруем видео текущего пользователя
      const userVideos = allVideos.filter(video => video.uploaded_by_name === user);
      console.log(`Видео пользователя ${user}:`, userVideos.length);
      
      setVideos(userVideos);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Вы уверены, что хотите удалить это видео?')) return;
    
    setDeletingId(videoId);
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`${API_URL}/api/videos/${videoId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setVideos(videos.filter(v => v.id !== videoId));
      alert('✅ Видео удалено');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('❌ Не удалось удалить видео');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
          <p>Загрузка ваших видео...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
      <div style={{
        textAlign: 'center',
        marginBottom: 40,
        padding: '40px 20px',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 30
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📼</div>
        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          marginBottom: 12,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Мои видео
        </h1>
        <p style={{ color: '#6c757d', fontSize: 16 }}>
          {currentUser ? `Вы вошли как ${currentUser}` : 'Управляйте своими видео'}
        </p>
      </div>

      {videos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 64,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 30
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>📭</div>
          <h3 style={{ fontSize: 24, marginBottom: 12, color: '#4a5568' }}>У вас пока нет видео</h3>
          <p style={{ color: '#6c757d', marginBottom: 32, fontSize: 16 }}>
            Загрузите своё первое видео и поделитесь им с миром!
          </p>
          <Link to="/upload" className="btn-primary" style={{ textDecoration: 'none' }}>
            🎬 Загрузить видео
          </Link>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ color: '#6c757d', fontSize: 14 }}>
              Всего видео: <strong style={{ color: '#667eea' }}>{videos.length}</strong>
            </p>
            <Link to="/upload" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: 14 }}>
              + Загрузить новое
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {videos.map(video => (
              <div key={video.id} style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 20,
                padding: 20,
                display: 'flex',
                gap: 20,
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  width: 160,
                  height: 90,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  color: 'white',
                  flexShrink: 0
                }}>
                  🎬
                </div>
                
                <div style={{ flex: 1 }}>
                  <Link to={`/video/${video.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>
                      {video.title}
                    </h3>
                  </Link>
                  <div style={{ display: 'flex', gap: 20, color: '#6c757d', fontSize: 13, flexWrap: 'wrap' }}>
                    <span>👁️ {video.views || 0} просмотров</span>
                    <span>❤️ {video.likes_count || 0} лайков</span>
                    <span>📅 {new Date(video.created_at).toLocaleDateString()}</span>
                  </div>
                  {video.description && (
                    <p style={{ marginTop: 10, color: '#888', fontSize: 13 }}>
                      {video.description.length > 80 ? video.description.slice(0, 80) + '...' : video.description}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => handleDelete(video.id)}
                  disabled={deletingId === video.id}
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 24px',
                    borderRadius: 30,
                    cursor: deletingId === video.id ? 'not-allowed' : 'pointer',
                    fontSize: 14,
                    fontWeight: 500
                  }}
                >
                  {deletingId === video.id ? 'Удаление...' : '🗑️ Удалить'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MyVideosPage;