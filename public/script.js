document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chat = document.getElementById('chat');

    number = 0;

    function sendMessage() {
        let in_message = messageInput.value.trim();        
        if (in_message === '') {
            in_message = ' ';
        }

        const messageElement = document.createElement('div');
        messageElement.textContent = in_message;
        chat.appendChild(messageElement);

        const message = number.toString() + in_message;
        number += 1;
        
        fetch('/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message})
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


