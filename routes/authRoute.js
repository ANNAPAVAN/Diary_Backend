const express = require('express');
const router = express.Router();  

const {signUp,signIn, verifyToken} = require("../controllers/authControllers.js");
const {addDiary,selectDiary} = require("../controllers/diaryControllers.js")

// console.log("three")
router.post("/register",signUp);
router.post("/login",signIn);
router.post("/adddiary",addDiary);
router.get("/getdiary/:id",selectDiary);
router.get("/gettokeninfo/:id",verifyToken);


module.exports = router;
