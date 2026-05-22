import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API_URL from '../config';
// const API_URL = 'http://localhost:8000';

function LoginPage({ setIsAuthenticated, setUsername }) {
  const [username, setUsernameState] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Отправка данных:', { username, password });
    
    try {
      const response = await axios.post(`${API_URL}/api/token/`, {
        username: username,
        password: password
      });
      
      console.log('Ответ сервера:', response.data);
      
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('username', username);
      
      if (setIsAuthenticated) setIsAuthenticated(true);
      if (setUsername) setUsername(username);
      
      navigate('/');
    } catch (err) {
      console.error('Ошибка входа:', err.response?.data || err.message);
      
      if (err.response?.status === 401) {
        setError('Неверное имя пользователя или пароль');
      } else {
        setError('Ошибка сервера. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Добро пожаловать</h1>
        <p className="auth-subtitle">Войдите в свой аккаунт</p>
        
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
            ❌ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Имя пользователя</label>
            <input
              type="text"
              className="form-input"
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsernameState(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              className="form-input"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="auth-footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;