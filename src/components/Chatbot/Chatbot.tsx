import axios, { AxiosError, AxiosProgressEvent } from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, postData } from '../../Utils';
import LogoutBtn from '../HomePage/LogoutBtn';

export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot' | 'loading';
}

interface PostQuery {
    query: string,
    answer: string
}

interface SavedChatProps {
    chats?: Message[]
    savedChatName?: string | null
}

const Chatbot: React.FC = ({ chats = [], savedChatName = null }: SavedChatProps) => {

    const [messages, setMessages] = useState<Message[]>([...chats]);
    const [inputText, setInputText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

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
                id: messages.length + 1,
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            console.error('No file selected.');
            return;
        }
        const username = localStorage.getItem('username');
        if (username === null) {
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('index', 'true');
        formData.append('save', 'true');
        formData.append('username', username);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent.lengthComputable) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total === undefined ? 1 : progressEvent.total));
                    setUploadProgress(percentCompleted);
                }
            },
        };

        try {
            await axios.post('http://localhost:8000/upload', formData, config);
            console.log('File uploaded successfully.');
            setFile(null);
            setUploadProgress(0);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.error('Error uploading file:', axiosError.message);
            } else {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleSaveChat = async () => {
        const token = Cookies.get('token');
        var savedName: string | null = '';
        if (savedChatName !== null) {
            savedName = savedChatName;
        } else {
            savedName = prompt('Enter name of chat to save');
            if (savedName === null || savedName.trim() === '') {
                alert('Please provide a chat name to save');
                return;
            }
        }

        const response = await postData<string>(
            "http://localhost:8080/api/v1/chatbot/saveChats",
            {
                'Authorization': `Bearer ${token}`
            },
            {
                "chatName": savedName 
            }
        );

        if (response !== null) {
            alert(`Chat saved as ${savedName}!`);
        } else {
            alert('Chat could not be saved! Please try again.');
        }
    };

    const username = localStorage.getItem('username') === null
        ? 'You'
        : localStorage.getItem('username');

    const navigate = useNavigate();

    return (
        <>
            <button onClick={() => navigate('/home')}>Home</button>
            <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                < LogoutBtn />
                <div style={{ width: '100%', maxWidth: '1000px', border: '1px solid #ccc', borderRadius: '5px', padding: '20px' }}>
                    <h2>Chatbot</h2>
                    <center>
                        <div style={{ backgroundColor: 'grey', cursor: 'pointer' }} onClick={() => document.getElementById('fileInput')?.click()}>
                            <h1>+</h1>
                        </div>
                    </center>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <div style={{ height: '300px', overflowY: 'scroll' }}>
                        {messages.map((message) => (
                            <div key={message.id} style={{ marginBottom: '10px' }}>
                                {message.sender === 'user' ? (
                                    <div style={{ textAlign: 'right', color: 'blue' }}>
                                        <strong>{username}: </strong> {message.text}
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
                    <button onClick={handleSendMessage} className='btn btn-primary'>Send</button>
                    <button onClick={handleUpload} className='btn btn-success'>Upload</button>
                    <button onClick={handleSaveChat} className='btn btn-danger' >Save Chat</button>
                    <button className='btn btn-warning' onClick={async () => {
                        const token = Cookies.get('token')
                        const response = await getData<string>("http://localhost:8080/api/v1/chatbot/emptyContext",
                            {
                                'Authorization': `Bearer ${token}`
                            });
                        if (response != null) {
                            alert('Context cleared!');
                        } else {
                            alert('Some error occurred in clearing context');
                        }
                    }}>Clear</button>
                    {uploadProgress > 0 && (
                        <p>Upload progress: {uploadProgress}%</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chatbot;
