import {ethers} from "ethers"
import Banner from "./Banner"

const TenantVacate=({state})=>{
    const {contract}=state;
    const addressKey = state.account[0];
    const {rentAgreement}=state;
    const vacate = async() => {
        try {
        
        const damages = document.querySelector("#damages").value;
        //{value:ethers.parseEther("0.00001")};
        const p = await contract.vacatedByTenant(rentAgreement.rentAgreement.property_id,Number(damages)); 
        await p.wait();
        navigate("/");

        }catch(exc)
        {
            alert(exc);
        }
        
    } 
    return ( <div >
    <Banner/>


    Property ID -  {state.rentAgreement.rentAgreement.property_id}<br/>
    Landlord -  {state.rentAgreement.landLordDetails.name} <br/>
    Security Deposit -  {Number(state.rentAgreement.rentAgreement.depositAgreed)} Wei<br/>
<form onSubmit={vacate}>
<div className="inputbox">
       <div class="legend">Enter your assessment of Damages&nbsp;</div>
         <input type="text" required="required" id="damages" />
       </div>

       <div className="inputbox">
         <button onClick={() => vacate()}>Vacate the Property</button>
       </div>
    
    </form>
       
     </div>)
}
export default TenantVacate;