import './Table.css';

const Table = (props) => {

    return (
        <table class="styled-table">
            <thead>
                <tr>
                    {
                        props.tableData != [] && props.tableData[0] != null && props.tableData != undefined ? Object.keys(props.tableData[0]).map((col) => (
                            <th>{col}</th>
                        )) : ''
                    }
                </tr>
            </thead>
            <tbody>
                {
                    props.tableData != [] ? props.tableData.map((row) => (
                        <tr>
                            {
                                Object.keys(row).map((k) => (
                                    <td>{row[k]}</td>
                                ))
                            }
                        </tr>
                    )) : ''
                }
            </tbody>
        </table>
    )
}

export default Table;