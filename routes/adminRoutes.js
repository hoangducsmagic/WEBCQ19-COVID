const express = require('express');
const productPackageController = require('../controllers/admin');
const admin=require('../controllers/admin')

const router  =  express.Router();

router.get('/lockUser', admin.lockUser); 
router.get('/dashboard', admin.showDashboard); 

router.get('/', admin.showDashboard); 


module.exports = router;