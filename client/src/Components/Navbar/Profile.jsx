import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../Contexts/AuthContext';
import "../../Style/navbarcss/profile.css"

export default function Profile(){
    const {currentUser, logout} = useAuth();
    return<>
    <div className='profile-box'>
        <div className="icon">
            <AccountCircleIcon/>
        </div>
        <div className='profile-name'>
            <span>{currentUser.username}</span>
        </div>
        <div className='btn-logout'>
            <button onClick={logout}>Logout</button>
        </div>
    </div>
    </>
}