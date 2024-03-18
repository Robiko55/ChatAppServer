
const { config }= require('dotenv');
config()
const {OpenAI}= require('openai');
const openai = new OpenAI( { apiKey: process.env.API_KEY } );
userInterface.prompt()

async function getGPTResponse(input) {
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: input }
      ]
    });
  
    return res.choices.map(out => out.message.content).join('\n');
  }

module.exports = {getGPTResponse};


