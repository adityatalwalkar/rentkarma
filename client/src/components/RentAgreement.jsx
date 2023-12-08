import {ethers} from "ethers"
import { useNavigate } from "react-router-dom";
import ViewPerson from "./ViewPerson"
import Banner from "./Banner"

const RentAgreement=({state})=>{
    const navigate = useNavigate()
    const addressKey = state.account[0];
    const addRentAgreement = async(event) =>{
        event.preventDefault();

        const {contract} = state;
        
        const name = document.querySelector("#name").value;
        const tenantId = document.querySelector("#tenantId").value;
        //"0xD6d03326Dfe5A9217B7C62Dcd5215D2EBC7Ec164";
        const guaranteeFees = document.querySelector("#guaranteeFees").value;
        const rentAgreed = document.querySelector("#rentAgreed").value; 
        
        document.querySelector("#rentAgreed").value;        
        const depositAgreed = document.querySelector("#depositAgreed").value;    
        
        const transaction = await contract.addRentAgreement(addressKey,tenantId,name,Number(rentAgreed),Number(depositAgreed),Number(guaranteeFees));
        await transaction.wait() 
        navigate("/");
    }
    return ( <div >
                <Banner/>

        <ViewPerson state={state}></ViewPerson>
    
     <form onSubmit={addRentAgreement}>
     
       <div className="inputbox">
       <div class="legend">Property Name&nbsp;</div>
         <input type="text" required="required" id="name" />
       </div>
       <div className="inputbox">
       <div class="legend">Tenant&nbsp;</div>
         <input type="text" required="required" id="tenantId"  value ="0xD6d03326Dfe5A9217B7C62Dcd5215D2EBC7Ec164"/>
       </div>
       <div className="inputbox">
       <div class="legend">Guarantee Fees&nbsp;</div>
         <input type="text" required="required" id="guaranteeFees"/>
       </div>

       <div className="inputbox">
       <div class="legend">Rent Per Month (Wei)&nbsp;</div>
         <input type="text" required="required" id="rentAgreed" />
       </div>

       <div className="inputbox">
       <div class="legend">Security Deposit (Wei)&nbsp;</div>
         <input type="text" required="required" id="depositAgreed" />
       </div>

       <div className="inputbox">
         <input type="submit" value="Register Rent Agreement"  disabled={!state.contract}/>
       </div>
     </form>
       
     </div>)
}
export default RentAgreement;