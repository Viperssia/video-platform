# 🎬 CineFlow - Видеоплатформа

Современная веб-платформа для потокового видео с возможностью просмотра, загрузки и управления контентом.

![React](https://img.shields.io/badge/React-18-blue)
![Django](https://img.shields.io/badge/Django-5.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-24-blue)

---

## 📌 О проекте

CineFlow — полноценная видеоплатформа, разработанная в рамках курсового проекта по дисциплине «Веб-технологии».

### Основные возможности

- ✅ Регистрация и авторизация (JWT-токены)
- ✅ Загрузка видеофайлов (MP4, MOV, AVI)
- ✅ Потоковое воспроизведение с поддержкой скроллинга
- ✅ Лайки и комментарии к видео
- ✅ Счётчик просмотров
- ✅ Управление своими видео (удаление)
- ✅ Адаптивный дизайн (мобильные устройства)

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

```text
CineFlow/
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   └── urls.py
│   ├── users/
│   ├── videos/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── media/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── UploadPage.js
│   │   │   ├── VideoPlayerPage.js
│   │   │   └── MyVideosPage.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🚀 Запуск проекта

### Локальный запуск

#### 1. Запуск бэкенда
```bash
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
# source venv/bin/activate # Mac/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
* Бэкенд: `http://localhost:8000`

#### 2. Запуск фронтенда
```bash
cd frontend
npm install
npm start
```
* Фронтенд: `http://localhost:80`

### Запуск через Docker
```bash
docker-compose up --build
```
* Фронтенд: `http://localhost`
* Бэкенд: `http://localhost:8000`
* Админка: `http://localhost:8000/admin`

---

## 📡 API Endpoints


| Метод | Эндпоинт | Описание | Авторизация |
|-------|----------|----------|:-----------:|
| POST | `/api/register/` | Регистрация | ❌ |
| POST | `/api/token/` | Вход (JWT) | ❌ |
| POST | `/api/token/refresh/` | Обновление токена | ❌ |
| GET | `/api/videos/` | Список видео | ❌ |
| POST | `/api/videos/` | Загрузка видео | ✅ |
| GET | `/api/videos/{id}/` | Детали видео | ❌ |
| DELETE | `/api/videos/{id}/` | Удаление видео | ✅ |
| GET | `/api/videos/{id}/stream/` | Стриминг видео | ❌ |
| POST | `/api/videos/{id}/like/` | Лайк/дизлайк | ✅ |
| POST | `/api/videos/{id}/comment/` | Комментарий | ✅ |
| POST | `/api/videos/{id}/increment_views/` | Просмотр | ❌ |

### Пример загрузки видео
```bash
curl -X POST http://localhost:8000/api/videos/ \
  -H "Authorization: Bearer <access_token>" \
  -F "title=Мое видео" \
  -F "video_file=@video.mp4"
```

### Пример ответа
```json
{
  "id": 1,
  "title": "Мое видео",
  "video_file": "/media/videos/video.mp4",
  "views": 0,
  "likes_count": 0,
  "comments_count": 0
}
```

---

## 🎨 UI/UX решения


| Элемент | Стиль |
|---|---|
| **Основной фон** | Градиент (`#667eea` → `#f093fb`) |
| **Карточки видео** | Белый полупрозрачный фон, тень |
| **Скругления** | 16–30px |
| **Анимация** | Плавное появление, подъём при наведении |
| **Адаптив** | Сетка (1–4 колонки) |

---

## 🔧 Архитектурные решения

### Видео-стриминг (HTTP Range)
```python
range_header = request.headers.get('Range')
if range_header:
    response = HttpResponse(data, status=206)
    response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
```

### Аутентификация (JWT)
* Access token — 1 день
* Refresh token — 7 дней
* Хранение в `localStorage`

---

## 📝 Трудности и решения


| Проблема | Решение |
|---|---|
| Видео не скроллится | HTTP Range header |
| CORS-ошибки | `django-cors-headers` |
| Вертикальное видео обрезается | `objectFit: 'contain'` |
| Чужие видео в «Моих видео» | Фильтрация по `uploaded_by_name` |

