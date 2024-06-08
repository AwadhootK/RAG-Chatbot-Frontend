import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../Utils';

interface LoginSignupPostResponse {
    token: string;
}

// interface Chat {
//     messageID: number;
//     message: string;
//     chatRole: "USER" | "AI";
//     savedChat: number;
// }

// interface ChatGroup {
//     chatID: number;
//     userID: string;
//     chatName: string;
//     chats: Chat[];
// }

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [register, setRegister] = useState<boolean | null>(null);
    const [match, setMatch] = useState<boolean>(true);
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Handle login request

        const response = await postData<LoginSignupPostResponse>(
            "http://localhost:8080/api/v1/auth/authenticate",
            {},
            { "email": username, "password": password }
        );

        if (response == null) {
            // error
            alert('Error in Login...')
        }
        else {
            Cookies.set("token", response.token, { expires: 60 * 60 * 24 })
            navigate('/chat')
        }

    };

    const handleRegister = async () => {
        // Handle register request

        const response = await postData<LoginSignupPostResponse>(
            "http://localhost:8080/api/v1/auth/register",
            {},
            { "email": username, "password": password }
        );

        if (response == null) {
            // error
            alert('Error in Registering...')
        }
        else {
            Cookies.set("token", response.token, { expires: 60 * 60 * 24 })
            navigate('/chat')
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Username:', username);
        console.log('Password:', password);

        if (register && password !== confirmPassword) {
            setMatch(false);
            return;
        }

        if (register) {
            handleRegister();
        } else {
            handleLogin();
        }
    };

    return (
        <center>
            <div>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <br />
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <br />
                    {register && (
                        <>
                            <div>
                                <label htmlFor="confirm-password">Confirm Password:</label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setMatch(e.target.value === password);
                                    }}
                                    required
                                />
                            </div>
                            {!match && (
                                <div style={{ color: 'red' }}>
                                    The passwords do not match!
                                </div>
                            )}
                        </>
                    )}
                    {!register ? (
                        <button type="submit">Login</button>
                    ) : (
                        <button type="button" onClick={handleRegister}>Register</button>
                    )}
                    <button type="button" onClick={() => setRegister(prev => !prev)}>
                        {register ? 'Back to Login' : 'Register'}
                    </button>
                </form>
                <br />
            </div>
        </center>
    );
};

export default LoginForm;
