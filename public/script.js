const API_URL = '/api/animals';

// Проверка статуса сервера
async function checkServerStatus() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            document.getElementById('status').innerHTML = 
                '<span style="color: #2ecc71;">✅ Сервер работает</span>';
        } else {
            document.getElementById('status').innerHTML = 
                '<span style="color: #e74c3c;">⚠️ Сервер недоступен</span>';
        }
    } catch (error) {
        document.getElementById('status').innerHTML = 
            '<span style="color: #e74c3c;">❌ Ошибка подключения</span>';
    }
}

// Получить всех животных
async function fetchAnimals() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.success) {
            displayAnimals(data.data);
            document.getElementById('total-animals').textContent = data.count;
            logResponse('GET /api/animals', data);
        }
    } catch (error) {
        logResponse('GET /api/animals', { error: error.message }, true);
    }
}

// Поиск животных
async function searchAnimals() {
    const species = prompt('Введите вид для поиска (оставьте пустым для пропуска):');
    const age = prompt('Введите возраст для поиска (оставьте пустым для пропуска):');
    
    let url = `${API_URL}/search?`;
    const params = [];
    
    if (species) params.push(`species=${encodeURIComponent(species)}`);
    if (age) params.push(`age=${age}`);
    
    if (params.length === 0) {
        url = API_URL;
    } else {
        url += params.join('&');
    }
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        logResponse('GET ' + url, data);
    } catch (error) {
        logResponse('GET ' + url, { error: error.message }, true);
    }
}

// Добавить животное
async function addAnimal() {
    const name = prompt('Введите имя животного:');
    const species = prompt('Введите вид животного:');
    const age = prompt('Введите возраст животного:');
    const habitat = prompt('Введите среду обитания (опционально):');
    const description = prompt('Введите описание (опционально):');
    
    if (!name || !species || !age) {
        alert('Имя, вид и возраст обязательны!');
        return;
    }
    
    const newAnimal = {
        name,
        species,
        age: parseInt(age),
        habitat: habitat || '',
        description: description || ''
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAnimal)
        });
        
        const data = await response.json();
        logResponse('POST /api/animals', data);
        
        if (data.success) {
            fetchAnimals(); // Обновить список
        }
    } catch (error) {
        logResponse('POST /api/animals', { error: error.message }, true);
    }
}

// Обновить животное
async function updateAnimal() {
    const id = prompt('Введите ID животного для обновления:');
    
    if (!id) return;
    
    // Сначала получим текущие данные
    try {
        const getResponse = await fetch(`${API_URL}/${id}`);
        const animalData = await getResponse.json();
        
        if (!animalData.success) {
            logResponse(`GET /api/animals/${id}`, animalData);
            return;
        }
        
        const animal = animalData.data;
        
        const name = prompt(`Имя (текущее: ${animal.name}):`, animal.name);
        const species = prompt(`Вид (текущий: ${animal.species}):`, animal.species);
        const age = prompt(`Возраст (текущий: ${animal.age}):`, animal.age);
        const habitat = prompt(`Среда обитания (текущая: ${animal.habitat}):`, animal.habitat);
        const description = prompt(`Описание (текущее: ${animal.description}):`, animal.description);
        
        const updatedAnimal = {
            name: name || animal.name,
            species: species || animal.species,
            age: age ? parseInt(age) : animal.age,
            habitat: habitat || animal.habitat,
            description: description || animal.description
        };
        
        const putResponse = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAnimal)
        });
        
        const data = await putResponse.json();
        logResponse(`PUT /api/animals/${id}`, data);
        
        if (data.success) {
            fetchAnimals(); // Обновить список
        }
    } catch (error) {
        logResponse(`PUT /api/animals/${id}`, { error: error.message }, true);
    }
}

// Удалить животное
async function deleteAnimal() {
    const id = prompt('Введите ID животного для удаления:');
    
    if (!id) return;
    
    if (!confirm(`Вы уверены, что хотите удалить животное с ID ${id}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        logResponse(`DELETE /api/animals/${id}`, data);
        
        if (data.success) {
            fetchAnimals(); // Обновить список
        }
    } catch (error) {
        logResponse(`DELETE /api/animals/${id}`, { error: error.message }, true);
    }
}

// Отображение животных
function displayAnimals(animals) {
    const container = document.getElementById('animals-container');
    
    if (!animals || animals.length === 0) {
        container.innerHTML = '<p>Нет данных о животных</p>';
        return;
    }
    
    container.innerHTML = animals.map(animal => `
        <div class="animal-card">
            <h3>${animal.name} (ID: ${animal.id})</h3>
            <span class="species">${animal.species}</span>
            <p><strong>Возраст:</strong> ${animal.age} лет</p>
            <p><strong>Среда обитания:</strong> ${animal.habitat}</p>
            <p><strong>Описание:</strong> ${animal.description}</p>
            <p><small>Создано: ${new Date(animal.createdAt).toLocaleString()}</small></p>
            ${animal.updatedAt ? 
                `<p><small>Обновлено: ${new Date(animal.updatedAt).toLocaleString()}</small></p>` : ''}
        </div>
    `).join('');
}

// Логирование ответов
function logResponse(endpoint, data, isError = false) {
    const consoleEl = document.getElementById('response-console');
    const timestamp = new Date().toLocaleTimeString();
    
    const logEntry = `
[${timestamp}] ${endpoint}
${JSON.stringify(data, null, 2)}
${'='.repeat(50)}
`;
    
    const currentContent = consoleEl.textContent;
    consoleEl.textContent = logEntry + currentContent;
    
    if (isError) {
        consoleEl.style.color = '#e74c3c';
    } else {
        consoleEl.style.color = '#2ecc71';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    checkServerStatus();
    fetchAnimals();
    
    // Автоматическое обновление каждые 30 секунд
    setInterval(fetchAnimals, 30000);
});