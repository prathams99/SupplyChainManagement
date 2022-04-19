import './DashboardPage.css'
import NavMenu from '../NavMenu/NavMenu'

const DashboardPage = (props) => {
    return (
        <div>
            <NavMenu title={props.title}/>
            <div className='div-center'>
                <iframe width="1300" height="850" src="https://datastudio.google.com/embed/reporting/ca255d37-d419-4097-b7b4-753e2dc6cfbf/page/OUbqC" frameborder="0" style={{boder: 0}} allowfullscreen></iframe>
            </div>
        </div>
    )
}

export default DashboardPage