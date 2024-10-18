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

function sleepBlocking(ms) {
  const endTime = Date.now() + ms;
  while (Date.now() < endTime) {
  }
}

app.post('/message', (req, res) => {
    let in_message = req.body.message;
    let pre_message = in_message.substring(1);
    let sequence = in_message.charAt(0);

    let message = pre_message;

    if (sequence == "0") {
        message = "Please give a detailed overview in a conversational style for an expert scientist of the cancer IDH-wildtype glioblastoma";
    }

    if (sequence == "1") {
        sleepBlocking(1000);
        responseContent = "It looks like we already did a search in Pubmed Central previously.  We found 361 papers.  The next step will be to use AI to process all these papers and look for ones that show antigens that are overexpressed in that cancer.  Please press enter to continue";
        res.json({ success: true, response: responseContent });
        return;
    }

    if (sequence == "2") {
        sleepBlocking(1000);
        responseContent = "In our cached results we found a list of 581 possible antigens for this cancer using llama3.2, and have ranked them from most to least likely as an antigen suitable for BiTE.  The next step will be to develop a robotic laboratory procedure for Ginkgo Bioworks to run a phage display experiment that will generate antibodies to these antigens.  Please press enter to continue.";
        res.json({ success: true, response: responseContent });
        return;
    }

    if (sequence == "3") {
        message = "Please write a detailed pseudocode implementation for Ginkgo Bioworks to run a phage-display experiment to find an antibody for a specific antigen that we have the sequence for.  This is to be used in a BiTE cancer therapy similar to tebentafusp.  We have many thousands of these sequences.";
    }

    if (sequence == "4") {
        message = "Please write the draft of a patent for a new sequence for an engineered protein that is a BiTE cancer therapy drug.  Please put all XXX's in the sequence as a placeholder";
    }

    if (sequence == "5") {
        message = "Please write a business plan for a company that will use Ginkgo Bioworks and phage display along with artificial intelligence and molecular modelling to develop a BiTE cancer therapy for IDH-wildtype glioblastoma.";
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

            if (sequence == "3") {
                responseContent += "<br><br>" + "The next step will be to generate patents for these sequences.  Please press enter if that's OK";
            }

            if (sequence == "4") {
                responseContent += "<br><br>" + "The next step will be to generate a business plan for a company to commercialize this technology.  Please press enter if that's OK";
            }

            if (sequence == "5") {
                responseContent += "<br><br>" + "This concludes our session, please let me know if you have any questions at all.";
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
