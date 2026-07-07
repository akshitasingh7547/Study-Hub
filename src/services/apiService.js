import api from './api'

// Auth services
export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () =>
    api.get('/auth/profile'),
  updateProfile: (name) =>
    api.put('/auth/profile', { name }),
}

// Test services
export const testService = {
  addTest: (testData) =>
    api.post('/tests', testData),
  getTests: () =>
    api.get('/tests'),
  getTestsBySubject: (subject) =>
    api.get(`/tests/subject/${subject}`),
  deleteTest: (id) =>
    api.delete(`/tests/${id}`),
  getAnalytics: () =>
    api.get('/tests/analytics'),
}

// AI services
export const aiService = {
  askQuestion: (question, subject, context) =>
    api.post('/ai/ask', { question, subject, context }),
  generateFlashcards: (topic, subject, count) =>
    api.post('/ai/flashcards', { topic, subject, count }),
  generateQuiz: (chapter, subject, difficulty) =>
    api.post('/ai/quiz', { chapter, subject, difficulty }),
}

// Stock services
export const stockService = {
  getPortfolio: () =>
    api.get('/stocks/portfolio'),
  buyStock: (symbol, quantity, price) =>
    api.post('/stocks/buy', { symbol, quantity, price }),
  sellStock: (symbol, quantity, price) =>
    api.post('/stocks/sell', { symbol, quantity, price }),
  getStockPrice: (symbol) =>
    api.get(`/stocks/price/${symbol}`),
  getPerformance: () =>
    api.get('/stocks/performance'),
}

// Achievement services
export const achievementService = {
  getAllAchievements: () =>
    api.get('/achievements'),
}
