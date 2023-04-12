const express = require('express');
const todoController = require('./../Controllers/todoControllers');
const { authMiddleware } = require('../Middleware/authMiddleware');

const router = express.Router();

router.get('/', todoController.getTodoHome);
router.post('/api/v1/add-token', todoController.postAddToken)
router.put("/api/v1/update-status/:taskId", todoController.putUpdateStatus);

router.get('/report', todoController.getReportData)
router.get('/tasks', todoController.getAllTasks);

module.exports = router;