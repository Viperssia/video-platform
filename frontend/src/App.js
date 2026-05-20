import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import MyVideosPage from './pages/MyVideosPage';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    const savedUsername = localStorage.getItem('username');
    if (token) {
      setIsAuthenticated(true);
      if (savedUsername) setUsername(savedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
    navigate('/');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <Link to="/">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">Cine<span className="logo-accent">Flow</span></span>
          </Link>
        </div>
        <div className="nav">
          {isAuthenticated ? (
            <>
              <Link to="/my-videos">📼 Мои видео</Link>
              <Link to="/upload">+ Загрузить</Link>
              <span className="username">👤 {username}</span>
              <button onClick={handleLogout} className="logout-btn">Выйти</button>
            </>
          ) : (
            <>
              <Link to="/upload">+ Загрузить</Link>
              <Link to="/login">Войти</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </div>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/video/:id" element={<VideoPlayerPage />} />
          <Route path="/my-videos" element={<MyVideosPage />} />
        </Routes>
      </main>
      
      {/* ФУТЕР */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🎬</span>
              <span>CineFlow</span>
            </div>
            <p>Современная видеоплатформа для просмотра, загрузки и обмена видео.</p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">🎵</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Навигация</h4>
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/upload">Загрузить видео</Link></li>
              {isAuthenticated && <li><Link to="/my-videos">Мои видео</Link></li>}
              {!isAuthenticated && <li><Link to="/login">Вход</Link></li>}
              {!isAuthenticated && <li><Link to="/register">Регистрация</Link></li>}
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>О проекте</h4>
            <ul>
              <li><a href="#">О платформе</a></li>
              <li><a href="#">Помощь</a></li>
              <li><a href="#">Правила</a></li>
              <li><a href="#">Контакты</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Подписаться</h4>
            <p>Будьте в курсе новостей</p>
            <div className="subscribe-form">
              <input type="email" placeholder="Ваш email" />
              <button>→</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 CineFlow. Все права защищены.</p>
          <p>Сделано с ❤️ для видеолюбителей</p>
        </div>
      </footer>
    </div>
  );
}

export default App;