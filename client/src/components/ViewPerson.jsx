import {ethers} from "ethers"
import { useNavigate } from "react-router-dom";


const ViewPerson=({state})=>{
    if(state != null && state.account != null && state.currentUser.isOnboarded)
    {
        const addressKey = state.account[0];
        const personDetails = state.currentUser;
        const navigate = useNavigate()
        
        /*
        Name: {personDetails.name}
        Is Onboarded to Platform: {personDetails.isOnboarded}*/
        return ( <div >
                <h2>Welcome {personDetails.name} </h2>
                
        </div>)
    }
    else
    {
    return ( <div class="errorMessage">
                <h3 >You are not onboarded to Rent Karma. Please Signup</h3>
                
        
        </div>)
    }

}
export default ViewPerson;