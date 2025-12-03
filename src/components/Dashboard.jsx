import { useApp } from '../context/AppContext';

const Dashboard = ({ onSelectDay }) => {
    const { days } = useApp();
    const dayNumbers = Array.from({ length: 25 }, (_, i) => i + 1);

    return (
        <div className="dashboard-grid">
            {dayNumbers.map(day => {
                const isCompleted = days[day] && days[day].chocolateName;
                return (
                    <button
                        key={day}
                        className={`day-card ${isCompleted ? 'completed' : ''}`}
                        onClick={() => onSelectDay(day)}
                    >
                        <span className="day-number">{day}</span>
                        {isCompleted && <span className="status-indicator">✓</span>}
                    </button>
                );
            })}
        </div>
    );
};

export default Dashboard;
