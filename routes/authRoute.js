const express = require('express');
const router = express.Router();  

// For MYSQL

/*
const {signUp,signIn, verifyToken} = require("../controllers/authControllers.js");
const {addDiary,selectDiary} = require("../controllers/diaryControllers.js")

router.post("/register",signUp);
router.post("/login",signIn);
router.post("/adddiary",addDiary);
router.get("/getdiary/:id",selectDiary);
router.get("/gettokeninfo/:id",verifyToken); 
*/

// ----------------------------------------------------------------------------------------------------------------------------


// For MONGODB 

const {mongoSignUp , mongoLogin ,mongoVerifyToken} = require("../mongoDBcontrollers/authControllers.js");
const {mongoAddDiary,mongoSelectDiary} = require("../mongoDBcontrollers/diaryControllers.js")

router.post("/register",mongoSignUp);
router.post("/login",mongoLogin);
router.post("/adddiary",mongoAddDiary);
router.get("/getdiary/:id",mongoSelectDiary);
router.get("/gettokeninfo/:id",mongoVerifyToken);

module.exports = router;
