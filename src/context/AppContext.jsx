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
      return parsed.judges || [];
    }
    return [];
  });

  const [judgeAvatars, setJudgeAvatars] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.judgeAvatars || {};
    }
    return {};
  });

  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved).days || {}) : {};
  });

  useEffect(() => {
    const dataToSave = {
      judges,
      judgeAvatars,
      days
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [judges, judgeAvatars, days]);

  const addJudge = (name, avatar = null) => {
    if (name && !judges.includes(name)) {
      setJudges([...judges, name]);
      if (avatar) {
        setJudgeAvatars(prev => ({ ...prev, [name]: avatar }));
      }
    }
  };

  const removeJudge = (name) => {
    setJudges(judges.filter(r => r !== name));
    setJudgeAvatars(prev => {
      const newAvatars = { ...prev };
      delete newAvatars[name];
      return newAvatars;
    });
  };

  const updateJudgeAvatar = (name, avatar) => {
    setJudgeAvatars(prev => ({ ...prev, [name]: avatar }));
  };

  const updateDay = (dayId, data) => {
    setDays(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], ...data }
    }));
  };

  const getDay = (dayId) => {
    return days[dayId] || {};
  };

  return (
    <AppContext.Provider value={{
      judges,
      judgeAvatars,
      days,
      addJudge,
      removeJudge,
      updateJudgeAvatar,
      getDay,
      updateDay
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
