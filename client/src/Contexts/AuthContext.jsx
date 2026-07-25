import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth(){
        try {
            const res = await fetch('http://localhost:5000/check-auth', {
                credentials: 'include'
            });
            const data = await res.json();

            if (data.isAuthenticated) {
                setCurrentUser(data.user);
            } else {
                setCurrentUser(null);
            }
        } catch (err) {
            console.log(err);
            setCurrentUser(null);
        } finally {
            setAuthLoading(false);
        }
    }

    async function logout(){
        try {
            await fetch('http://localhost:5000/logout', {
                method: 'POST',
                credentials: 'include'
            });
            setCurrentUser(null);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, authLoading, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}