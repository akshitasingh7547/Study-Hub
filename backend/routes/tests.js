import express from 'express'
import * as testController from '../controllers/testController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authenticateToken, testController.addTest)
router.get('/', authenticateToken, testController.getTests)
router.get('/analytics', authenticateToken, testController.getAnalytics)

export default router
