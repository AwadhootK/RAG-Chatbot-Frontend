import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { getData } from "../../Utils";


function Homepage() {
    const [savedChatList, setSavedChatList] = useState<String[]>([]);
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
        return () => { };
    }, []);

    return <>
        <div>
            <ul>
                {savedChatList && savedChatList.map((savedChat, index) => <li key={index}>{savedChat}</li>)}
            </ul >
        </div>
    </>
}

export default Homepage