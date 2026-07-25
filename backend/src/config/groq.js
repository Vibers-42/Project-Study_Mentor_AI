const Groq = require('groq-sdk');

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is required');
}

module.exports = new Groq({ apiKey: process.env.GROQ_API_KEY });
