// formatDate helpers
export function formatDay(dateString, options = {}) {
  if (!dateString) return "--";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en", {
    weekday: options.short ? "short" : "long",
    ...options
  }).format(date);
}

export function formatHour(dateString) {
  if (!dateString) return "--";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en", {
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
