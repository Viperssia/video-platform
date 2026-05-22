import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../config';

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/videos/`)
      .then(response => {
        setVideos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки видео:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="hero">
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
        <p>Загрузка видео...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="hero">
        <h1>Добро пожаловать в CineFlow</h1>
        <p>Смотрите, загружайте и делитесь видео</p>
        <div className="hero-buttons">
          <Link to="/upload" className="btn-primary">🚀 Загрузить видео</Link>
          <Link to="/register" className="btn-secondary">📝 Регистрация</Link>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="hero">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p>Пока нет видео</p>
          <Link to="/upload" className="btn-primary">Загрузить первое видео</Link>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(video => (
            <Link to={`/video/${video.id}`} key={video.id} className="video-card">
              <div className="video-thumbnail">🎬</div>
              <div className="video-info">
                <div className="video-title">{video.title}</div>
                <div className="video-meta">
                  <span>{video.uploaded_by_name || 'Аноним'}</span>
                  <span>• {video.views || 0} просмотров</span>
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