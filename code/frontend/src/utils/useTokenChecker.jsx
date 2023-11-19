import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useTokenChecker = () => {
    const [loginStatus, setLoginStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    const checkToken = async () => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const response = await fetch('/api/tokenTest', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setLoginStatus(true);
                } else {
                    Cookies.remove('token');
                    setLoginStatus(false);
                }
            } catch (error) {
                console.error('Error during token validation: ', error);
                Cookies.remove('token');
                setLoginStatus(false);
            }
        } else {
            setLoginStatus(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        checkToken().finally(() => setIsLoading(false));
    }, []);

    return { loginStatus, isLoading };
};

export default useTokenChecker;