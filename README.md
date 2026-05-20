# 🎬 CineFlow - Видеоплатформа

Современная веб-платформа для потокового видео с возможностью просмотра, загрузки и управления контентом.

![React](https://img.shields.io/badge/React-18-blue)
![Django](https://img.shields.io/badge/Django-5.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-24-blue)

---

## 📌 О проекте

CineFlow — это полноценная видеоплатформа, разработанная в рамках курсового проекта по дисциплине «Информационные технологии». Проект демонстрирует навыки разработки веб-приложений с использованием современного стека технологий и соблюдением принципов UI/UX-дизайна.

### Основные возможности

- ✅ Регистрация и авторизация (JWT-токены)
- ✅ Загрузка видеофайлов (MP4, MOV, AVI)
- ✅ Потоковое воспроизведение с поддержкой скроллинга
- ✅ Лайки и комментарии к видео
- ✅ Счётчик просмотров
- ✅ Управление своими видео (редактирование, удаление)
- ✅ Адаптивный дизайн (мобильные устройства)
- ✅ Темная/светлая тема

---

## 🛠️ Технологический стек

| Категория | Технологии |
|-----------|-------------|
| **Backend** | Python, Django, Django REST Framework |
| **Аутентификация** | JWT (djangorestframework-simplejwt) |
| **База данных** | PostgreSQL / SQLite |
| **Frontend** | React, React Router, Axios |
| **Стили** | CSS3, адаптивный дизайн |
| **Видео-стриминг** | HTTP Range requests |
| **Контейнеризация** | Docker, Docker Compose |

---



## 📁 Структура проекта

CineFlow/
├── backend/
│ ├── config/
│ │ ├── settings.py # Настройки Django
│ │ └── urls.py # Головные URL-маршруты
│ ├── users/ # Приложение пользователей
│ ├── videos/ # Приложение видео
│ │ ├── models.py # Модель Video, Like, Comment
│ │ ├── views.py # API-контроллеры
│ │ ├── serializers.py # Сериализаторы
│ │ └── urls.py # API-маршруты
│ ├── media/ # Загруженные видео
│ ├── Dockerfile
│ └── requirements.txt
├── frontend/
│ ├── src/
│ │ ├── pages/ # Компоненты страниц
│ │ │ ├── HomePage.js
│ │ │ ├── LoginPage.js
│ │ │ ├── RegisterPage.js
│ │ │ ├── UploadPage.js
│ │ │ ├── VideoPlayerPage.js
│ │ │ └── MyVideosPage.js
│ │ ├── App.js
│ │ ├── App.css
│ │ └── index.js
│ ├── Dockerfile
│ └── package.json
├── docker-compose.yml
└── README.md


---

## 🚀 Запуск проекта

### Требования

- Python 3.11+
- Node.js 18+
- Docker (опционально)

### Локальный запуск

#### 1. Запуск бэкенда

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
