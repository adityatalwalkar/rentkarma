import {ethers} from "ethers"
import Banner from "./Banner"

const Lender=({state})=>{
    
    const addLender = async(event) =>{
        event.preventDefault();

        const {contract} = state;
        const addressKey = state.account[0];
        const name = document.querySelector("#name").value;
        
        const transaction = await contract.addLender(addressKey,name);
        await transaction.wait() 
        
    }
    return ( <div >
    <Banner/>
     <form onSubmit={addLender}>
       <div className="inputbox">
         <span>Name</span>
         <input type="text" required="required" id="name" />
       </div>

       <div className="inputbox">
         <input type="submit" value="Add Person"  disabled={!state.contract}/>
       </div>
     </form>
       
     </div>)
}
export default Lender;