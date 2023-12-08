import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "./Banner"
import ViewPerson from "./ViewPerson"
import {ethers} from "ethers"
import Status from "./Status"

const ViewRentedOut=({state})=>{
    const [rentAgreements,setRentAgreements]=useState([]);
    const {contract}=state;
    const addressKey = state.account[0];
    const personDetails = state.currentUser;
    const ASSESSMENT_FEES = 30000;
    const navigate = useNavigate()

    const acceptTermination = async(rentAgreement) => {
        try {
        const p = await contract.landlordAgreeDamages(rentAgreement.rentAgreement.property_id); 
            await p.wait();
            navigate("/");
        }catch(exp) {alert(exp);}
        
    }

    const disputeTermination = async(rentAgreement) => {
        
        // state.rentAgreement = rentAgreement;
        // navigate('/tenantVacate');
        try {
        let damages = prompt("Please enter the assessment of damages", "0");
        let text;
        if (damages == null || damages == "") {
                text = "User cancelled the prompt.";
        } else {
            const amountInEther =ethers.formatEther(ASSESSMENT_FEES);
            const amountToBePaid = {value:ethers.parseEther(amountInEther)};
            const p = await contract.disputeDamages(rentAgreement.rentAgreement.property_id,Number(damages),amountToBePaid); 
            await p.wait();
            navigate("/");
        }
    }catch(exp) {alert(exp);}
        
    }

    useEffect(()=>{
        const rentAgreementsMessage = async()=>{
          const tmpRentAgreements = await contract.getRentedOutProperties(addressKey);
          const rentAgreements = await Promise.all(tmpRentAgreements.map( async (rentAgreement)=>{
            const tenantDetails = await contract.getPerson(rentAgreement.tenant); 
            const guarantorDetails = await contract.getPerson(rentAgreement.guarantor); 
            return {rentAgreement:rentAgreement,tenantDetails:tenantDetails,guarantorDetails:guarantorDetails}
            
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

          <h3 style={{ textAlign: "center", marginTop: "20px" }}>Properties that you have Rented out as a Landlord</h3>           
                <table width="100%" class="tableStyle">
                <tbody >
                <tr >
                      <th 
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
                    </th>
                      <th 
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
                      </th>
                      <th 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Guarantor
                      </th>
                      <th 
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
                      </th>
                      <th 
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
                      </th>
                      <th 
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
                      </th>
                      <th 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Damages Declared By Tenant
                      </th>
                      <th 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Accept
                      </th>
                      <th 
                        style={{
                          backgroundColor: "dodgerblue",
                          border: "1px solid white",
                          borderCollapse: "collapse",
                          padding: "7px",
                          width: "100px",
                          color:"white",
                         
                        }}
                      >
                        Dispute
                      </th>
                      
                    </tr>
          {rentAgreements.map((rentAgreement) => {
              const acceptButton = rentAgreement.rentAgreement.status == 3 ?  <button onClick={() => acceptTermination(rentAgreement)}>Accept</button>: <div> - </div>;
              const disputeButton = rentAgreement.rentAgreement.status == 3 ?  <button onClick={() => disputeTermination(rentAgreement)}>Dispute</button>: <div> - </div>;
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
                        {rentAgreement.guarantorDetails.name}
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
                        {Number(rentAgreement.rentAgreement.repayment.tenantDamages)} Wei
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
                        {acceptButton}
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
                        {disputeButton}
                      </td>

                      
                    </tr>
                    
             
            );
          })}
               </tbody>
                </table>
        </div>
      );
}
export default ViewRentedOut;