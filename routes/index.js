const { Router } = require('express');

const authRoutes = require("./authRoute.js")

const router = Router();

router.use("/auth", authRoutes);


module.exports = router;