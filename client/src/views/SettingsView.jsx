import { useEffect, useState } from "react";
import { Bell, Languages, MapPin, Palette, Thermometer } from "lucide-react";

import { useTheme } from "../context/useTheme";
import { useUnit } from "../context/UnitContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { getSettings, updateSettings } from "../services/settingsService";

export default function SettingsView() {
  const { unit, setUnit } = useUnit();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const [saveMessage, setSaveMessage] = useState("");
  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("weatherworld_notifications") !== "off"
  );
  const [locationEnabled, setLocationEnabled] = useState(
    () => localStorage.getItem("weatherworld_location") !== "off"
  );

  useEffect(() => {
    if (!user) return;
    let active = true;
    getSettings()
      .then(({ settings }) => {
        if (!active || !settings) return;
        setUnit(settings.temperature_unit === "fahrenheit" ? "F" : "C");
        setTheme(settings.theme);
        if (settings.language) setLanguage(
          settings.language === "fr" ? "French" :
          settings.language === "ar" ? "Arabic" :
          settings.language === "am" ? "Amharic" : "English"
        );
        setNotifications(Boolean(settings.notifications_enabled));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user, setUnit, setTheme, setLanguage]);

  async function savePreferences() {
    setSaveMessage("");
    if (!user) {
      setSaveMessage("Preferences saved locally.");
      return;
    }

    try {
      await updateSettings({
        temperature_unit: unit === "F" ? "fahrenheit" : "celsius",
        theme,
        language: language === "French" ? "fr" : language === "Arabic" ? "ar" : language === "Amharic" ? "am" : "en",
        notifications_enabled: notifications,
        weather_alerts: notifications
      });
      setSaveMessage("Preferences saved.");
    } catch (error) {
      setSaveMessage(error.response?.data?.error || "Unable to save preferences.");
    }
  }

  function saveNotifications(enabled) {
    setNotifications(enabled);
    localStorage.setItem("weatherworld_notifications", enabled ? "on" : "off");
  }

  function saveLocation(enabled) {
    setLocationEnabled(enabled);
    localStorage.setItem("weatherworld_location", enabled ? "on" : "off");
  }

  function saveLanguage(value) {
    setLanguage(value);
  }

  return (
    <section className="min-w-0 rounded-[20px] border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-7">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">{t("settings")}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Temperature units, theme, notifications, language and location preferences.
        </p>
      </div>

      <div className="grid gap-4 min-[1051px]:grid-cols-2">
        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="mb-4 flex items-center gap-2 font-bold">
            <Thermometer size={20} className="text-[#ffad32]" />
            {t("temperatureUnit")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {["C", "F"].map((value) => (
              <button
                key={value}
                className={`rounded-[12px] border px-4 py-3 font-bold transition ${
                  unit === value
                    ? "border-transparent bg-[linear-gradient(135deg,#6d7be8,#9a65c7)] text-white"
                    : "border-[var(--border)] bg-transparent text-[var(--text)]"
                }`}
                onClick={() => setUnit(value)}
              >
                {value === "C" ? t("celsius") : t("fahrenheit")}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="mb-4 flex items-center gap-2 font-bold">
            <Palette size={20} className="text-[#78aef1]" />
            {t("appearance")}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {["dark", "light", "system"].map((value) => (
              <button
                key={value}
                className={`rounded-[12px] border px-4 py-3 font-bold capitalize transition ${
                  theme === value
                    ? "border-transparent bg-[linear-gradient(135deg,#4485df,#59b3cf)] text-white"
                    : "border-[var(--border)] bg-transparent text-[var(--text)]"
                }`}
                onClick={() => setTheme(value)}
              >
                {value === "dark" ? t("darkTheme") : value === "light" ? t("lightTheme") : "System"}
              </button>
            ))}
          </div>
        </div>

        <PreferenceRow
          icon={<Bell size={20} className="text-[#ef8dad]" />}
          title={t("notifications")}
          description="Receive weather alerts and severe weather updates."
          enabled={notifications}
          onToggle={saveNotifications}
        />

        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="mb-4 flex items-center gap-2 font-bold">
            <Languages size={20} className="text-[#61c6ad]" />
            {t("language")}
          </h2>
          <select
            className="min-h-[44px] w-full rounded-[12px] border border-[var(--border)] bg-[var(--panel)] px-3 text-[var(--text)] outline-none"
            value={language}
            onChange={(event) => saveLanguage(event.target.value)}
          >
            <option>English</option>
            <option>French</option>
            <option>Arabic</option>
            <option>Amharic</option>
            <option>Geez</option>
          </select>
        </div>

        <PreferenceRow
          icon={<MapPin size={20} className="text-[#74a4eb]" />}
          title={t("locationPreferences")}
          description="Allow WeatherWorld to use your device location."
          enabled={locationEnabled}
          onToggle={saveLocation}
        />
      </div>
      <div className="mt-5 flex items-center justify-end gap-3">
        {saveMessage && <p className="text-sm text-[var(--muted)]" role="status">{saveMessage}</p>}
        <button
          type="button"
          onClick={savePreferences}
          className="min-h-[44px] rounded-[12px] border-0 bg-[linear-gradient(135deg,#4e82df,#806cbf)] px-5 font-bold text-white"
        >
          Save preferences
        </button>
      </div>
    </section>
  );
}

function PreferenceRow({ icon, title, description, enabled, onToggle }) {
  return (
    <div className="rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-bold">
            {icon}
            {title}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggle(!enabled)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            enabled ? "bg-[#6d8fe8]" : "bg-[var(--border)]"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
              enabled ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
