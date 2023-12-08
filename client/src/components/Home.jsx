import { Link } from "react-router-dom";
import chai from "../banner.png";

import ViewPerson from "./ViewPerson"
import Banner from "./Banner"


const Home=({state})=>{
  
  const initialSetupButton =  <button onClick={() => initialSetup()}>Initial Setup</button>;
    return (
      <div>
      <Banner/>
        <div class="banner">
          
          <ViewPerson state={state}></ViewPerson>
          <Link to="Person">Click to Sign Up to RentKarma</Link><br/>
          <Link to="RentAgreement">Click to Register a Rent Agreement (Landlord Only)</Link><br/>
          <Link to="ViewRentedOut">See Properties You Have Rented As Landlord</Link><br/>
          <Link to="ViewRentedIn">See Properties You Have Rented As Tenant</Link><br/>
          <Link to="ViewAllAgreements">See All Properties Pending Guarantees</Link><br/>
          <Link to="ViewDisputedAgreements">See All Disputed Agreements</Link><br/>

          
        </div>
        </div>
      );
}
export default Home;