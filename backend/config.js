import dotenv from 'dotenv'
dotenv.config()

const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/study-hub-2',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
}

export default config
