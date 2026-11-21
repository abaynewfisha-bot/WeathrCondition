// weatherCodes helpers
export function getWeatherDescription(code) {
  const english = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Heavy thunderstorm with hail"
  };

  const language = localStorage.getItem("weatherworld_language") || "English";
  if (language === "Amharic") {
    const amharic = {
      0:"ጥርት ያለ ሰማይ",1:"በአብዛኛው ጥርት",2:"በከፊል ደመናማ",3:"ደመናማ",
      45:"ጭጋግ",48:"የበረዶ ጭጋግ",61:"ቀላል ዝናብ",63:"መጠነኛ ዝናብ",65:"ከባድ ዝናብ",
      71:"ቀላል በረዶ",73:"መጠነኛ በረዶ",75:"ከባድ በረዶ",95:"ነጎድጓድ"
    };
    return amharic[code] || "የአየር ሁኔታ አይገኝም";
  }
  if (language === "Arabic") {
    const arabic = {0:"سماء صافية",1:"صاف غالبا",2:"غائم جزئيًا",3:"غائم",45:"ضباب",61:"مطر خفيف",63:"مطر معتدل",65:"مطر غزير",71:"ثلج خفيف",95:"عاصفة رعدية"};
    return arabic[code] || "حالة الطقس غير متاحة";
  }
  if (language === "French") {
    const french = {0:"Ciel dégagé",1:"Plutôt dégagé",2:"Partiellement nuageux",3:"Couvert",45:"Brouillard",61:"Pluie légère",63:"Pluie modérée",65:"Forte pluie",71:"Neige légère",95:"Orage"};
    return french[code] || "Météo indisponible";
  }
  if (language === "Geez") {
    return english[code] || "የአየር ሁኔታ የለም";
  }
  return english[code] || "Weather unavailable";
}

export function getWeatherEmoji(code, isDay = true) {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if ([1, 2].includes(code)) return isDay ? "🌤️" : "☁️";
  if ([3, 45, 48].includes(code)) return "☁️";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "🌧️";
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";

  return "🌡️";
}
