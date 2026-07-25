import { Link } from "react-router-dom"
import Logo from "./Logo"
import Profile from "./Profile"
import { useAuth } from "../../Contexts/AuthContext"
import '../../Style/navbarcss/navbar.css'

export default function Navbar(){
    const {currentUser, authLoading} = useAuth();

    if(authLoading){
        return null
    };

    return (
        <div className="navbar">
            <div className="navbar-logo">
                <Logo/>
            </div>

            {currentUser ? (
                <div className="navbar-profile">
                    <Profile/>
                </div>
            ) : (
                <div className="navbar-auth-buttons">
                    <Link to="/login">
                        <button className="navbar-btn navbar-login-btn">Login</button>
                    </Link>
                    <Link to="/signup">
                        <button className="navbar-btn navbar-signup-btn">Signup</button>
                    </Link>
                </div>
            )}
        </div>
    )
}