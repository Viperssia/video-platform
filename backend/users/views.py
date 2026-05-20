from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    print("=" * 50)
    print("ПОЛУЧЕН ЗАПРОС НА РЕГИСТРАЦИЮ")
    print("Данные:", request.data)
    print("=" * 50)
    
    # Получаем данные
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    email = request.data.get('email', '').strip()
    
    # Проверки
    if not username:
        return Response({'error': 'Имя пользователя обязательно'}, status=400)
    
    if not password:
        return Response({'error': 'Пароль обязателен'}, status=400)
    
    if len(password) < 6:
        return Response({'error': 'Пароль должен содержать минимум 6 символов'}, status=400)
    
    # Проверяем, существует ли пользователь
    if User.objects.filter(username=username).exists():
        return Response({'error': f'Пользователь "{username}" уже существует'}, status=400)
    
    # Проверяем email (если указан)
    if email:
        try:
            validate_email(email)
        except ValidationError:
            return Response({'error': 'Некорректный email'}, status=400)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Пользователь с таким email уже существует'}, status=400)
    
    # Создаём пользователя
    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        print(f"✅ Пользователь {username} успешно создан!")
        return Response({
            'message': 'User created successfully',
            'username': user.username,
            'id': user.id
        }, status=201)
    except Exception as e:
        print(f"❌ Ошибка создания: {e}")
        return Response({'error': f'Ошибка сервера: {str(e)}'}, status=500)