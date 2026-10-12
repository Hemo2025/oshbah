import { useEffect, useState } from "react";
import { SettingsContext } from "./settings-context-instance";
import { DEFAULT_SETTINGS } from "./default-settings";
import { getSettings, saveSettings } from "../services/settingsService";

// دمج الإعدادات مع الحفاظ على القيم الافتراضية
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

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // تحميل الإعدادات مرة واحدة عند تشغيل المتجر
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
  }, []);

  // تحديث الإعدادات وحفظها
  const updateSettings = async (updates) => {
    const newSettings = deepMerge(settings, updates);

    try {
      await saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  };

  // استعادة الإعدادات الافتراضية
  const resetSettings = async () => {
    try {
      await saveSettings(DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Error resetting settings:", error);
      throw error;
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
