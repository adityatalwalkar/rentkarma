import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {ethers} from "ethers"
import Banner from "./Banner"
import ViewPerson from "./ViewPerson"
import Status from "./Status"

const ViewDisputedAgreements=({state})=>{
    const [rentAgreements,setRentAgreements]=useState([]);
    const {contract}=state;
    const addressKey = state.account[0];
    const personDetails = state.currentUser;
    const navigate = useNavigate();
    const INVALID_ID = "0x0000000000000000000000000000000000000000";

    const inspectionAssessment = async(rentAgreement) => {
      try{
        let damages = prompt("Please enter the assessment of damages", "0");
        let text;
        if (damages == null || damages == "") {
                text = "User cancelled the prompt.";
        } else {
            
            const p = await contract.independentAssessment(addressKey,rentAgreement.rentAgreement.property_id,Number(damages)); 
            await p.wait();
            navigate("/");
        }
      }catch(exp) {alert(exp);}
        
    } 

    
    useEffect(()=>{
        const rentAgreementsMessage = async()=>{
          const tmpRentAgreements = await contract.getAllAgreements();

          const rentAgreements = await Promise.all(tmpRentAgreements.map( async (rentAgreement)=>{
            const landLordDetails = await contract.getPerson(rentAgreement.landLord); 
            
            const guarantorDetails = await contract.getPerson(rentAgreement.guarantor); 
            const tenantDetails = await contract.getPerson(rentAgreement.tenant); 
            return {rentAgreement:rentAgreement,landLordDetails:landLordDetails,guarantorDetails:guarantorDetails,tenantDetails:tenantDetails}
            
          }))
          console.log(rentAgreements);

          setRentAgreements(rentAgreements)
          console.log(rentAgreements)
        }
        contract && rentAgreementsMessage()
    },[contract])
    return (
        <div className="container-fluid">
            <Banner/>
            <ViewPerson state={state}></ViewPerson>

          <h3 style={{ textAlign: "center", marginTop: "20px" }}>Disputed Agreements - </h3>           
          <table width="100%" class="tableStyle">
                <tbody >
                <tr >
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Property Id
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Landlord 
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Landlord Damage Estimate
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Tenant
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Tenant Damage Estimate
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Monthly Rent (Wei)
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Security Deposit (Wei)
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Status
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Assessor Damage Estimate
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Returned to Tenant
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Returned to Landlord
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Assessment Fee Paid by Tenant
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Assessment Fee Paid by Landlord
                      </td>
                      

                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        
                      </td>
                      
                      
                    </tr>

          {rentAgreements.map((rentAgreement) => {
              const inspectButton = (rentAgreement.rentAgreement.status != 4) ? <div>-</div> : <button onClick={() => inspectionAssessment(rentAgreement)}>Enter Your Assessment</button>;
              
            return (
                    <tr >
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {rentAgreement.rentAgreement.property_id}
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {rentAgreement.landLordDetails.name}
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {Number(rentAgreement.rentAgreement.repayment.landlordDamages)}
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {rentAgreement.tenantDetails.name}
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {Number(rentAgreement.rentAgreement.repayment.tenantDamages)}
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {Number(rentAgreement.rentAgreement.rentAgreed)}
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {Number(rentAgreement.rentAgreement.depositAgreed)}
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        <Status statusValue={Number(rentAgreement.rentAgreement.status)}></Status>
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {Number(rentAgreement.rentAgreement.repayment.assessorAverage)}
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {Number(rentAgreement.rentAgreement.repayment.paidToTenant)}
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {Number(rentAgreement.rentAgreement.repayment.paidToLandlord)}
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {Number(rentAgreement.rentAgreement.repayment.tenantAssessmentFee)}
                      </td>
                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {Number(rentAgreement.rentAgreement.repayment.landlordAssessmentFee)}
                      </td>
                      

                      <td 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        {inspectButton}
                      </td>
                      
                      
                    </tr>
                    
             
            );
          })}
               </tbody>
                </table>
        </div>
      );
}
export default ViewDisputedAgreements;