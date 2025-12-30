import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserSettings } from 'src/shared/types';

type SettingsContextValue = {
  settings: UserSettings;
  loading: boolean;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>({ openaiApiKey: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.ipc.getSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    const updatedSettings = await window.ipc.updateSettings(updates);
    setSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export { SettingsProvider, useSettings };
