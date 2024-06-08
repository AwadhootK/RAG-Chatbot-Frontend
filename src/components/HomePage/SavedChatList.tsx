import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { getData, postData } from "../../Utils";
import Chatbot, { Message } from '../Chatbot/Chatbot';

interface ChatMessage {
    messageID: number;
    message: string;
    chatRole: 'USER' | 'AI';
    savedChat: number;
}

interface Chat {
    chatID: number;
    userID: string;
    chatName: string;
    chats: ChatMessage[];
}

function SavedChatList() {
    const [savedChatList, setSavedChatList] = useState<String[]>([]);
    const [selectedMessages, setSelectedMessages] = useState<Message[] | null>(null);

    useEffect(() => {
        // Function to fetch data from API
        const fetchData = async () => {
            try {
                const token = Cookies.get('token');
                const response = await getData<String[]>(
                    "http://localhost:8080/api/v1/chatbot/getAllSavedChatNames",
                    {
                        "Authorization": `Bearer ${token}`
                    }
                );

                if (response != null) {
                    setSavedChatList(response);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSavedChatClick = async (chatName: String) => {
        const token = Cookies.get('token');
        const response = await postData<Chat[]>(
            "http://localhost:8080/api/v1/chatbot/getSaveChats",
            {
                'Authorization': `Bearer ${token}`
            },
            {
                "chatName": chatName
            }
        );

        if (response !== null && response.length > 0) {
            const savedMessageList: Message[] = response[0].chats.map(c => ({
                id: c.messageID,
                text: c.message,
                sender: c.chatRole === "USER" ? "user" : "bot",
            }));
            setSelectedMessages(savedMessageList);
        } else {
            alert(`Some error occurred while loading saved chat: ${chatName}`);
        }
    }

    return (
        <>
            {selectedMessages === null ? (
                <div>
                    <ul className='list-group'>
                        {savedChatList && savedChatList.map((savedChat, index) => (
                            <li onClick={() => handleSavedChatClick(savedChat)} className='list-group-item' key={index}>
                                {savedChat}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <Chatbot chats={selectedMessages || []} />
            )}
        </>
    );
}

export default SavedChatList;
