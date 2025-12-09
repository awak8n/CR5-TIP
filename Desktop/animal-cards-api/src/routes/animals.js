cat > src/routes/animals.js << 'EOF'
const express = require('express');
const router = express.Router();
const animalsController = require('../controllers/animals');

// Все маршруты для CRUD операций
router.get('/', animalsController.getAllAnimals);
router.get('/search', animalsController.searchAnimals);
router.get('/:id', animalsController.getAnimalById);
router.post('/', animalsController.createAnimal);
router.put('/:id', animalsController.updateAnimal);
router.delete('/:id', animalsController.deleteAnimal);

module.exports = router;
EOF