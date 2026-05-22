import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

// const API_URL = 'http://localhost:8000';

function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (!videoFile) {
      setError('Выберите видеофайл');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video_file', videoFile);

    setUploading(true);
    setError('');
    
    try {
      await axios.post(`${API_URL}/api/videos/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setError('Ошибка при загрузке видео');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1 className="upload-title">📤 Загрузить видео</h1>
        
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#ef4444',
            padding: 12,
            borderRadius: 16,
            marginBottom: 20,
            fontSize: 14,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Название видео</label>
            <input
              type="text"
              className="form-input"
              placeholder="Введите название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Расскажите о видео..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical' }}
            />
            <span className="form-hint">Необязательное поле</span>
          </div>
          
          <div className="form-group">
            <label className="form-label">Видеофайл</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
              className="file-input"
            />
            <span className="form-hint">Поддерживаются MP4, MOV, AVI</span>
          </div>
          
          <button
            type="submit"
            className="auth-button"
            disabled={uploading}
          >
            {uploading ? 'Загрузка...' : '📤 Загрузить видео'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;