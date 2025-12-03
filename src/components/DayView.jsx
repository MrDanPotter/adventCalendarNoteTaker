import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const DayView = ({ dayId, onBack }) => {
    const { judges, getDay, updateDay } = useApp();
    const initialData = getDay(dayId);

    const [chocolateName, setChocolateName] = useState(initialData.chocolateName || '');
    const [studio, setStudio] = useState(initialData.studio || '');
    const [ratings, setRatings] = useState(() => {
        const r = { ...(initialData.ratings || {}) };
        Object.keys(r).forEach(judge => {
            if (typeof r[judge]?.rating === 'number') {
                r[judge].rating = Math.min(10, Math.max(1, r[judge].rating));
            }
        });
        return r;
    });

    useEffect(() => {
        // Initialize ratings for new judges if needed
        const newRatings = { ...ratings };
        let changed = false;
        judges.forEach(r => {
            if (!newRatings[r]) {
                newRatings[r] = { note: '', rating: 0 };
                changed = true;
            }
        });
        if (changed) setRatings(newRatings);
    }, [judges]);

    const handleSave = () => {
        updateDay(dayId, { chocolateName, studio, ratings });
        onBack();
    };

    const updateJudge = (judge, field, value) => {
        setRatings(prev => ({
            ...prev,
            [judge]: {
                ...prev[judge],
                [field]: value
            }
        }));
    };

    return (
        <div className="day-view">
            <header className="view-header">
                <button onClick={onBack} className="back-btn">← Back</button>
                <h2>Day {dayId}</h2>
            </header>

            <div className="chocolate-info">
                <div className="form-group">
                    <label>Chocolate Name</label>
                    <input
                        value={chocolateName}
                        onChange={e => setChocolateName(e.target.value)}
                        placeholder="e.g. Maya Mountain"
                    />
                </div>
                <div className="form-group">
                    <label>Studio</label>
                    <input
                        value={studio}
                        onChange={e => setStudio(e.target.value)}
                        placeholder="e.g. Dandelion"
                    />
                </div>
            </div>

            <div className="ratings-section">
                {judges.map(judge => (
                    <div key={judge} className="rater-card">
                        <h3>{judge}</h3>
                        <div className="rating-input">
                            <div className="rating-header">
                                <label>Rating (1-10)</label>
                                <span className="rating-value">{(ratings[judge]?.rating || 0).toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="0.1"
                                value={Math.min(10, Math.max(1, ratings[judge]?.rating || 1))}
                                onChange={e => updateJudge(judge, 'rating', parseFloat(e.target.value))}
                                className="rating-slider"
                            />
                        </div>
                        <div className="note-input">
                            <label>Notes</label>
                            <textarea
                                value={ratings[judge]?.note || ''}
                                onChange={e => updateJudge(judge, 'note', e.target.value)}
                                placeholder="Tasting notes..."
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button className="save-btn" onClick={handleSave}>Save & Close</button>
        </div>
    );
};

export default DayView;
