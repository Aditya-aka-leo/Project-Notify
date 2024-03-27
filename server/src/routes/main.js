const express = require("express");
const {create_user} = require('../controller/controller'); 
const router = express.Router();

router.post("/create_user", create_user);
module.exports = router;
