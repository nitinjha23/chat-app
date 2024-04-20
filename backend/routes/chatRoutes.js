const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controlers/chatControllers');

const router = express.Router();

router.route('/').post(protect,accessChat); //if the user is not logged in then he would not be able to access this route.
router.route('/').get(protect,fetchChats); 
router.route('/group').post(protect,createGroupChat); 
router.route('/rename').put(protect,renameGroup); 
router.route('/groupadd').put(protect,addToGroup); 
router.route('/groupremove').put(protect,removeFromGroup); 

module.exports = router