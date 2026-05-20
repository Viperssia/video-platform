import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    axios.get(`${API_URL}/api/videos/`)
      .then(response => {
        console.log('Ответ API:', response.data);
        // Убеждаемся, что response.data - это массив
        if (Array.isArray(response.data)) {
          setVideos(response.data);
        } else {
          console.error('API вернул не массив:', response.data);
          setVideos([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки видео:', error);
        setError('Не удалось загрузить видео');
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
          <p>Загрузка видео...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <p style={{ color: 'red' }}>❌ {error}</p>
          <p>Проверьте, запущен ли бэкенд на {API_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px' }}>
      <div style={{
        textAlign: 'center',
        padding: '60px 32px',
        marginBottom: 48,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 30,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎬✨</div>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 56px)',
          fontWeight: 800,
          marginBottom: 16,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Добро пожаловать в CineFlow
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: '#4a5568',
          maxWidth: 600,
          margin: '0 auto 32px',
          lineHeight: 1.6
        }}>
          Откройте для себя мир удивительных видео. Загружайте свои работы, 
          делитесь впечатлениями и вдохновляйтесь вместе с нами.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/upload" className="btn-primary" style={{ textDecoration: 'none' }}>
            🚀 Загрузить видео
          </Link>
          <Link to="/register" className="btn-secondary" style={{ textDecoration: 'none' }}>
            📝 Регистрация
          </Link>
        </div>
      </div>

      {videos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 64,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 24
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>📭</div>
          <p style={{ fontSize: 18, marginBottom: 24 }}>Пока нет видео</p>
          <Link to="/upload" className="btn-primary" style={{ textDecoration: 'none' }}>
            + Загрузить первое видео
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 28
        }}>
          {videos.map((video, index) => (
            <Link 
              to={`/video/${video.id}`} 
              key={video.id} 
              className="video-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="video-thumbnail">
                🎬
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title || 'Без названия'}</h3>
                <div className="video-meta">
                  <span>👤 {video.uploaded_by_name || 'Аноним'}</span>
                  <span>👁️ {video.views || 0} просмотров</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;