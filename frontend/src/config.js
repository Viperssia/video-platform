const getApiUrl = () => {
  // Если открыто с телефона (по IP)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    const ip = window.location.hostname; // берём IP из адресной строки
    return `http://${ip}:8000`;
  }
  // Если локально на компьютере
  return 'http://localhost:8000';
};

const API_URL = getApiUrl();
export default API_URL;