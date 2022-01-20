const express = require('express');
const productPackageController = require('../controllers/admin');
const admin=require('../controllers/admin');
const mdwAdmin = require('../middleware/init/admin');
const mdwAccount = require('../middleware/init/account')

const router  =  express.Router();

router.get('/lockUser', mdwAdmin.checkAdmin, mdwAccount.checkLogin, admin.lockUser); 
router.get('/unlockUser', mdwAdmin.checkAdmin, mdwAccount.checkLogin, admin.unlockUser); 
router.get('/dashboard', mdwAdmin.checkAdmin, mdwAccount.checkLogin, admin.showDashboard); 

router.get('/', mdwAdmin.checkAdmin, mdwAccount.checkLogin, admin.showDashboard); 
router.get('/create', mdwAdmin.checkNotAdmin, admin.create); 
router.post('/create', mdwAdmin.checkNotAdmin, admin.postCreate); 


module.exports = router;