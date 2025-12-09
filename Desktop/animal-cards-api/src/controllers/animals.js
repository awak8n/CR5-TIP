cat > src/controllers/animals.js << 'EOF'
const animalsData = require('../data/animals');

let animals = [...animalsData];

exports.getAllAnimals = (req, res) => {
  res.json({
    success: true,
    count: animals.length,
    data: animals
  });
};

exports.getAnimalById = (req, res) => {
  const id = parseInt(req.params.id);
  const animal = animals.find(a => a.id === id);
  
  if (!animal) {
    return res.status(404).json({
      success: false,
      error: `Животное с ID ${id} не найдено`
    });
  }
  
  res.json({
    success: true,
    data: animal
  });
};

exports.searchAnimals = (req, res) => {
  const { species, age, habitat } = req.query;
  let results = [...animals];
  
  if (species) {
    results = results.filter(a => 
      a.species.toLowerCase().includes(species.toLowerCase())
    );
  }
  
  if (age) {
    results = results.filter(a => a.age === parseInt(age));
  }
  
  if (habitat) {
    results = results.filter(a => 
      a.habitat.toLowerCase().includes(habitat.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    count: results.length,
    data: results
  });
};

exports.createAnimal = (req, res) => {
  const { name, species, age, habitat, description } = req.body;
  
  if (!name || !species || !age) {
    return res.status(400).json({
      success: false,
      error: 'Пожалуйста, укажите имя, вид и возраст животного'
    });
  }
  
  const newAnimal = {
    id: animals.length > 0 ? Math.max(...animals.map(a => a.id)) + 1 : 1,
    name,
    species,
    age: parseInt(age),
    habitat: habitat || 'Не указана',
    description: description || '',
    createdAt: new Date().toISOString()
  };
  
  animals.push(newAnimal);
  
  res.status(201).json({
    success: true,
    message: 'Животное успешно добавлено',
    data: newAnimal
  });
};

exports.updateAnimal = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, species, age, habitat, description } = req.body;
  
  const animalIndex = animals.findIndex(a => a.id === id);
  
  if (animalIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Животное с ID ${id} не найдено`
    });
  }
  
  animals[animalIndex] = {
    ...animals[animalIndex],
    name: name || animals[animalIndex].name,
    species: species || animals[animalIndex].species,
    age: age ? parseInt(age) : animals[animalIndex].age,
    habitat: habitat || animals[animalIndex].habitat,
    description: description || animals[animalIndex].description,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Данные животного обновлены',
    data: animals[animalIndex]
  });
};

exports.deleteAnimal = (req, res) => {
  const id = parseInt(req.params.id);
  const animalIndex = animals.findIndex(a => a.id === id);
  
  if (animalIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Животное с ID ${id} не найдено`
    });
  }
  
  const deletedAnimal = animals.splice(animalIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Животное удалено',
    data: deletedAnimal
  });
};
EOF