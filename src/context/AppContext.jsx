import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_JUDGES = ['Judge 1', 'Judge 2'];
const STORAGE_KEY = 'advent_calendar_data';

export const AppProvider = ({ children }) => {
  const [judges, setJudges] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: if raters exists but judges doesn't, use raters
      if (parsed.raters && !parsed.judges) {
        return parsed.raters;
      }
      return parsed.judges || INITIAL_JUDGES;
    }
    return INITIAL_JUDGES;
  });

  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).days : {};
  });

  useEffect(() => {
    // Save as judges, preserving days
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ judges, days }));
  }, [judges, days]);

  const addJudge = (name) => {
    if (name && !judges.includes(name)) {
      setJudges([...judges, name]);
    }
  };

  const removeJudge = (name) => {
    setJudges(judges.filter(r => r !== name));
  };

  const updateDay = (dayId, dayData) => {
    setDays(prev => ({
      ...prev,
      [dayId]: dayData
    }));
  };

  const getDay = (dayId) => {
    return days[dayId] || { chocolateName: '', studio: '', ratings: {} };
  };

  return (
    <AppContext.Provider value={{ judges, days, addJudge, removeJudge, updateDay, getDay }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
