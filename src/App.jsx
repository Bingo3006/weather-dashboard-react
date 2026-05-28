import { useState } from "react";

const API_KEY = "0d568aef7bed65d3a320136c386814c9";

const weatherTheme = (temp) => {
  if (temp === null) return { bg: "#0a0f1e", accent: "#38bdf8", label: "night" };
  if (temp > 35) return { bg: "#7c1d0a", accent: "#fb923c", label: "scorching" };
  if (temp > 25) return { bg: "#92400e", accent: "#fbbf24", label: "warm" };
  if (temp > 15) return { bg: "#14532d", accent: "#4ade80", label: "mild" };
  if (temp > 5)  return { bg: "#0c2340", accent: "#60a5fa", label: "cool" };
  return { bg: "#0d1b2a", accent: "#a5b4fc", label: "cold" };
};

const windDescription = (speed) => {
  if (speed < 1) return "Calm";
  if (speed < 5) return "Light breeze";
  if (speed < 11) return "Moderate";
  if (speed < 20) return "Strong";
  return "Storm";
};

const uvColor = (humidity) => {
  if (humidity < 30) return "#fbbf24";
  if (humidity < 60) return "#4ade80";
  return "#60a5fa";
};

export default function App() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastList, setForecastList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const theme = weatherTheme(currentWeather ? currentWeather.main.temp : null);

  async function getWeatherAndForecast() {
    if (city.trim() === "") return;

    setLoading(true);
    setError("");
    setCurrentWeather(null);
    setForecastList([]);
    setSearched(true);

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl),
      ]);

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      if (currentData.cod === "404" || forecastData.cod === "404") {
        setError("City not found. Please check the spelling and try again.");
        return;
      }

      if (!currentRes.ok || !forecastRes.ok) {
        setError("Failed to fetch weather data. Please try again.");
        return;
      }

      const dailyData = forecastData.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );

      setCurrentWeather(currentData);
      setForecastList(dailyData);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    wrapper: {
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 20% 20%, ${theme.bg}dd, #060810)`,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 16px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      transition: "background 0.8s ease",
    },
    card: {
      width: "100%",
      maxWidth: "480px",
      color: "#f1f5f9",
    },
    header: {
      marginBottom: "32px",
    },
    title: {
      fontSize: "0.75rem",
      fontWeight: "700",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: theme.accent,
      margin: "0 0 6px 0",
      transition: "color 0.8s ease",
    },
    subtitle: {
      fontSize: "2rem",
      fontWeight: "300",
      color: "#f1f5f9",
      margin: 0,
      letterSpacing: "-0.02em",
    },
    searchRow: {
      display: "flex",
      gap: "10px",
      marginBottom: "32px",
    },
    input: {
      flex: 1,
      padding: "14px 18px",
      background: "rgba(255,255,255,0.06)",
      border: `1px solid rgba(255,255,255,0.12)`,
      borderRadius: "12px",
      color: "#f1f5f9",
      fontSize: "0.95rem",
      outline: "none",
      transition: "border-color 0.3s",
    },
    button: {
      padding: "14px 22px",
      background: theme.accent,
      color: "#0a0f1e",
      border: "none",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "0.9rem",
      cursor: "pointer",
      letterSpacing: "0.05em",
      transition: "background 0.8s ease, transform 0.1s ease",
      whiteSpace: "nowrap",
    },
    errorBox: {
      background: "rgba(239,68,68,0.12)",
      border: "1px solid rgba(239,68,68,0.3)",
      borderRadius: "12px",
      padding: "14px 18px",
      color: "#fca5a5",
      fontSize: "0.9rem",
      marginBottom: "20px",
    },
    mainCard: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px",
      padding: "28px",
      marginBottom: "16px",
      backdropFilter: "blur(10px)",
    },
    locationRow: {
      display: "flex",
      alignItems: "baseline",
      gap: "8px",
      marginBottom: "20px",
    },
    cityName: {
      fontSize: "1.6rem",
      fontWeight: "600",
      margin: 0,
      letterSpacing: "-0.02em",
    },
    countryBadge: {
      background: "rgba(255,255,255,0.1)",
      borderRadius: "6px",
      padding: "3px 8px",
      fontSize: "0.75rem",
      fontWeight: "700",
      letterSpacing: "0.1em",
      color: "#94a3b8",
    },
    tempRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "8px",
    },
    bigTemp: {
      fontSize: "5rem",
      fontWeight: "200",
      letterSpacing: "-0.04em",
      lineHeight: 1,
      margin: 0,
      color: theme.accent,
      transition: "color 0.8s ease",
    },
    weatherIcon: {
      width: "72px",
      height: "72px",
      filter: "drop-shadow(0 0 12px rgba(255,255,255,0.2))",
    },
    description: {
      fontSize: "1rem",
      color: "#cbd5e1",
      textTransform: "capitalize",
      margin: "0 0 24px 0",
      fontWeight: "400",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    statBox: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "12px",
      padding: "14px 16px",
    },
    statLabel: {
      fontSize: "0.7rem",
      fontWeight: "600",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#64748b",
      marginBottom: "6px",
    },
    statValue: {
      fontSize: "1.1rem",
      fontWeight: "500",
      color: "#e2e8f0",
    },
    statSub: {
      fontSize: "0.75rem",
      color: "#64748b",
      marginTop: "2px",
    },
    forecastCard: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px",
      padding: "24px 28px",
      backdropFilter: "blur(10px)",
    },
    forecastTitle: {
      fontSize: "0.7rem",
      fontWeight: "700",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "#64748b",
      margin: "0 0 18px 0",
    },
    forecastRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    },
    forecastDay: {
      fontWeight: "500",
      fontSize: "0.9rem",
      width: "95px",
      color: "#cbd5e1",
    },
    forecastIcon: {
      width: "36px",
      height: "36px",
    },
    forecastTemp: {
      fontWeight: "600",
      fontSize: "1rem",
      color: theme.accent,
      width: "55px",
      textAlign: "right",
      transition: "color 0.8s ease",
    },
    forecastDesc: {
      fontSize: "0.8rem",
      color: "#64748b",
      textTransform: "capitalize",
      width: "90px",
      textAlign: "right",
    },
    loadingBox: {
      textAlign: "center",
      padding: "40px",
      color: "#64748b",
      fontSize: "0.9rem",
      letterSpacing: "0.05em",
    },
    loadingDot: {
      display: "inline-block",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: theme.accent,
      margin: "0 3px",
      animation: "pulse 1.2s ease-in-out infinite",
    },
  };

  return (
    <div style={styles.wrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@200;300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #475569; }
        input:focus { border-color: rgba(255,255,255,0.3) !important; }
        button:hover { opacity: 0.88; transform: translateY(-1px); }
        button:active { transform: translateY(0); }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      <div style={styles.card}>
        <div style={styles.header}>
          <p style={styles.title}>Weather Dashboard</p>
          <h1 style={styles.subtitle}>Live Forecast</h1>
        </div>

        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Enter a city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeatherAndForecast()}
            style={styles.input}
          />
          <button onClick={getWeatherAndForecast} style={styles.button}>
            Search
          </button>
        </div>

        {loading && (
          <div style={styles.loadingBox}>
            <span style={{ ...styles.loadingDot, animationDelay: "0s" }} />
            <span style={{ ...styles.loadingDot, animationDelay: "0.2s" }} />
            <span style={{ ...styles.loadingDot, animationDelay: "0.4s" }} />
          </div>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        {currentWeather && (
          <div style={styles.mainCard}>
            <div style={styles.locationRow}>
              <h2 style={styles.cityName}>{currentWeather.name}</h2>
              <span style={styles.countryBadge}>{currentWeather.sys.country}</span>
            </div>

            <div style={styles.tempRow}>
              <h3 style={styles.bigTemp}>{Math.round(currentWeather.main.temp)}°</h3>
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                alt={currentWeather.weather[0].description}
                style={styles.weatherIcon}
              />
            </div>

            <p style={styles.description}>{currentWeather.weather[0].description}</p>

            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Feels Like</div>
                <div style={styles.statValue}>{Math.round(currentWeather.main.feels_like)}°C</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Humidity</div>
                <div style={styles.statValue} style={{ ...styles.statValue, color: uvColor(currentWeather.main.humidity) }}>
                  {currentWeather.main.humidity}%
                </div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Wind</div>
                <div style={styles.statValue}>{currentWeather.wind.speed} m/s</div>
                <div style={styles.statSub}>{windDescription(currentWeather.wind.speed)}</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Pressure</div>
                <div style={styles.statValue}>{currentWeather.main.pressure} hPa</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Min / Max</div>
                <div style={styles.statValue}>
                  {Math.round(currentWeather.main.temp_min)}° / {Math.round(currentWeather.main.temp_max)}°
                </div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Visibility</div>
                <div style={styles.statValue}>
                  {currentWeather.visibility ? `${(currentWeather.visibility / 1000).toFixed(1)} km` : "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {forecastList.length > 0 && (
          <div style={styles.forecastCard}>
            <p style={styles.forecastTitle}>5-Day Forecast</p>
            {forecastList.map((day, index) => {
              const date = new Date(day.dt_txt);
              const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
              return (
                <div
                  key={index}
                  style={{
                    ...styles.forecastRow,
                    ...(index === forecastList.length - 1 ? { borderBottom: "none" } : {}),
                  }}
                >
                  <span style={styles.forecastDay}>{weekday}</span>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt={day.weather[0].description}
                    style={styles.forecastIcon}
                  />
                  <span style={styles.forecastTemp}>{Math.round(day.main.temp)}°C</span>
                  <span style={styles.forecastDesc}>{day.weather[0].main}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
