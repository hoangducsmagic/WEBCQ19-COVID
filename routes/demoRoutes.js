const express = require('express');
const demoController = require('../controllers/demoController');

const router = express.Router();

router.get('/', demoController.showDemo);

module.exports = router;