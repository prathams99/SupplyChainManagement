import './DashboardPage.css'
import NavMenu from '../NavMenu/NavMenu'

const DashboardPage = (props) => {
    return (
        <div>
            <NavMenu title={props.title}/>
            <div className='div-center'>
            <iframe title="Report Draft" width="1140" height="841.25" src="https://app.powerbi.com/reportEmbed?reportId=c501e162-dc0b-40a8-a7c0-cb3bae6ed09c&autoAuth=true&ctid=a8eec281-aaa3-4dae-ac9b-9a398b9215e7&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLW5vcnRoLWNlbnRyYWwtZi1wcmltYXJ5LXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9" frameborder="0" allowFullScreen="true"></iframe>
            </div>
        </div>
    )
}

export default DashboardPage