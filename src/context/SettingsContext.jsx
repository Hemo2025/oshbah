import { useEffect, useState } from "react";
import { SettingsContext } from "./settings-context-instance";
import { DEFAULT_SETTINGS } from "./default-settings";

import { getSettings, saveSettings } from "../services/settingsService";

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const data = await getSettings();

        if (mounted && data) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data,
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const updateSettings = async (updates) => {
    try {
      const newSettings = {
        ...settings,
        ...updates,
      };

      setSettings(newSettings);

      await saveSettings(newSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const resetSettings = async () => {
    try {
      setSettings(DEFAULT_SETTINGS);

      await saveSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Error resetting settings:", error);
    }
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
  };

  if (loading) {
    return null;
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
