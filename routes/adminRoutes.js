const express = require('express');
const productPackageController = require('../controllers/admin');

const router  =  express.Router();

router.get('/lockUser', admin.lockUser); 
module.exports = router;