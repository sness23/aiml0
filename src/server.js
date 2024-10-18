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

function doCompletion(message, callback) {
    api.chat.completions.create({
        model: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
        messages: [
            {
                role: 'user',
                content: message,
            },
        ],
        temperature: 0.7,
        max_tokens: 10000
    }).then(completion => {
        console.log(completion);
        const in_responseContent = completion.choices[0].message.content;
        console.log("in_responseContent=", in_responseContent);
        callback(null, in_responseContent);
    }).catch(error => {
        callback(error);
    });
}

app.post('/message', (req, res) => {
    let in_message = req.body.message;
    let pre_message = in_message.substring(1);
    let sequence = in_message.charAt(0);

    let message = pre_message;

    if (sequence == "0") {
        message = "Please give a detailed overview in a conversational style for an expert scientist of the cancer IDH-wildtype glioblastoma";
    }

    if (message) {
        doCompletion(message, (error, in_responseContent) => {
            if (error) {
                console.error('Error during chat request:', error);
                return res.status(500).json({ success: false, error: 'Internal server error' });
            }

            let responseContent = in_responseContent;
            
            if (sequence == "0") {
                responseContent += "<br><br>" + "The next step will be to do a literature search for this cancer.  I will use Pubmed Central for this step.  Please press enter if that's OK";
            }

            res.json({ success: true, response: responseContent });
        });
    } else {
        res.status(400).json({ success: false, error: 'No message provided' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
