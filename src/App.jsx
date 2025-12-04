import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Dashboard from './components/Dashboard';
import DayView from './components/DayView';
import Settings from './components/Settings';
import SummaryTable from './components/SummaryTable';

const MainContent = () => {
  const { days, judges } = useApp();
  const [view, setView] = useState('dashboard'); // dashboard, settings, day
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setView('day');
  };

  const goHome = () => {
    setView('dashboard');
    setSelectedDay(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 onClick={goHome} style={{ cursor: 'pointer' }}>Advent Notes 2025</h1>
        {view === 'dashboard' && (
          <button onClick={() => setView('settings')} className="settings-btn">
            ⚙️
          </button>
        )}
      </header>

      <main className="app-content">
        {view === 'dashboard' && (
          <>
            <Dashboard onSelectDay={handleDaySelect} />
            <SummaryTable days={days} judges={judges} onRowClick={handleDaySelect} />
          </>
        )}
        {view === 'settings' && <Settings onBack={goHome} />}
        {view === 'day' && <DayView dayId={selectedDay} onBack={goHome} />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
