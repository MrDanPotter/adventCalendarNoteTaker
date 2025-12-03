import { useState } from 'react';
import { useApp } from '../context/AppContext';

const Settings = ({ onBack }) => {
    const { judges, addJudge, removeJudge } = useApp();
    const [newJudge, setNewJudge] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newJudge.trim()) {
            addJudge(newJudge.trim());
            setNewJudge('');
        }
    };

    return (
        <div className="settings-view">
            <header className="view-header">
                <button onClick={onBack} className="back-btn">← Back</button>
                <h2>Manage Judges</h2>
            </header>

            <div className="raters-list">
                {judges.map(judge => (
                    <div key={judge} className="rater-item">
                        <span>{judge}</span>
                        <button onClick={() => removeJudge(judge)} className="remove-btn">Remove</button>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAdd} className="add-rater-form">
                <input
                    type="text"
                    value={newJudge}
                    onChange={(e) => setNewJudge(e.target.value)}
                    placeholder="Enter name..."
                />
                <button type="submit">Add Judge</button>
            </form>
        </div>
    );
};

export default Settings;
