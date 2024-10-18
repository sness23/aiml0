const express = require('express');
const { OpenAI } = require('openai');
const { config } = require('dotenv');

config({ path: '.env.local' });

if (!process.env.AIML_API_KEY) {
    throw new Error('AIML_API_KEY is not defined in the .env.local file');
}

const api = new OpenAI({
    apiKey: process.env.AIML_API_KEY,
    baseURL: 'https://api.aimlapi.com/v1',
});

const app = express();
const PORT = 4000;

app.use(express.json());

app.use(express.static('public'));

app.post('/message', async (req, res) => {
    let in_message = req.body.message;

    console.log("in_message=",in_message);

    let message = in_message.substring(1);

    console.log("message",message);

    if (message) {
        try {
            const completion = await api.chat.completions.create({
                model: "mistralai/Mistral-7B-Instruct-v0.2",
                messages: [
                    {
                        role: 'user',
                        content: message,
                    },
                ],
                temperature: 0.7,
                max_tokens: 256,
            });

            console.log("completion", completion);
            const responseContent = completion.choices[0].message.content;

            res.json({ success: true, response: responseContent });
        } catch (error) {
            console.error('Error during chat request:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    } else {
        res.status(400).json({ success: false, error: 'No message provided' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
