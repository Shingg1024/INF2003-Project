const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define a route for /user and specify the controller function
router.get('/user/alluser', userController.getAllUsers);
router.post('/login', userController.loginUser);
router.post('/register', userController.regUser);
router.post('/edit', userController.editUser);

router.get('/user/sortData', userController.sortData);
router.delete('/user/delete/:id', userController.delete);
router.get('/user/rankcountFirstName',userController.rankcountFirstName)
router.get('/user/denseRankcountFirstName',userController.denseRankcountFirstName)

router.get('/user/rankcountReview',userController.rankcountReview)
router.get('/user/denseRankcountReview',userController.denseRankcountReview)

module.exports = router;
