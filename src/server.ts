import express, { Request, Response } from 'express';
import { OpenAI } from "openai";
import { config } from 'dotenv';

config({ path: '.env.local' });

if (!process.env.AIML_API_KEY) {
  throw new Error('AIML_API_KEY is not defined in the .env.local file');
}

const api = new OpenAI({
  apiKey: process.env.AIML_API_KEY as string,
  baseURL: 'https://api.aimlapi.com/v1',
});

const app = express();
const PORT = 4000;

app.use(express.json());

app.use(express.static('public'));

interface MessageRequestBody {
  message?: string;
}

app.post('/message', async (req: Request<{}, {}, MessageRequestBody>, res: Response) => {
  const { message } = req.body;

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

        console.log("completion",completion);
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
