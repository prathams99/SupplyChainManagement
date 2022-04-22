import Table from "../Table/Table";
import './CrudPage.css';
import NavMenu from "../NavMenu/NavMenu";
import { useEffect, useState } from "react";
import axios from 'axios';
import fetch from 'node-fetch';
import CircularJSON from 'circular-json';

const CrudPage = (props) => {

    const [tableName, setTableName] = useState("");
    const [tableData, setTableData] = useState([]);
    const [command, setCommand] = useState("");
    const [showCustomerInput, setShowCustomerInput] = useState("hide");
    const [showAccountInput, setShowAccountInput] = useState("hide");
    const [custID, setCustID] = useState("");
    const [custName, setCustName] = useState("");
    const [custContact, setCustContact] = useState("");
    const [custEmail, setCustEmail] = useState("");
    const [custActive, setCustActive] = useState("");
    const [custAge, setCustAge] = useState("");
    const [custDateOfBirth, setCustDateOfBirth] = useState("");
    const [custSSN, setCustSSN] = useState("");
    const [custState, setCustState] = useState("");
    const [custCity, setCustCity] = useState("");
    const [custAddress, setCustAddress] = useState("");
    const [custZipCode, setCustZipCode] = useState("");

    const selectTable = (selectedTableName) => {
        setTableName(selectedTableName);
        getTableData(selectedTableName);
        if(selectedTableName == "Customer") {
            setShowAccountInput("hide");
            setShowCustomerInput("show");
        }
        else if(selectedTableName == "Account") {
            setShowCustomerInput("hide");
            setShowAccountInput("show");
        }
        else {
            setShowCustomerInput("hide");
            setShowAccountInput("hide");
        }
    }

    const getTableData = (name) => {
        let url = new URL('http://localhost:5000/select')
        url.search = new URLSearchParams({
            table_name: name
        })
        fetch(url)
        .then(response => response.json())
        .then(json => {
            setTableData(json);
        });
    }

    const handleCustActiveChange = (e) => {
        setCustActive(e.currentTarget.value);
    }

    const handleCustAgeChange = (e) => {
        setCustAge(e.currentTarget.value);
    }

    const handleCustAddressChange = (e) => {
        setCustAddress(e.currentTarget.value);
    }

    const handleCustContactChange = (e) => {
        setCustContact(e.currentTarget.value);
    }

    const handleCustCityChange = (e) => {
        setCustCity(e.currentTarget.value);
    }

    const handleCustDateOfBirthChange = (e) => {
        setCustDateOfBirth(e.currentTarget.value);
    }

    const handleCustEmailChange = (e) => {
        setCustEmail(e.currentTarget.value);
    }

    const handleCustIDChange = (e) => {
        console.log("check2")
        console.log("check1 "+e.currentTarget.value);
        setCustID(e.currentTarget.value);
    }

    const handleCustNameChange = (e) => {
        setCustName(e.currentTarget.value);
    }

    const handleCustSSNChange = (e) => {
        setCustSSN(e.currentTarget.value);
    }

    const handleCustStateChange = (e) => {
        setCustState(e.currentTarget.value);
    }

    const handleCustZipcodeChange = (e) => {
        setCustZipCode(e.currentTarget.value);
    }

    const handleCommandChange = (e) => {
        console.log("check3 "+e.currentTarget.value)
        setCommand(e.currentTarget.value);
    }

    const runCommandForCustomer = () => {
        if(command == "delete") {
            let url = new URL(`http://localhost:5000/${command}`)
            url.search = new URLSearchParams({
                table_name: tableName,
                key: "CustID",
                value: custID
            })
            fetch(url)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                alert(json.message);
                getTableData("Customer");
            });
        }
        else {
            let url = new URL(`http://localhost:5000/${command}`)
            url.search = new URLSearchParams({
                table_name: tableName,
                CustID: custID,
                Name: custName,
                Contact: custContact,
                Email: custEmail,
                isActive: custActive,
                Age: custAge,
                DateOfBirth: custDateOfBirth,
                SSN: custSSN,
                State: custState,
                City: custCity,
                Address: custAddress,
                ZipCode: custZipCode,
                Email: custEmail
            })
            fetch(url)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                alert(json.message);
                getTableData("Customer");
            });
        }
    }

    useEffect(() => {
        console.log(tableName);
        console.log(tableData)
    }, [tableData])

    return (
        <div>
            <NavMenu title={props.title}/>
            <div className="flex-container">
                <details className="w-75">
                    <summary></summary>
                    <nav className="menu">
                            <a onClick={() => selectTable("Customer")}>Customer</a>
                            <a onClick={() => selectTable("Account")}>Account</a>
                            <a onClick={() => selectTable("Crew")}>Crew</a>
                            <a onClick={() => selectTable("Weather_Events")}>Weather_Events</a>
                            <a onClick={() => selectTable("Equipment_Location")}>Equipment_Location</a>
                            <a onClick={() => selectTable("Equipment_List")}>Equipment_List</a>
                            <a onClick={() => selectTable("Equipment_Installation")}>Equipment_Installation</a>
                            <a onClick={() => selectTable("Equipment_Repairs")}>Equipment_Repairs</a>
                            <a onClick={() => selectTable("Outages")}>Outages</a>
                            <a onClick={() => selectTable("Account_Equipment")}>Account_Equipment</a>
                            <a onClick={() => selectTable("Customer_Complaints")}>Customer_Complaints</a>
                            <a onClick={() => selectTable("Crew_Assignments")}>Crew_Assignments</a>
                            <a onClick={() => selectTable("Meter_Reading")}>Meter_Reading</a>
                            <a onClick={() => selectTable("Bill")}>Bill</a>
                            <a onClick={() => selectTable("Payment")}>Payment</a>
                    </nav>     
                </details>
                <div className={`flex-item w-25 mtop-80 ${showAccountInput}`}>
                    <label for="cars">Command: </label><br />
                    <select name="commandType" id="commandType">
                        <option value="insert">INSERT</option>
                        <option value="update">UPDATE</option>
                        <option value="delete">DELETE</option>
                    </select>
                    <br />
                    <br />
                    <input type="text" placeholder="id"/><br />
                    <input type="text" placeholder="title"/><br />
                    <input type="text" placeholder="genre"/><br />
                    <input type="text" placeholder="year"/><br />
                    <input type="text" placeholder="genre"/><br />
                    <input type="text" placeholder="genre"/><br />
                    <button className="submit">Submit</button>
                </div>
                <div className={`flex-item w-25 mtop-80 ${showCustomerInput}`}>
                    <label for="cars">Command: </label><br />
                    <select onChange={handleCommandChange} name="commandType" id="commandType">
                        <option value="insert">INSERT</option>
                        <option value="update">UPDATE</option>
                        <option value="delete">DELETE</option>
                    </select>
                    <br />
                    <br />
                    <input type="text" placeholder="CustID" name="custID" id="custID" onChange={handleCustIDChange}/><br />
                    <input type="text" placeholder="Name" onChange={handleCustNameChange}/><br />
                    <input type="number" placeholder="Contact" onChange={handleCustContactChange}/><br />
                    <input type="email" placeholder="Email" onChange={handleCustEmailChange}/><br />
                    <input type="text" placeholder="isActive" onChange={handleCustActiveChange}/><br />
                    <input type="text" placeholder="Age" onChange={handleCustAgeChange}/><br />
                    <input type="date" placeholder="DateOfBirth" onChange={handleCustDateOfBirthChange}/><br />
                    <input type="text" placeholder="SSN" onChange={handleCustSSNChange}/><br />
                    <input type="text" placeholder="State" onChange={handleCustStateChange}/><br />
                    <input type="text" placeholder="City" onChange={handleCustCityChange}/><br />
                    <input type="text" placeholder="Address" onChange={handleCustAddressChange}/><br />
                    <input type="number" placeholder="ZipCode" onChange={handleCustZipcodeChange}/><br />
                    <button className="submit" onClick={runCommandForCustomer}>Submit</button>
                </div>
            </div>
            <h2 className="p-20">{tableName}</h2>
            <div className="flex-container mtop-40 p-20">
                <div className="flex-item w-85">
                    <Table tableData={tableData}/>
                </div>
            </div>
        </div>
    )
}

export default CrudPage;