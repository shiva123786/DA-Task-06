const KEY = "weatherPreferences";

/* Load preferences */
export function loadPreferences() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : {
      defaultCity: "London",
      favorites: []
    };
  } catch {
    return { defaultCity: "London", favorites: [] };
  }
}

/* Save preferences */
export function savePreferences(prefs) {
  localStorage.setItem(KEY, JSON.stringify(prefs));
}
