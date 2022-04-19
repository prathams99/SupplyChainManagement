import './NavMenu.css';
import { Link } from 'react-router-dom';

const NavMenu = (props) => {
    return (
        <div>
            <a href="/" className="logo" target="_blank">
		        <img src="https://previews.123rf.com/images/mazirama/mazirama1501/mazirama150100523/35996167-scm-supply-chain-management-text-concept-on-green-digital-world-map-background.jpg" alt="" />
	        </a>
            <p className='text-center'>{props.title}</p>
            <input class="menu-icon" type="checkbox" id="menu-icon" name="menu-icon"/>
  	        <label for="menu-icon"></label>
            <nav class="nav"> 		
                <ul class="pt-5">
                    <li><Link to="/crud-operations">CRUD Operations</Link></li>
                    <li><Link to="/query">Run Query</Link></li>
                    <li><Link to="/power-bi-dashboard">Power BI Dashboard</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default NavMenu;