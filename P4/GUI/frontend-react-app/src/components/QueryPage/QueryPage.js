import { useState } from "react";
import NavMenu from "../NavMenu/NavMenu"
import './QueryPage.css';

const QueryPage = (props) => {

    const [query, setQuery] = useState("");
    const [queryResponse, setQueryResponse] = useState({});

    const submitQuery = () => {
        let url = new URL('http://localhost:5000/crud')
        url.search = new URLSearchParams({
            query: query 
        })
        fetch(url, {
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log(JSON.stringify(response))
            return response.json()
        })
        .then(json => {
            console.log(json);
            setQueryResponse(json);
        });
    }

    const handleChange = (e) => {
        setQuery(e.currentTarget.value);
    }

    return (
        <div>
            <NavMenu title={props.title}/>
            <div className="p-40 div-center">
                <textarea name="queryText" id="queryText" placeholder="Enter Your Query" onChange={handleChange}/>
                <button onClick={submitQuery} className="queryBtn">Submit</button>
                <textarea name="output" id="output" placeholder="Output..." value={queryResponse?.message} style={{
                    color: "red" ? queryResponse?.status == 400 : "green"
                }}/>
            </div>
        </div>
    )
}

export default QueryPage