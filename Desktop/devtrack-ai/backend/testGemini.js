require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// List of models to try one by one
const modelsToTry = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-pro'
];

const testModel = async (modelName) => {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say hello.');
    const response = await result.response;
    console.log(`✅ ${modelName} WORKS:`, response.text().substring(0, 50));
    return true;
  } catch (error) {
    console.log(`❌ ${modelName} failed:`, error.message.substring(0, 80));
    return false;
  }
};

const findWorkingModel = async () => {
  console.log('Testing models...\n');
  for (const modelName of modelsToTry) {
    const works = await testModel(modelName);
    if (works) {
      console.log(`\n🎯 USE THIS MODEL: "${modelName}"`);
      break;
    }
  }
};

findWorkingModel();