// test-server.js - самый простой тестовый сервер
const express = require('express');
const app = express();
const PORT = 3000;

// Простой middleware
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
    next();
});

// Простой маршрут
app.get('/api/animals', (req, res) => {
    res.json([
        { id: 1, name: 'Лев', species: 'Млекопитающее' },
        { id: 2, name: 'Орёл', species: 'Птица' }
    ]);
});

// Стартовая страница
app.get('/', (req, res) => {
    res.send(`
        <h1>Сервер работает! ✅</h1>
        <p>API доступно: <a href="/api/animals">/api/animals</a></p>
        <p>Или откройте полный интерфейс: <a href="/index.html">index.html</a></p>
    `);
});

// Запуск
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api/animals`);
});