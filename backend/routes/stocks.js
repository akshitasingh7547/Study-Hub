import express from 'express'
import * as stockController from '../controllers/stockController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/portfolio', authenticateToken, stockController.getPortfolio)
router.post('/buy', authenticateToken, stockController.buyStock)
router.get('/performance', authenticateToken, stockController.getPerformance)

export default router
