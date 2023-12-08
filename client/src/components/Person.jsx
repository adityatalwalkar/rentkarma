import {ethers} from "ethers"
import { useNavigate } from "react-router-dom";
import ViewPerson from "./ViewPerson"
import Banner from "./Banner"

const Person=({state})=>{
    const addressKey = state.account[0];
    const navigate = useNavigate()
    const addPerson = async(event) =>{
        event.preventDefault();

        const {contract} = state;
        
        const name = document.querySelector("#name").value;
        const address = document.querySelector("#address").value;
        const aadharNo = document.querySelector("#aadharNo").value;
        const creditScore = document.querySelector("#creditScore").value;        
        try {
        const transaction = await contract.addPerson(addressKey,name,address,aadharNo,Number(creditScore));
        await transaction.wait() 
        }catch(ex) {
          alert(ex);
        }
        navigate("/");
    }
    return ( <div >
      <Banner/>
    <ViewPerson state={state}></ViewPerson>
     <form onSubmit={addPerson}>

    
       <div className="inputbox">
         <div class="legend">Name&nbsp;</div>
         <input type="text" required="required" id="name" />
       </div>
       <div className="inputbox">
       <div class="legend">Address&nbsp;</div>
         <input type="text" required="required" id="address" />
       </div>
       <div className="inputbox">
       <div class="legend">Aadhar&nbsp;</div>
         <input type="text" required="required" id="aadharNo" />
       </div>

       <div className="inputbox">
       <div class="legend">Credit Score&nbsp;</div>         <input type="text" required="required" id="creditScore" />
       </div>



       <div className="inputbox">
         <input type="submit" value="Sign Up"  disabled={!state.contract}/>
       </div>
     </form>
       
     </div>)
}
export default Person;