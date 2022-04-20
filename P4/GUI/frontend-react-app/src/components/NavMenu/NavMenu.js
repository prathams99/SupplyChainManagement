import './NavMenu.css';
import { Link } from 'react-router-dom';

const NavMenu = (props) => {
    return (
        <div>
            <a href="/" class="menu-icon" className="logo" target="_blank">
		        <img src="https://i.imgur.com/wTlIsIj.png" alt="" />
	        </a>
            <p className='text-center'>{props.title}</p>
            <input className="menu-icon" type="checkbox" id="menu-icon" name="menu-icon"/>
  	        <label for="menu-icon"></label>
            <nav className="nav">
                <ul className="pt-5">
                <h2>Select Operations</h2>
                    <li><Link style={{ textDecoration: 'none' }} to="/crud-operations">CRUD Operations</Link></li>
                    <li><Link style={{ textDecoration: 'none' }} to="/query">Run Query</Link></li>
                    <li><Link style={{ textDecoration: 'none' }} to="/dashboard-datastudio">Dashboard</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default NavMenu;