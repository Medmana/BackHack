const express = require('express');
const router = express.Router();
const antecedentController = require('../controllers/antecedentController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Middlewares globaux
router.use(auth);
router.use(role(['doctor', 'admin']));

// Routes CRUD standard
router.post('/patients/:patientId/antecedents',  
  antecedentController.create
);

router.get('/patients/:patientId/antecedents', 
  antecedentController.list
);

router.put('/:antecedentId', 
  antecedentController.update
);

router.delete('/:antecedentId', 
  antecedentController.delete
);

// Route spéciale
router.post('/patients/:patientId/antecedents/bulk', 
  antecedentController.bulkCreate
);

module.exports = router;