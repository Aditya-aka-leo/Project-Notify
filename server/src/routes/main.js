const express = require("express");
const {create_user,notify_user} = require('../controller/controller'); 
const router = express.Router();

router.post("/create_user", create_user);
router.post('/notify',notify_user);
module.exports = router;

