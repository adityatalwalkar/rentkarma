// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;


contract RentKarma {

    address[] public person_list;
    address[] public lender_list;
    string[] public rent_agreement_list;
    uint16 constant ASSESSMENT_FEES = 30000;
    uint8 constant NUMBER_OF_ASSESSORS = 3;

    struct Person{
        string name;
        string permanentAddress;
        string aadharNo;
        bool isOnboarded;
        uint creditScore;
        uint creditLimit;
        string []propertiesAsLandlord;
        string []propertiesAsTenant;
        string []propertiesAsGuarantor;
    }
    struct Repayment {
        
        uint256 tenantDamages;
        uint256 landlordDamages;
        uint256 assessorAverage;
        uint256 paidToTenant;
        uint256 paidToLandlord;
        uint256 tenantAssessmentFee;
        uint256 landlordAssessmentFee;
        uint256[] assessorDamages;
    }


    struct RentAgreement {
        string property_id;
        string propertyAddress;
        address payable landLord;
        address payable tenant;
        address payable guarantor;
        address payable [] independentAssessors;
        uint256 guaranteeFees;
        uint256 rentAgreed;
        uint256 depositAgreed;
        Repayment repayment;
        uint8 status;
    }

    mapping(address=>Person) public person_map; // one-to-one mapping
    
    mapping(string=>RentAgreement) public rent_agreement_map;
    

    address payable admin;
    
    constructor() {
        admin = payable(msg.sender);
    }

    function addPerson(address a,string calldata name,string calldata permanentAddress,string calldata aadharNo,uint creditScore) external {
       require(creditScore >600,"Very Poor Credit. Improve your credit Score and try again");
       /* Check if Person Exist in the map */
       person_list.push(a);
       person_map[a].name = name;
       person_map[a].aadharNo = aadharNo;
       person_map[a].permanentAddress = permanentAddress;
       person_map[a].creditScore = creditScore;
       person_map[a].isOnboarded = true;
       /* Calculate Credit Limit */
       if(creditScore > 800)
            person_map[a].creditLimit = 100000;
       else if(creditScore > 700)
            person_map[a].creditLimit = 70000;
        else if(creditScore > 600)
            person_map[a].creditLimit = 50000;


    }


    function addRentAgreement(address landLord,address tenant,string calldata property_id,uint rentAgreed,uint depositAgreed,uint guaranteeFees) external {
        require(rentAgreed >0,"Rent Has to be greater than Zero");
        require(depositAgreed >0,"Deposit Has to be greater than Zero");
        rent_agreement_list.push(property_id);
        rent_agreement_map[property_id].property_id = property_id;
        rent_agreement_map[property_id].landLord = payable(landLord);
        rent_agreement_map[property_id].tenant = payable(tenant);
        rent_agreement_map[property_id].rentAgreed = rentAgreed;
        rent_agreement_map[property_id].depositAgreed = depositAgreed;
        rent_agreement_map[property_id].guaranteeFees = guaranteeFees;
        rent_agreement_map[property_id].status = 0;
        person_map[tenant].propertiesAsTenant.push(property_id);
        person_map[landLord].propertiesAsLandlord.push(property_id);

    }
    function addRentGuarantor(string calldata property_id,address guarantor) external {
        require(rent_agreement_map[property_id].landLord != guarantor, "Landlord Cannot be the Guarantor"); 
        require(rent_agreement_map[property_id].tenant != guarantor, "Tenant Cannot be the Guarantor"); 

        rent_agreement_map[property_id].guarantor = payable(guarantor);
        person_map[guarantor].propertiesAsGuarantor.push(property_id);
    }

    function getRentAgreementDetails(string calldata property_id) public view returns (RentAgreement memory){
        return rent_agreement_map[property_id];
    }

    function getPerson(address person_id) public view returns (Person memory){
        return person_map[person_id];
    }

    function getRentedOutProperties(address person_id) public view returns (RentAgreement[] memory){
        RentAgreement[] memory rentedOutProperties =new RentAgreement[](person_map[person_id].propertiesAsLandlord.length);
        for(uint i = 0; i<person_map[person_id].propertiesAsLandlord.length; i++){            
                rentedOutProperties[i] = rent_agreement_map[person_map[person_id].propertiesAsLandlord[i]];
        }
        return rentedOutProperties;
    }

    function getRentedInProperties(address person_id) public view returns (RentAgreement[] memory){
        RentAgreement[] memory rentedInProperties =new RentAgreement[](person_map[person_id].propertiesAsTenant.length);
        for(uint i = 0; i<person_map[person_id].propertiesAsTenant.length; i++){            
                rentedInProperties[i] = rent_agreement_map[person_map[person_id].propertiesAsTenant[i]];
        }
        return rentedInProperties;
    }

  

    function authorizeRentAgreement(string calldata property_id) external payable{
        require(rent_agreement_map[property_id].tenant == msg.sender, "Only Tenant Can Authorize Agreement"); 
        rent_agreement_map[property_id].status = 1;
       // rent_agreement_map[property_id].landLord.transfer(rent_agreement_map[property_id].depositAgreed);
        rent_agreement_map[property_id].guarantor.transfer(rent_agreement_map[property_id].guaranteeFees);
    }

    function payRent(string calldata property_id) external payable{
        require(rent_agreement_map[property_id].tenant == msg.sender, "Only Tenant Can Pay Rent"); 
        rent_agreement_map[property_id].landLord.transfer(rent_agreement_map[property_id].rentAgreed);
    }

    function getAllAgreements() public view returns (RentAgreement[] memory){
       RentAgreement[] memory allAgreements =new RentAgreement[](rent_agreement_list.length);
       for(uint i = 0; i<rent_agreement_list.length; i++){            
                allAgreements[i] = rent_agreement_map[rent_agreement_list[i]];
        }
        return allAgreements;
    }

    function vacatedByTenant(string calldata property_id,uint256 tenantDamages) external {
        require(rent_agreement_map[property_id].tenant == msg.sender, "Only Tenant Can Vacate Property"); 
        rent_agreement_map[property_id].status = 3;
        rent_agreement_map[property_id].repayment.tenantDamages = tenantDamages;
    }

    function landlordAgreeDamages(string calldata property_id) external {
        require(rent_agreement_map[property_id].landLord == msg.sender, "Only Landlord can Settle Damages"); 
        rent_agreement_map[property_id].status = 10;
        uint256 payToTenant = rent_agreement_map[property_id].depositAgreed - rent_agreement_map[property_id].repayment.tenantDamages ;
        rent_agreement_map[property_id].tenant.transfer(payToTenant);
        // Transfer Logic
    }

    function disputeDamages(string calldata property_id,uint256 landlordDamages)  external payable{
        require(rent_agreement_map[property_id].landLord == msg.sender, "Only Landlord can Raise a Dispute"); 
        require(rent_agreement_map[property_id].repayment.tenantDamages < landlordDamages, "No Dispute - Tenant is ready to pay more than what you want."); 
        rent_agreement_map[property_id].status = 4;
        rent_agreement_map[property_id].repayment.landlordDamages = landlordDamages;
    }

   
   
    function independentAssessment(address payable assessor,string calldata property_id,uint256 assessorDamages) external payable{
        require(rent_agreement_map[property_id].landLord != msg.sender, "Landlord cannot be Independent Assessor");
        require(rent_agreement_map[property_id].tenant != msg.sender, "Tenant cannot be Independent Assessor");
        require(rent_agreement_map[property_id].repayment.tenantDamages <= assessorDamages, "Your estimtate cannot be lower than Tenant Estimate"); 
        require(rent_agreement_map[property_id].repayment.landlordDamages >= assessorDamages, "Your estimtate cannot be higher than Landlord Estimate"); 
        rent_agreement_map[property_id].repayment.assessorDamages.push(assessorDamages);
        rent_agreement_map[property_id].independentAssessors.push(assessor);
        if(rent_agreement_map[property_id].repayment.assessorDamages.length >= NUMBER_OF_ASSESSORS)
        {
            rent_agreement_map[property_id].status = 11;
            uint256 sum_ = 0;
            for (uint i = 0; i < rent_agreement_map[property_id].repayment.assessorDamages.length; i++) {
                sum_ += rent_agreement_map[property_id].repayment.assessorDamages[i];
            }
            
            rent_agreement_map[property_id].repayment.assessorAverage = sum_/rent_agreement_map[property_id].repayment.assessorDamages.length;
            
            uint256 rangeOfEstimates = rent_agreement_map[property_id].repayment.landlordDamages - rent_agreement_map[property_id].repayment.tenantDamages;
            
            uint256 tenantPays = (((rent_agreement_map[property_id].repayment.assessorAverage - rent_agreement_map[property_id].repayment.tenantDamages) *100)/   rangeOfEstimates) * ASSESSMENT_FEES/100;
            
            
            //uint256 landLordPays = (((rent_agreement_map[property_id].landlordDamages - rent_agreement_map[property_id].assessorAverage) *100)/   rangeOfEstimates) * ASSESSMENT_FEES/100;
            uint256 landLordPays = ASSESSMENT_FEES - tenantPays;
            
            uint256 payToTenant = rent_agreement_map[property_id].depositAgreed - tenantPays - rent_agreement_map[property_id].repayment.assessorAverage;
            
            uint256 payToLandLord = ASSESSMENT_FEES + rent_agreement_map[property_id].repayment.assessorAverage - landLordPays ;
            
            rent_agreement_map[property_id].tenant.transfer(payToTenant);
            
            rent_agreement_map[property_id].landLord.transfer(payToLandLord);
            rent_agreement_map[property_id].repayment.paidToTenant = payToTenant;
            rent_agreement_map[property_id].repayment.paidToLandlord = payToLandLord;
            rent_agreement_map[property_id].repayment.tenantAssessmentFee = tenantPays;
            rent_agreement_map[property_id].repayment.landlordAssessmentFee = landLordPays;
        
            
            for (uint i = 0; i < rent_agreement_map[property_id].independentAssessors.length; i++) {
                rent_agreement_map[property_id].independentAssessors[i].transfer(10000);
            }



        }
        // Transfer Amount

    }
}