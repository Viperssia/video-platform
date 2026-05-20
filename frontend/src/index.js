import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // <- импортируем BrowserRouter
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>          {/* <-- Оборачиваем App в роутер */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);