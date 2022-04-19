import Table from "../Table/Table";
import './CrudPage.css';
import NavMenu from "../NavMenu/NavMenu";
import { useEffect, useState } from "react";
import axios from 'axios';

const CrudPage = (props) => {

    const [tableName, setTableName] = useState("");
    const [tableData, setTableData] = useState([]);
    const [tableFields, setTableFields] = useState([])

    const selectTable = (selectedTableName) => {
        setTableName(selectedTableName);
        getTableData();
    }

    const getTableFields = () => {
        let fieldsArray = []
        for(let k in tableData[0]) {
            fieldsArray.push(k);
        }
        setTableFields(fieldsArray);
    }

    const getTableData = () => {
            var config = {
                method: 'post',
                url: 'https://05f6-155-33-133-1.ngrok.io/select',
                headers: { 
                'Content-Type': 'application/json'
                },
                data: {
                    "table_name": tableName
                }
            };
            
            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                setTableData(response.data);
                getTableFields();
            })
            .catch(function (error) {
                console.log(error);
            });
        }

    useEffect(() => {
        console.log(tableName);
    }, [tableData])

    return (
        <div>
            <NavMenu title={props.title}/>
            <details>
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
            <h2 className="p-20">{tableName}</h2>
            <div className="flex-container mtop-40 p-20">
                <div className="flex-item w-85">
                    <Table />
                </div>
                <div className="flex-item w-15">
                    <label for="cars">Command: </label>
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
                    <button>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default CrudPage;