import NavMenu from "../NavMenu/NavMenu"
import './QueryPage.css';

const QueryPage = (props) => {

    return (
        <div>
            <NavMenu title={props.title}/>
            <div className="p-40 div-center">
                <textarea name="queryText" id="queryText" placeholder="Enter Your Query" />
                <button className="queryBtn">Submit</button>
            </div>
        </div>
    )
}

export default QueryPage