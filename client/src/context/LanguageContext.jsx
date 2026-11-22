import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  English: {
    home: "Home", cities: "Cities", favorites: "Favorites", map: "Map", settings: "Settings", about: "About",
    search: "Search for a city...", liveWeather: "Live Weather", highlights: "Today's Highlights",
    perfectWeather: "Perfect weather for outdoor activities!", wearLight: "Wear light clothes",
    goodDriving: "Good driving conditions", sunriseSunset: "Sunrise & Sunset", sunrise: "Sunrise", sunset: "Sunset",
    hourlyForecast: "Hourly Forecast", now: "Now", currentConditions: "Current Conditions", feelsLike: "Feels like",
    sevenDay: "7-Day Forecast", viewDetails: "View Details", today: "Today", humidity: "Humidity", wind: "Wind",
    visibility: "Visibility", pressure: "Pressure", temperatureUnit: "Temperature unit", appearance: "Appearance",
    notifications: "Weather notifications", language: "Language", locationPreferences: "Location preferences",
    darkTheme: "Dark theme", lightTheme: "Light theme", celsius: "Celsius (°C)", fahrenheit: "Fahrenheit (°F)",
    addLocation: "Add location", removeFavorite: "Remove favorite", browseCities: "Browse cities",
    noFavorites: "No favorites yet", savedLocations: "saved locations", compare: "Temperature comparison",
    searchLocations: "Search locations, compare temperatures and manage saved cities.",
    selectedLocation: "Selected location", geographicalInfo: "Geographical information", latitude: "Latitude",
    longitude: "Longitude", timezone: "Timezone", viewForecast: "View full forecast", selectLocation: "Select a location",
    mapDescription: "Explore city locations and live geographical weather conditions."
  },
  French: {
    home: "Accueil", cities: "Villes", favorites: "Favoris", map: "Carte", settings: "Paramètres", about: "À propos",
    search: "Rechercher une ville...", liveWeather: "Météo en direct", highlights: "Points forts du jour",
    perfectWeather: "Temps parfait pour les activités extérieures !", wearLight: "Portez des vêtements légers",
    goodDriving: "Bonnes conditions de conduite", sunriseSunset: "Lever & coucher du soleil", sunrise: "Lever", sunset: "Coucher",
    hourlyForecast: "Prévisions horaires", now: "Maintenant", currentConditions: "Conditions actuelles", feelsLike: "Ressenti",
    sevenDay: "Prévisions sur 7 jours", viewDetails: "Voir les détails", today: "Aujourd'hui", humidity: "Humidité", wind: "Vent",
    visibility: "Visibilité", pressure: "Pression", temperatureUnit: "Unité de température", appearance: "Apparence",
    notifications: "Notifications météo", language: "Langue", locationPreferences: "Préférences de localisation",
    darkTheme: "Thème sombre", lightTheme: "Thème clair", celsius: "Celsius (°C)", fahrenheit: "Fahrenheit (°F)",
    addLocation: "Ajouter un lieu", removeFavorite: "Retirer des favoris", browseCities: "Voir les villes",
    noFavorites: "Aucun favori", savedLocations: "lieux enregistrés", compare: "Comparaison des températures",
    searchLocations: "Recherchez des villes, comparez les températures et gérez les lieux.",
    selectedLocation: "Lieu sélectionné", geographicalInfo: "Informations géographiques", latitude: "Latitude",
    longitude: "Longitude", timezone: "Fuseau horaire", viewForecast: "Voir les prévisions", selectLocation: "Sélectionner un lieu",
    mapDescription: "Explorez les villes et les conditions météorologiques géographiques."
  },
  Arabic: {
    home: "الرئيسية", cities: "المدن", favorites: "المفضلة", map: "الخريطة", settings: "الإعدادات", about: "حول",
    search: "ابحث عن مدينة...", liveWeather: "الطقس المباشر", highlights: "أبرز فعاليات اليوم",
    perfectWeather: "طقس مثالي للأنشطة الخارجية!", wearLight: "ارتد ملابس خفيفة",
    goodDriving: "ظروف قيادة جيدة", sunriseSunset: "الشروق والغروب", sunrise: "الشروق", sunset: "الغروب",
    hourlyForecast: "توقعات الساعة", now: "الآن", currentConditions: "الظروف الحالية", feelsLike: "الشعور كأنه",
    sevenDay: "توقعات 7 أيام", viewDetails: "عرض التفاصيل", today: "اليوم", humidity: "الرطوبة", wind: "الرياح",
    visibility: "الرؤية", pressure: "الضغط", temperatureUnit: "وحدة الحرارة", appearance: "المظهر",
    notifications: "تنبيهات الطقس", language: "اللغة", locationPreferences: "تفضيلات الموقع",
    darkTheme: "الوضع الداكن", lightTheme: "الوضع الفاتح", celsius: "مئوية (°C)", fahrenheit: "فهرنهايت (°F)",
    addLocation: "إضافة موقع", removeFavorite: "إزالة من المفضلة", browseCities: "تصفح المدن",
    noFavorites: "لا توجد مفضلة", savedLocations: "مواقع محفوظة", compare: "مقارنة درجات الحرارة",
    searchLocations: "ابحث عن المدن وقارن درجات الحرارة وأدر المواقع.",
    selectedLocation: "الموقع المحدد", geographicalInfo: "المعلومات الجغرافية", latitude: "خط العرض",
    longitude: "خط الطول", timezone: "المنطقة الزمنية", viewForecast: "عرض التوقعات كاملة", selectLocation: "اختر موقعًا",
    mapDescription: "استكشف مواقع المدن وظروف الطقس الجغرافية المباشرة."
  },
  Amharic: {
    home: "መነሻ", cities: "ከተሞች", favorites: "ተወዳጆች", map: "ካርታ", settings: "ቅንብሮች", about: "ስለ መተግበሪያው",
    search: "ከተማ ፈልግ...", liveWeather: "ቀጥታ የአየር ሁኔታ", highlights: "የዛሬ ዋና ነጥቦች",
    perfectWeather: "ለውጪ እንቅስቃሴዎች ተስማሚ የአየር ሁኔታ!", wearLight: "ቀላል ልብስ ለብሱ",
    goodDriving: "ጥሩ የመንዳት ሁኔታ", sunriseSunset: "ፀሐይ መውጫ & መጥለቅ", sunrise: "ፀሐይ መውጫ", sunset: "ፀሐይ መጥለቅ",
    hourlyForecast: "የሰዓት ትንበያ", now: "አሁን", currentConditions: "የአሁኑ ሁኔታ", feelsLike: "እንደሚሰማው",
    sevenDay: "የ7 ቀን ትንበያ", viewDetails: "ዝርዝር ይመልከቱ", today: "ዛሬ", humidity: "እርጥበት", wind: "ንፋስ",
    visibility: "ታይነት", pressure: "ግፊት", temperatureUnit: "የሙቀት መለኪያ", appearance: "ገጽታ",
    notifications: "የአየር ሁኔታ ማሳወቂያዎች", language: "ቋንቋ", locationPreferences: "የቦታ ምርጫዎች",
    darkTheme: "ጨለማ ገጽታ", lightTheme: "ብርሃን ገጽታ", celsius: "ሴልሺየስ (°C)", fahrenheit: "ፋረንሃይት (°F)",
    addLocation: "ቦታ ጨምር", removeFavorite: "ከተወዳጆች አስወግድ", browseCities: "ከተሞችን ይመልከቱ",
    noFavorites: "ተወዳጆች የሉም", savedLocations: "የተቀመጡ ቦታዎች", compare: "የሙቀት ማነፃፀሪያ",
    searchLocations: "ከተሞችን ፈልጉ፣ ሙቀትን አወዳድሩ እና ቦታዎችን ያስተዳድሩ።",
    selectedLocation: "የተመረጠ ቦታ", geographicalInfo: "ጂኦግራፊያዊ መረጃ", latitude: "ኬክሮስ",
    longitude: "ኬንትሮስ", timezone: "የጊዜ ሰቅ", viewForecast: "ሙሉ ትንበያ ይመልከቱ", selectLocation: "ቦታ ይምረጡ",
    mapDescription: "የከተማ ቦታዎችን እና ቀጥታ የአየር ሁኔታን ያስሱ።"
  },
  Geez: {
    home: "ቤት", cities: "አህጉራት", favorites: "ፍቁራን", map: "ስእለት", settings: "ሥርዓት", about: "በእንተ",
    search: "አስለህ ሕድ...", liveWeather: "ሕያው አየር", highlights: "የዮም ዋናታት",
    perfectWeather: "ለአፍራት ምግባር ተስማሚ አየር!", wearLight: "ክብደት ልብስ ልበስ",
    goodDriving: "ዐማር የመንዳት ሁኔታ", sunriseSunset: "ምስራቅና መስቀል", sunrise: "ምስራቅ", sunset: "መስቀል",
    hourlyForecast: "የሰዓት ትንበያ", now: "ይኸው", currentConditions: "የዮሙ ሁኔታ", feelsLike: "እንደ",
    sevenDay: "የ7 መዋዕል ትንበያ", viewDetails: "ርእይ ዝርዝር", today: "ዮም", humidity: "ጠል",
    wind: "ነፋስ", visibility: "ራዕይ", pressure: "ተጽዕኖ", temperatureUnit: "የሙቀት መለኪያ",
    appearance: "ምስል", notifications: "የአየር ማስታወቂያ", language: "ቋንቋ", locationPreferences: "የቦታ ምርጫ",
    darkTheme: "ጨለማ", lightTheme: "ብርሃን", celsius: "ሴልሲየስ", fahrenheit: "ፋረንሃይት",
    addLocation: "ቦታ ወስክ", removeFavorite: "አስወግድ", browseCities: "አህጉራት ርአ",
    noFavorites: "ፍቁራን የለዎም", savedLocations: "የተቀመጡ ቦታታት", compare: "የሙቀት ማነፃፀር",
    searchLocations: "አህጉራት አስለህ፣ ሙቀት አወዳድር፣ ቦታዎች አስተዳድር።",
    selectedLocation: "የተመረጠ ቦታ", geographicalInfo: "የምድር መረጃ", latitude: "ደቡብ",
    longitude: "አውሮብ", timezone: "የሰዓት ክልል", viewForecast: "ትንበያ ርአ", selectLocation: "ቦታ ምረጽ",
    mapDescription: "የአህጉር ቦታዎችንና ሕያው አየር ርአ።"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem("weatherworld_language") || "English"
  );

  useEffect(() => {
    const value = translations[language] ? language : "English";
    localStorage.setItem("weatherworld_language", value);
    document.documentElement.lang =
      value === "Arabic" ? "ar" : value === "Amharic" || value === "Geez" ? "am" : value === "French" ? "fr" : "en";
    document.documentElement.dir = value === "Arabic" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = useCallback((value) => {
    setLanguageState(translations[value] ? value : "English");
  }, []);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key) => translations[language]?.[key] || translations.English[key] || key
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
