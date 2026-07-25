import AssessmentIcon from '@mui/icons-material/Assessment';
import "../../Style/navbarcss/logo.css"
 
export default function Logo(){
    return (
        <div className="logo-box">
            <div className="logo-icon">
                <AssessmentIcon/>
            </div>
            <div className="logo-name">
                <p>Market Insights</p>
            </div>
        </div>
    )
}
 