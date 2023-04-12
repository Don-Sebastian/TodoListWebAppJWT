const express = require('express');
const authControllers = require('../Controllers/authControllers');
const { guestMiddleware } = require('../Middleware/authMiddleware');

const router = express.Router();

router.get('/register',guestMiddleware, authControllers.getAuthRegister)
router.post("/api/v1/auth/register",guestMiddleware, authControllers.postAuthRegister);

router.get("/login", guestMiddleware, authControllers.getAuthLogin);
router.post("/api/v1/auth/login",guestMiddleware, authControllers.postAuthLogin);

router.get("/logout", authControllers.getAuthLogout);



module.exports = router;