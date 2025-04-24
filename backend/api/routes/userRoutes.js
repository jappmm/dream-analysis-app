const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Rutas públicas de autenticación
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.post('/forgotpassword', userController.forgotPassword);
router.put('/resetpassword/:resettoken', userController.resetPassword);
router.get('/confirmemail/:confirmtoken', userController.confirmEmail);

// Rutas protegidas (requieren autenticación)
router.get('/me', protect, userController.getMe);
router.put('/updatedetails', protect, userController.updateDetails);
router.put('/updatepassword', protect, userController.updatePassword);
router.delete('/deleteaccount', protect, userController.deleteAccount);

module.exports = router;