const express = require("express");
const {Create_User,Notify_User_Prod,Delete_User} = require('../controller/controller'); 
const router = express.Router();

router.post("/create_user", Create_User);
router.post('/notify',Notify_User_Prod);
router.post('/delete_user',Delete_User);
module.exports = router;

