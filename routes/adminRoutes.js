const express = require('express');
const productPackageController = require('../controllers/admin');
const admin=require('../controllers/admin');
const mdwAdmin = require('../middleware/init/admin')

const router  =  express.Router();

router.get('/lockUser', mdwAdmin.checkAdmin, admin.lockUser); 
router.get('/dashboard', mdwAdmin.checkAdmin, admin.showDashboard); 

router.get('/', mdwAdmin.checkAdmin, admin.showDashboard); 

router.get('/create', mdwAdmin.checkNotAdmin, admin.create); 
router.post('/create', mdwAdmin.checkNotAdmin, admin.postCreate); 


module.exports = router;