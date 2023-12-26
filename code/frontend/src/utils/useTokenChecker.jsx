import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';


const useTokenChecker = () => {
    const [username, setUsername] = useState('');
    const [loginStatus, setLoginStatus] = useState(false);
    const [isTokenLoading, setIsTokenLoading] = useState(true); // Loading state

    const checkToken = () => {
        return new Promise((resolve, reject) => {
            const token = Cookies.get('token');
            if (token) {
                fetch('/api/tokenTest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                })
                    .then(res => res.json())
                    .then((res) => {
                        if (res.success === true) {
                            setLoginStatus(true);
                            setUsername(res.username);
                            resolve();
                        } else {
                            Cookies.remove('token');
                            setLoginStatus(false);
                            reject(new Error('Token validation failed'));
                        }
                    })
                    .catch((err) => {
                        console.error('Error during token validation: ', err);
                        Cookies.remove('token');
                        setLoginStatus(false);
                        reject(new Error('Token validation failed'));
                    });
            } else {
                setLoginStatus(false);
                reject(new Error('Token validation failed'));
            }
        });
    };

    useEffect(() => {
        setIsTokenLoading(true);
        checkToken().then(() => setIsTokenLoading(false), () => setIsTokenLoading(false));
    }, []);

    return { loginStatus, isTokenLoading, username };
};

export default useTokenChecker;