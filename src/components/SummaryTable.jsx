import { useState, useMemo } from 'react';

const SummaryTable = ({ days, judges }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'day', direction: 'asc' });

    const tableData = useMemo(() => {
        const data = [];
        Object.entries(days).forEach(([dayId, dayData]) => {
            judges.forEach(judge => {
                const ratingData = dayData.ratings?.[judge];
                if (ratingData) {
                    data.push({
                        judge,
                        day: parseInt(dayId),
                        rating: ratingData.rating || 0,
                        chocolate: dayData.chocolateName || '-',
                        studio: dayData.studio || '-'
                    });
                }
            });
        });
        return data;
    }, [days, judges]);

    const sortedData = useMemo(() => {
        let sortableItems = [...tableData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [tableData, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (name) => {
        if (sortConfig.key !== name) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    if (tableData.length === 0) return null;

    return (
        <div className="summary-table-container">
            <h3>Rating Summary</h3>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('judge')}>Judge {getSortIndicator('judge')}</th>
                            <th onClick={() => requestSort('day')}>Day {getSortIndicator('day')}</th>
                            <th onClick={() => requestSort('rating')}>Rating {getSortIndicator('rating')}</th>
                            <th onClick={() => requestSort('chocolate')}>Chocolate {getSortIndicator('chocolate')}</th>
                            <th onClick={() => requestSort('studio')}>Studio {getSortIndicator('studio')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.judge}</td>
                                <td>{row.day}</td>
                                <td>{row.rating}</td>
                                <td>{row.chocolate}</td>
                                <td>{row.studio}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SummaryTable;
