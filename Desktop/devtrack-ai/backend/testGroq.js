require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const test = async () => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
      model: 'llama-3.3-70b-versatile'
    });
    console.log('✅ Groq works:', completion.choices[0].message.content);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

test();