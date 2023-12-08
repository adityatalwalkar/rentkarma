import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {ethers} from "ethers"
import Banner from "./Banner"
import ViewPerson from "./ViewPerson"
import Status from "./Status"

const ViewRentedIn=({state})=>{
    const [rentAgreements,setRentAgreements]=useState([]);
    const {contract}=state;
    const addressKey = state.account[0];
    const personDetails = state.currentUser;
    const navigate = useNavigate();
    const INVALID_ID = "0x0000000000000000000000000000000000000000";

    const ETHER_TO_WEI = 0.000000000000000001;
    const authorizeAgreement = async(rentAgreement) => {
        try {


        
        const amountInEther =ethers.formatEther(rentAgreement.rentAgreement.depositAgreed + rentAgreement.rentAgreement.guaranteeFees);
        alert("Authorizing the Agreement." + (rentAgreement.rentAgreement.depositAgreed + rentAgreement.rentAgreement.guaranteeFees) + " Weis will be deducted from your account");
        const amountToBePaid = {value:ethers.parseEther(amountInEther)};
        //{value:ethers.parseEther("0.00001")};
        
        const p = await contract.authorizeRentAgreement(rentAgreement.rentAgreement.property_id,amountToBePaid); 
        await p.wait();
        navigate("/");

        }catch(exc)
        {
            alert(exc);
        }
        
    } 

    const vacate = async(rentAgreement) => {
        
        // state.rentAgreement = rentAgreement;
        // navigate('/tenantVacate');
        try{
        let damages = prompt("Please enter the assessment of damages", "0");
        let text;
        if (damages == null || damages == "") {
                text = "User cancelled the prompt.";
        } else {
            const p = await contract.vacatedByTenant(rentAgreement.rentAgreement.property_id,Number(damages)); 
            await p.wait();
            navigate("/");
        }}catch(exp){alert(exp);}
        
    }

    const payRent = async(rentAgreement) => {
        try {
        
        const amountInEther =ethers.formatEther(rentAgreement.rentAgreement.rentAgreed );
        const amountToBePaid = {value:ethers.parseEther(amountInEther)};
        const p = await contract.payRent(rentAgreement.rentAgreement.property_id,amountToBePaid); 
        await p.wait();
        navigate("/");

        }catch(exc)
        {
            alert(exc);
        }
        
    }
    useEffect(()=>{
        const rentAgreementsMessage = async()=>{
          const tmpRentAgreements = await contract.getRentedInProperties(addressKey);

          const rentAgreements = await Promise.all(tmpRentAgreements.map( async (rentAgreement)=>{
            const landLordDetails = await contract.getPerson(rentAgreement.landLord); 
            const guarantorDetails = await contract.getPerson(rentAgreement.guarantor); 
            
            return {rentAgreement:rentAgreement,landLordDetails:landLordDetails,guarantorDetails:guarantorDetails}
            
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

          <h3 style={{ textAlign: "center", marginTop: "20px" }}>Properties that you have Rented  as a Tenant</h3>           
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
                        Property ID
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
                        Landlord
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
                        Authorize Agreement
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
                        Pay Rent
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
                        Vacate                      
                        </th>
                      
                    </tr>
          {rentAgreements.map((rentAgreement) => {
              const authorizeButton = 
                        rentAgreement.rentAgreement.status > 0 ? 
                                <div>-</div> : 
                                        ((rentAgreement.rentAgreement.guarantor != INVALID_ID) ? 
                                                    <button onClick={() => authorizeAgreement(rentAgreement)}>Click to Authorize</button> :
                                                    <div>-</div>);
              const payRentButton = rentAgreement.rentAgreement.status == 1 ?  <button onClick={() => payRent(rentAgreement)}>Pay Rent</button>: <div>-</div>;
              const vacateButton = rentAgreement.rentAgreement.status == 1 ?  <button onClick={() => vacate(rentAgreement)}>Vacate</button>: <div>-</div>;
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
                        {authorizeButton}
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
                        {payRentButton}
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
                        {vacateButton}
                      </td>
                      
                    </tr>
                    
             
            );
          })}
               </tbody>
                </table>
        </div>
      );
}
export default ViewRentedIn;