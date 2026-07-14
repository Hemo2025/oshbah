import { useEffect, useState } from "react";
import { SettingsContext } from "./settings-context-instance";
import { DEFAULT_SETTINGS } from "./default-settings";

import { getSettings, saveSettings } from "../services/settingsService";

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);

  // دمج الكائنات المتداخلة
  const deepMerge = (target, source) => {
    const output = { ...target };

    Object.keys(source).forEach((key) => {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        output[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    });

    return output;
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const data = await getSettings();

        if (mounted && data) {
          setSettings(deepMerge(DEFAULT_SETTINGS, data));
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
  });

  const updateSettings = async (updates) => {
    try {
      const newSettings = deepMerge(settings, updates);

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

    // أو:
    // return <div>Loading...</div>;
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
