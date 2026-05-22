FROM python:3.11-slim

WORKDIR /app

# Копируем только requirements.txt сначала (для кэширования)
COPY requirements.txt /app/

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt || \
    pip install --no-cache-dir django djangorestframework djangorestframework-simplejwt pillow django-cors-headers gunicorn psycopg2-binary whitenoise dj-database-url

# Копируем остальной код
COPY . /app/

# Собираем статику
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--timeout", "120", "--workers", "3"]