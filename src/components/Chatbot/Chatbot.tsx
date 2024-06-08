import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { postData } from '../../Utils';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot' | 'loading';
}

interface PostQuery {
    query: string,
    answer: string
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');

    const handleSendMessage = async () => {
        if (inputText.trim() !== '') {
            const newMessage: Message = {
                id: messages.length,
                text: inputText,
                sender: 'user',
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInputText('');

            const loader: Message = {
                id: messages.length,
                text: "Loading...",
                sender: 'loading',
            };
            setMessages(prevMessages => [...prevMessages, loader]);

            const token = Cookies.get('token');
            const response = await postData<PostQuery>(
                "http://localhost:8080/api/v1/chatbot/ask",
                {
                    "Authorization": `Bearer ${token}`
                },
                {
                    "query": inputText
                }
            );

            setMessages(prevMessages => prevMessages.filter(message => message.sender !== 'loading'));

            if (response != null) {
                const botResponse: Message = {
                    id: messages.length + 1,
                    text: response.answer,
                    sender: 'bot',
                };
                setMessages(prevMessages => [...prevMessages, botResponse]);
            }
        }
    };


    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '80%', maxWidth: '500px', border: '1px solid #ccc', borderRadius: '5px', padding: '20px' }}>
                <h2>Chatbot</h2>
                <div style={{ height: '300px', overflowY: 'scroll' }}>
                    {messages.map((message) => (
                        <div key={message.id} style={{ marginBottom: '10px' }}>
                            {message.sender === 'user' ? (
                                <div style={{ textAlign: 'right', color: 'blue' }}>
                                    <strong>You:</strong> {message.text}
                                </div>
                            ) : (
                                <div style={{ color: 'green' }}>
                                    <strong>Bot:</strong> {message.text}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={{ width: '100%', marginTop: '10px', padding: '5px' }}
                />
                <button onClick={handleSendMessage} style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;
