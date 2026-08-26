import AddIcon from '@mui/icons-material/Add';
import "../../Style/sidebarcss/newchat.css";
import { useChat } from "../../Contexts/ChatContext";
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from "react-router-dom"

export default function NewChat(){

    const { startNewChat } = useChat();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    function handleclick(){
        if(!currentUser){
            navigate("/login");
            return;
        }
        startNewChat();
    }

    return<>
    <button className='newchat-box' onClick={handleclick}>
        <div className="icon">
            <AddIcon/>
        </div>
        <div className="profile-name">
            <p>New Search</p>
        </div>
    </button>
    </>
}