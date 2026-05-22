import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API_URL from '../config';

// const API_URL = 'http://localhost:8000';  // ← ДОБАВИТЬ ЭТУ СТРОКУ

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/api/register/`, {
        username: formData.username,
        password: formData.password,
        email: formData.email
      });
      
      console.log('Ответ сервера:', response.data);
      setSuccess('Регистрация успешна! Перенаправляем на вход...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      setError('Ошибка сервера. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Регистрация</h1>
        <p className="auth-subtitle">Создайте новый аккаунт</p>
        
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
        
        {success && (
          <div style={{
            background: '#d1fae5',
            color: '#10b981',
            padding: 12,
            borderRadius: 16,
            marginBottom: 20,
            fontSize: 14,
            textAlign: 'center'
          }}>
            ✅ {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Имя пользователя</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Введите имя пользователя"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Электронная почта</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="my_email@mail.com"
              value={formData.email}
              onChange={handleChange}
            />
            <span className="form-hint">Необязательное поле</span>
          </div>
          
          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Минимум 6 символов"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Подтверждение пароля</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Повторите пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;