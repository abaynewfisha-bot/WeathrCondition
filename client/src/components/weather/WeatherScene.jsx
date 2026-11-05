export default function WeatherScene({ code = 0 }) {
  const isRain = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code);
  const isSnow = [71, 73, 75, 77, 85, 86].includes(code);
  const isStorm = [95, 96, 99].includes(code);
  const isCloudy = [2, 3, 45, 48].includes(code);
  const showSun = [0, 1, 2].includes(code);
  const showCloud = code !== 0 && code !== 1;

  return (
    <svg
      className="h-full w-full drop-shadow-[0_12px_24px_rgba(4,10,20,0.28)]"
      viewBox="0 0 220 180"
      fill="none"
      role="img"
      aria-label="Illustration of the current weather"
    >
      <defs>
        <linearGradient id="scene-cloud" x1="62" y1="66" x2="165" y2="137" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4F8FF" />
          <stop offset="1" stopColor="#91A5BF" />
        </linearGradient>
        <linearGradient id="scene-rain" x1="91" y1="125" x2="83" y2="157" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A9D7FF" />
          <stop offset="1" stopColor="#5E9ED8" />
        </linearGradient>
        <linearGradient id="scene-sun" x1="44" y1="26" x2="100" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE49A" />
          <stop offset="1" stopColor="#FFA52F" />
        </linearGradient>
      </defs>

      {showSun && (
        <>
          <circle cx="82" cy="68" r="44" fill="#FFA52F" fillOpacity=".12" />
          <circle cx="82" cy="68" r="29" fill="url(#scene-sun)" />
          <path d="M82 25v-9M82 120v-9M39 68h-9m104 0h-9M52 38l-7-7m74 74-7-7m0-60 7-7m-74 74 7-7" stroke="#FFD27A" strokeWidth="5" strokeLinecap="round" />
        </>
      )}

      {showCloud && (
        <path
          d="M54 116c-15 0-27-11-27-25 0-13 10-24 23-25 7-20 27-34 51-34 26 0 47 17 52 40 17 1 30 14 30 30 0 17-15 31-33 31H55"
          fill="url(#scene-cloud)"
          stroke="#E8F0FB"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}

      {isRain && (
        <g stroke="url(#scene-rain)" strokeWidth="7" strokeLinecap="round">
          <path d="m67 137-8 17" />
          <path d="m98 141-8 17" />
          <path d="m129 137-8 17" />
          <path d="m158 140-8 17" />
        </g>
      )}

      {isSnow && (
        <g fill="#D9EEFF">
          <path d="M65 143h8v8h-8z" transform="rotate(45 69 147)" />
          <path d="M96 151h8v8h-8z" transform="rotate(45 100 155)" />
          <path d="M127 142h8v8h-8z" transform="rotate(45 131 146)" />
          <path d="M156 150h8v8h-8z" transform="rotate(45 160 154)" />
        </g>
      )}

      {isStorm && (
        <>
          <path d="m112 116-18 28h15l-7 22 29-34h-17l10-16h-12Z" fill="#FFD166" stroke="#FFF0B3" strokeWidth="2" strokeLinejoin="round" />
          <path d="m65 139-7 15m92-15-7 15" stroke="#83B9EA" strokeWidth="6" strokeLinecap="round" />
        </>
      )}

      {isCloudy && (
        <path d="M60 163h105" stroke="#B6C7DC" strokeOpacity=".35" strokeWidth="5" strokeLinecap="round" />
      )}

      <ellipse cx="112" cy="169" rx="70" ry="7" fill="#08111F" fillOpacity=".22" />
    </svg>
  );
}
