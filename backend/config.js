require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/textdb',
  nodeEnv: process.env.NODE_ENV || 'development',
}; 