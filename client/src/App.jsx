import { useState,useEffect } from 'react'
import abi from "./contractJson/RentKarma.json"
import {ethers} from "ethers"
import './App.css'
import Person from "./components/Person"
import RentAgreement from "./components/RentAgreement"
import ViewRentedOut from "./components/ViewRentedOut"
import ViewRentedIn from "./components/ViewRentedIn"
import ViewAllAgreements from "./components/ViewAllAgreements"
import TenantVacate from "./components/TenantVacate"

import Home from "./components/Home"
import './App.css';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom"
import ViewDisputedAgreements from './components/ViewDisputedAgreements'

function App() {
  const [state, setState] = useState({
    provider:null,
    signer:null,
    contract:null,
    account:null,
    currentUser:null
  })

  const [account,setAccount] = useState('Not Connected')
  useEffect(()=>{
    const template=async()=>{
      const contractAddress=import.meta.env.VITE_CONTRACT_ADDRESS;//"0x91A08Db3399Cd8b66e702E2AcDF1571F2871994A";
      const contractABI=abi.abi;

      try {
      const {ethereum} = window;
      const account = await ethereum.request({
        method:"eth_requestAccounts"
      })

      window.ethereum.on("accountsChanged",()=>{
        window.location.reload();
      })

      setAccount(account);

      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )
      console.log(contract);
      const currentUser = await contract.getPerson(account[0]);

      setState({provider,signer,contract,account,currentUser});

      
      }catch(error) {
        console.log(error);
      }
    }
    template();
  },[])

  // return (
  //   <div >
  //   <img src={chai} className="img-fluid" alt=".." width="100%" height="100px"/>
  //   <p style={{ marginTop: "10px", marginLeft: "5px" }}>
  //     <small>Connected Account - {account[0]}</small>
  //   </p>
   
  //     <Person state={state}/>
     
   
  // </div>
  // )

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home state={state}/> } />
        <Route path="person" element={ <Person state={state}/> } />
        <Route path="rentAgreement" element={ <RentAgreement state={state}/> } />
        <Route path="viewRentedOut" element={ <ViewRentedOut state={state}/> } />
        <Route path="viewRentedIn" element={ <ViewRentedIn state={state}/> } />
        <Route path="viewAllAgreements" element={ <ViewAllAgreements state={state}/> } />
        <Route path="viewDisputedAgreements" element={ <ViewDisputedAgreements  state={state}/> } />
        <Route path="tenantVacate" element={ <TenantVacate  state={state}/> } />
      </Routes>
    </div>
  )
}

export default App
