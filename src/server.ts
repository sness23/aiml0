import express, { Request, Response } from 'express';
import { CohereClient } from "cohere-ai";
import { config } from 'dotenv';

config({ path: '.env.local' });

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY as string,
});

if (!process.env.COHERE_API_KEY) {
    throw new Error('COHERE_API_KEY is not defined in the .env.local file');
}

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
        // console.log(`Received message: ${message}`);
        try {
            const chat = await cohere.chat({
                model: "command",
                message, // Use the updated message received in the body
            });
            // console.log(chat);
            res.json({ success: true, response: chat });
        } catch (error) {
            console.error('Error during chat request:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    } else {
        res.status(400).json({ success: false, error: 'No message provided' });
    }
})

// app.post('/message', (req: Request<{}, {}, MessageRequestBody>, res: Response) => {
//     const { message } = req.body;

//     if (message) {
//         console.log(`Received message: ${message}`);
//         res.json({ success: true });
//     } else {
//         res.status(400).json({ success: false, error: 'No message provided' });
//     }
// });

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});



