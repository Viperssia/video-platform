import subprocess
import os
from django.core.files import File
from django.conf import settings

def generate_thumbnail(video_instance):
    """
    Генерирует превью из видео с помощью FFmpeg и сохраняет в модель.
    """
    if not video_instance.video_file:
        print("Нет видеофайла")
        return False
    
    video_path = video_instance.video_file.path
    
    if not os.path.exists(video_path):
        print(f"Видеофайл не найден: {video_path}")
        return False
    
    # Путь для сохранения превью
    thumbnail_filename = f"thumb_{video_instance.id}.jpg"
    thumbnail_path = os.path.join(settings.MEDIA_ROOT, 'thumbnails', thumbnail_filename)
    
    # Создаем папку если её нет
    os.makedirs(os.path.dirname(thumbnail_path), exist_ok=True)
    
    # Команда FFmpeg: извлечь кадр на 1-й секунде, размер 320x180
    cmd = [
        'ffmpeg',
        '-i', video_path,           # входной файл
        '-ss', '00:00:01',          # на 1-й секунде
        '-vframes', '1',            # только 1 кадр
        '-vf', 'scale=320:180',     # размер 320x180
        '-y',                       # перезаписать если есть
        thumbnail_path
    ]
    
    print(f"Выполняем команду: {' '.join(cmd)}")
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0 and os.path.exists(thumbnail_path):
            print(f"Превью создано: {thumbnail_path}")
            # Сохраняем в модель
            with open(thumbnail_path, 'rb') as f:
                video_instance.thumbnail.save(thumbnail_filename, File(f), save=True)
            print(f"Превью сохранено в БД")
            return True
        else:
            print(f"FFmpeg ошибка: {result.stderr}")
            return False
    except Exception as e:
        print(f"Ошибка при генерации превью: {e}")
        return False