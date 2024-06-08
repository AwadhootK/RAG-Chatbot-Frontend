import { useNavigate } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";
import SavedChatList from "./SavedChatList";
function Homepage() {
    const navigate = useNavigate();
    return (
        <>
            <SavedChatList />
            < LogoutBtn />
            <div>Homepage</div>
            <div>
                <button onClick={() => {
                    navigate('/chat')
                }}>
                    Click to start a new chat!
                </button>
            </div>
        </>
    )
}

export default Homepage