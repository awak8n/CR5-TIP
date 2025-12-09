const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📁 Статические файлы доступны по адресу: http://localhost:${PORT}`);
  console.log(`🔗 API доступно по адресу: http://localhost:${PORT}/api/animals`);
});