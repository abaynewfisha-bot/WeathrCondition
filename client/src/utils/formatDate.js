// formatDate helpers
export function formatDay(dateString, options = {}) {
  if (!dateString) return "--";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "--";

  const language = localStorage.getItem("weatherworld_language") || "English";
  const locale = language === "Amharic" || language === "Geez" ? "am" : language === "Arabic" ? "ar" : language === "French" ? "fr" : "en";
  return new Intl.DateTimeFormat(locale, {
    weekday: options.short ? "short" : "long",
    ...options
  }).format(date);
}

export function formatHour(dateString) {
  if (!dateString) return "--";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "--";

  const language = localStorage.getItem("weatherworld_language") || "English";
  const locale = language === "Amharic" || language === "Geez" ? "am" : language === "Arabic" ? "ar" : language === "French" ? "fr" : "en";
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric"
  }).format(date);
}

export function formatDateTime(dateString) {
  if (!dateString) return "--";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}
