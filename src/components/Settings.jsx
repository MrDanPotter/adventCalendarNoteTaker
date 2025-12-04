import { useState } from 'react';
import { useApp } from '../context/AppContext';

const AVATARS = [
    'avatar_alien.png',
    'avatar_cowboy.png',
    'avatar_mad_scientist.png',
    'avatar_devil.png',
    'avatar_swamp_creature.png',
    'avatar_construction_worker.png',
    'avatar_sasquatch.png'
];

const Settings = ({ onBack }) => {
    const { judges, judgeAvatars, addJudge, removeJudge, updateJudgeAvatar } = useApp();
    const [newJudge, setNewJudge] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [showAvatarPopup, setShowAvatarPopup] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (newJudge.trim()) {
            addJudge(newJudge.trim(), selectedAvatar);
            setNewJudge('');
            setSelectedAvatar(null);
        }
    };

    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar);
        setShowAvatarPopup(false);
    };

    return (
        <div className="settings-view">
            <header className="view-header">
                <button onClick={onBack} className="back-btn">← Back</button>
                <h2>Manage Judges</h2>
            </header>

            <div className="add-judge-section">
                <form onSubmit={handleAdd} className="add-judge-form">
                    <div className="avatar-selector">
                        <button
                            type="button"
                            className="avatar-btn"
                            onClick={() => setShowAvatarPopup(!showAvatarPopup)}
                        >
                            {selectedAvatar ? (
                                <img src={`/avatars/${selectedAvatar}`} alt="Avatar" />
                            ) : (
                                <span>👤</span>
                            )}
                        </button>
                        {showAvatarPopup && (
                            <div className="avatar-popup">
                                <div className="avatar-grid">
                                    {AVATARS.map(avatar => (
                                        <img
                                            key={avatar}
                                            src={`/avatars/${avatar}`}
                                            alt="Avatar"
                                            onClick={() => handleAvatarSelect(avatar)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <input
                        value={newJudge}
                        onChange={(e) => setNewJudge(e.target.value)}
                        placeholder="Enter judge name..."
                        className="judge-input"
                    />
                    <button type="submit" className="add-btn">Add</button>
                </form>
            </div>

            <div className="judges-list">
                <h3>Current Judges</h3>
                {judges.length === 0 ? (
                    <p className="empty-text">No judges added yet.</p>
                ) : (
                    <ul>
                        {judges.map(judge => (
                            <li key={judge} className="judge-item">
                                <div className="judge-info">
                                    {judgeAvatars[judge] && (
                                        <img src={`/avatars/${judgeAvatars[judge]}`} alt="Avatar" className="judge-avatar-small" />
                                    )}
                                    <span>{judge}</span>
                                </div>
                                <button onClick={() => removeJudge(judge)} className="remove-btn">Remove</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Settings;
