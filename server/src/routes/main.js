const express = require("express");
const {Create_User,Notify_User_Prod} = require('../controller/controller'); 
const router = express.Router();

router.post("/create_user", Create_User);
router.post('/notify',Notify_User_Prod);
module.exports = router;

