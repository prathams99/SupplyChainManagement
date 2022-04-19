import './Table.css';

const Table = () => {
    return (
        <table class="styled-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Points</th>
                    <th>Name</th>
                    <th>Points</th>
                    <th>Name</th>
                    <th>Points</th>
                    <th>Name</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Dom</td>
                    <td>6000</td>
                    <td>Dom</td>
                    <td>6000</td>
                    <td>Dom</td>
                    <td>6000</td>
                    <td>Dom</td>
                    <td>6000</td>
                </tr>
                <tr class="active-row">
                    <td>Melissa</td>
                    <td>5150</td>
                    <td className='wrap'>Melsdvfffffffissa</td>
                    <td>5150</td>
                    <td>Melissa</td>
                    <td>5150</td>
                    <td>Melissa</td>
                    <td>5150</td>
                </tr>
            </tbody>
        </table>
    )
}

export default Table;