import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {ethers} from "ethers"
import Banner from "./Banner"
import ViewPerson from "./ViewPerson"

const ViewAllAgreements=({state})=>{
    const [rentAgreements,setRentAgreements]=useState([]);
    const {contract}=state;
    const addressKey = state.account[0];
    const personDetails = state.currentUser;
    const navigate = useNavigate();
    const INVALID_ID = "0x0000000000000000000000000000000000000000";

    const guaranteeAgreement = async(rentAgreement) => {
        try {
        
        const p = await contract.addRentGuarantor(rentAgreement.rentAgreement.property_id,addressKey); 
        await p.wait();
        navigate("/");

        }catch(exc)
        {
            alert(exc);
        }
        
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

          <h3 style={{ textAlign: "center", marginTop: "20px" }}>Properties that require Guarantor</h3>           
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
                        Landlord Credit Score
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
                        Tenant Credit Score
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
                        One-Time Guarantee Fees (Wei)
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
              const guaranteeButton = (rentAgreement.rentAgreement.guarantor != INVALID_ID) ? <div>Already Guaranteed</div> : <button onClick={() => guaranteeAgreement(rentAgreement)}>Click to Guarantee</button>;
              
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
                        {Number(rentAgreement.landLordDetails.creditScore)}
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
                        {Number(rentAgreement.tenantDetails.creditScore)}
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
                        {Number(rentAgreement.rentAgreement.guaranteeFees)}
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
                        {guaranteeButton}
                      </td>
                      
                      
                    </tr>
                    
             
            );
          })}
               </tbody>
                </table>
        </div>
      );
}
export default ViewAllAgreements;