document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chat = document.getElementById('chat');

    number = 0;

    function sendMessage() {
        const message = messageInput.value.trim();        
        if (message === '') {
            alert('Please enter a message.');
            return;
        }

        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chat.appendChild(messageElement);

        const out = number.toString() + message;

        console.log("out=",out);

        fetch('/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Message sent successfully.');
                console.log(data);
                messageInput.value = '';
                const messageElement = document.createElement('div');
                messageElement.textContent = data.response;
                chat.appendChild(messageElement);
            } else {
                alert('Error sending message: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending the message.');
        });
    }

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            messageInput.focus();
        }
    });
});


