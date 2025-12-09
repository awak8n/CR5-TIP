cat > src/data/animals.js << 'EOF'
module.exports = [
  {
    id: 1,
    name: 'Лев',
    species: 'Млекопитающее',
    age: 7,
    habitat: 'Саванна',
    description: 'Король джунглей',
    createdAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: 2,
    name: 'Орёл',
    species: 'Птица',
    age: 4,
    habitat: 'Горы',
    description: 'Хищная птица с острым зрением',
    createdAt: '2024-01-16T14:20:00.000Z'
  },
  {
    id: 3,
    name: 'Дельфин',
    species: 'Млекопитающее',
    age: 10,
    habitat: 'Океан',
    description: 'Умное морское млекопитающее',
    createdAt: '2024-01-17T09:15:00.000Z'
  },
  {
    id: 4,
    name: 'Панда',
    species: 'Млекопитающее',
    age: 3,
    habitat: 'Бамбуковый лес',
    description: 'Милое животное, питающееся бамбуком',
    createdAt: '2024-01-18T11:45:00.000Z'
  },
  {
    id: 5,
    name: 'Кобра',
    species: 'Пресмыкающееся',
    age: 2,
    habitat: 'Джунгли',
    description: 'Ядовитая змея с капюшоном',
    createdAt: '2024-01-19T16:10:00.000Z'
  }
];
EOF