import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const DayView = ({ dayId, onBack }) => {
  const { judges, judgeAvatars, getDay, updateDay } = useApp();
  const initialData = getDay(dayId);

  const [chocolateName, setChocolateName] = useState(initialData.chocolateName || '');
  const [studio, setStudio] = useState(initialData.studio || '');
  const [image, setImage] = useState(initialData.image || null);
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
    updateDay(dayId, { chocolateName, studio, ratings, image });
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Max dimensions
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG 0.6
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        setImage(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="day-view">
      <header className="view-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h2>Day {dayId}</h2>
      </header>

      <div className="day-info-grid">
        <div className="chocolate-info">
          <div className="form-group">
            <label>Chocolate Name</label>
            <input
              value={chocolateName}
              onChange={e => setChocolateName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Studio</label>
            <input
              value={studio}
              onChange={e => setStudio(e.target.value)}
            />
          </div>
        </div>

        <div className="image-section">
          {image ? (
            <div className="image-preview">
              <img src={image} alt="Chocolate" />
              <button onClick={() => setImage(null)} className="remove-image-btn">×</button>
            </div>
          ) : (
            <label className="image-upload-btn">
              <span>📷 Add Photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
          )}
        </div>
      </div>

      <div className="ratings-section">
        {judges.map(judge => (
          <div key={judge} className="rater-card">
            <div className="rater-header">
              {judgeAvatars[judge] && (
                <img src={`/avatars/${judgeAvatars[judge]}`} alt="Avatar" className="judge-avatar" />
              )}
              <h3>{judge}</h3>
            </div>
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
