const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

app.use(express.static('public'));

app.post('/message', (req, res) => {
    const { message } = req.body;
    if (message) {
        console.log(`Received message: ${message}`);
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, error: 'No message provided' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
