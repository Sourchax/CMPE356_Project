import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const WeatherComponent = () => {
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API URL for your backend
  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        // First fetch stations from your backend API
        const stationsResponse = await axios.get(`${API_URL}/stations`);
        
        // Check if station data is valid
        if (!stationsResponse.data || !Array.isArray(stationsResponse.data) || stationsResponse.data.length === 0) {
          console.log("No stations found or empty response, showing default cities");
          // If stations response is empty, just show data for Istanbul, Izmir, and Bursa
          const defaultData = await getDefaultCitiesWeatherData();
          setWeatherData(defaultData);
          setLoading(false);
          return; // Exit the function early
        }
        
        // Extract unique cities from station data
        const uniqueCities = [...new Set(stationsResponse.data.map(station => station.city))];
        
        // For each unique city, fetch weather data
        const weatherPromises = uniqueCities.map(city => {
          const coords = getCityCoordinates(city);
          console.log(`Fetching weather for ${city} at coordinates: lat=${coords.lat}, lon=${coords.lon}`);
          return axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`);
        });
        
        // Wait for all requests to complete
        const responses = await Promise.all(weatherPromises);
        
        // Process the weather data into a format our component can use
        const processedData = responses.map((response, index) => {
          const data = response.data;
          const cityName = uniqueCities[index];
          
          return {
            name: cityName,
            main: { 
              temp: data.current.temperature_2m, 
              feels_like: data.current.apparent_temperature, 
              humidity: data.current.relative_humidity_2m 
            },
            weather: [{ 
              main: getWeatherCondition(data.current.weather_code), 
              description: getWeatherDescription(data.current.weather_code), 
              icon: getWeatherIconCode(data.current.weather_code) 
            }],
            wind: { speed: data.current.wind_speed_10m },
            sys: { sunrise: 0, sunset: 0 } // OpenMeteo doesn't provide these in the free tier
          };
        });
        
        setWeatherData(processedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Showing data for major cities.");
        setLoading(false);
        
        try {
          // Show only Istanbul, Izmir, and Bursa when there's an error
          const defaultData = await getDefaultCitiesWeatherData();
          setWeatherData(defaultData);
        } catch (fallbackErr) {
          console.error("Error fetching default cities data:", fallbackErr);
          // Use static data as last resort
          setWeatherData(getStaticDefaultCitiesData());
        }
      }
    };

    fetchWeatherData();
  }, []);

  // Helper function to get coordinates for Turkish cities
  const getCityCoordinates = (city) => {
    // Default coordinates (Istanbul) in case the city isn't found
    const defaultCoords = { lat: 41.0082, lon: 28.9784 };
    
    if (!city) return defaultCoords;
    
    // Special handling for cities with dotted İ character
    if (city.toLowerCase().includes("i̇")) {
      if (city.toLowerCase().includes("i̇stanbul")) {
        return { lat: 41.0082, lon: 28.9784 };
      }
      if (city.toLowerCase().includes("i̇zmir")) {
        return { lat: 38.4237, lon: 27.1428 };
      }
    }
    
    // Direct mapping for common Turkish city names (with or without accents)
    const cityMap = {
      "istanbul": { lat: 41.0082, lon: 28.9784 },
      "İstanbul": { lat: 41.0082, lon: 28.9784 },
      "izmir": { lat: 38.4237, lon: 27.1428 },
      "İzmir": { lat: 38.4237, lon: 27.1428 },
      "bursa": { lat: 40.1885, lon: 29.0610 },
      "Bursa": { lat: 40.1885, lon: 29.0610 },
      "bandirma": { lat: 40.3520, lon: 27.9739 },
      "bandırma": { lat: 40.3520, lon: 27.9739 },
      "yalova": { lat: 40.6550, lon: 29.2866 },
      "mudanya": { lat: 40.3750, lon: 28.8828 },
      "foça": { lat: 38.6681, lon: 26.7575 },
      "foca": { lat: 38.6681, lon: 26.7575 },
      "kadıköy": { lat: 40.9927, lon: 29.0230 },
      "kadikoy": { lat: 40.9927, lon: 29.0230 },
      "balçova": { lat: 38.3903, lon: 27.0518 },
      "balcova": { lat: 38.3903, lon: 27.0518 },
      "balıkesir": { lat: 39.6484, lon: 27.8826 },
      "balikesir": { lat: 39.6484, lon: 27.8826 },
      "çanakkale": { lat: 40.1553, lon: 26.4142 },
      "canakkale": { lat: 40.1553, lon: 26.4142 },
      "tekirdağ": { lat: 40.9781, lon: 27.5156 },
      "tekirdag": { lat: 40.9781, lon: 27.5156 },
      "mersin": { lat: 36.8000, lon: 34.6333 },
      "hatay": { lat: 36.2023, lon: 36.1613 },
      "muğla": { lat: 37.2153, lon: 28.3636 },
      "mugla": { lat: 37.2153, lon: 28.3636 }
    };
    
    // Try direct city match first
    if (cityMap[city]) {
      console.log(`Direct match found for ${city}`);
      return cityMap[city];
    }
    
    // Try case-insensitive match
    const lowerCity = city.toLowerCase();
    for (const [key, coords] of Object.entries(cityMap)) {
      if (key.toLowerCase() === lowerCity) {
        console.log(`Case-insensitive match found for ${city} -> ${key}`);
        return coords;
      }
    }
    
    console.log(`No match found for ${city}, using default coordinates`);
    return defaultCoords;
  };

  // Function to convert OpenMeteo weather codes to weather conditions
  const getWeatherCondition = (code) => {
    if (code === 0) return "Clear";
    if (code === 1 || code === 2 || code === 3) return "Clouds";
    if (code >= 45 && code <= 48) return "Fog";
    if (code >= 51 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain";
    if (code >= 85 && code <= 86) return "Snow";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Clouds";
  };

  // Function to get more descriptive weather text
  const getWeatherDescription = (code) => {
    if (code === 0) return "weather.descriptions.clearSky";
    if (code === 1) return "weather.descriptions.mainlyClear";
    if (code === 2) return "weather.descriptions.partlyCloudy";
    if (code === 3) return "weather.descriptions.overcast";
    if (code >= 45 && code <= 48) return "weather.descriptions.fog";
    if (code >= 51 && code <= 55) return "weather.descriptions.lightDrizzle";
    if (code >= 56 && code <= 57) return "weather.descriptions.freezingDrizzle";
    if (code >= 61 && code <= 65) return "weather.descriptions.rain";
    if (code >= 66 && code <= 67) return "weather.descriptions.freezingRain";
    if (code >= 71 && code <= 75) return "weather.descriptions.snow";
    if (code === 77) return "weather.descriptions.snowGrains";
    if (code >= 80 && code <= 82) return "weather.descriptions.rainShowers";
    if (code >= 85 && code <= 86) return "weather.descriptions.snowShowers";
    if (code === 95) return "weather.descriptions.thunderstorm";
    if (code >= 96 && code <= 99) return "weather.descriptions.thunderstormHail";
    return "weather.descriptions.unknown";
  };

  // Function to convert OpenMeteo weather codes to OpenWeatherMap icon codes
  const getWeatherIconCode = (code) => {
    if (code === 0) return "01d";
    if (code === 1) return "02d";
    if (code === 2) return "03d";
    if (code === 3) return "04d";
    if (code >= 45 && code <= 48) return "50d";
    if (code >= 51 && code <= 67) return "09d";
    if (code >= 71 && code <= 77) return "13d";
    if (code >= 80 && code <= 82) return "10d";
    if (code >= 85 && code <= 86) return "13d";
    if (code >= 95 && code <= 99) return "11d";
    return "03d";
  };

  // Default cities weather data (Istanbul, Izmir, Bursa) when there's an error or empty station response
  const getDefaultCitiesWeatherData = async () => {
    try {
      // Try to fetch actual weather data for the default cities
      const defaultCities = ["İstanbul", "İzmir", "Bursa"];
      
      const weatherPromises = defaultCities.map(city => {
        const coords = getCityCoordinates(city);
        console.log(`Fetching default city weather for ${city} at coordinates: lat=${coords.lat}, lon=${coords.lon}`);
        return axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`);
      });
      
      const responses = await Promise.all(weatherPromises);
      
      const processedData = responses.map((response, index) => {
        const data = response.data;
        const cityName = defaultCities[index];
        
        return {
          name: cityName,
          main: { 
            temp: data.current.temperature_2m, 
            feels_like: data.current.apparent_temperature, 
            humidity: data.current.relative_humidity_2m 
          },
          weather: [{ 
            main: getWeatherCondition(data.current.weather_code), 
            description: getWeatherDescription(data.current.weather_code), 
            icon: getWeatherIconCode(data.current.weather_code) 
          }],
          wind: { speed: data.current.wind_speed_10m },
          sys: { sunrise: 0, sunset: 0 }
        };
      });
      
      console.log("Default cities data processed:", processedData);
      return processedData;
    } catch (err) {
      console.error("Error fetching default cities weather:", err);
      // Fallback to static data if API call fails
      return getStaticDefaultCitiesData();
    }
  };
  
  // Static default data as a last resort
  const getStaticDefaultCitiesData = () => {
    return [
      {
        name: "İstanbul",
        main: { temp: 22, feels_like: 21, humidity: 65 },
        weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
        wind: { speed: 5.2 },
        sys: { sunrise: 1649130000, sunset: 1649175000 }
      },
      {
        name: "İzmir",
        main: { temp: 25, feels_like: 26, humidity: 58 },
        weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
        wind: { speed: 3.8 },
        sys: { sunrise: 1649131000, sunset: 1649176000 }
      },
      {
        name: "Bursa",
        main: { temp: 20, feels_like: 19, humidity: 70 },
        weather: [{ main: "Clouds", description: "scattered clouds", icon: "03d" }],
        wind: { speed: 4.1 },
        sys: { sunrise: 1649132000, sunset: 1649177000 }
      }
    ];
  };

  // Get the appropriate icon for the weather condition
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Function to determine background color based on temperature
  const getTempColor = (temp) => {
    if (temp < 10) return "bg-blue-100";
    if (temp < 15) return "bg-blue-50";
    if (temp < 22) return "bg-green-50";
    if (temp < 27) return "bg-yellow-50";
    return "bg-orange-50";
  };

  // Function to get weather icon class
  const getWeatherIconClass = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case "clear": return "fas fa-sun text-yellow-400";
      case "clouds": return "fas fa-cloud text-gray-400";
      case "rain": 
      case "drizzle": return "fas fa-cloud-rain text-blue-400";
      case "thunderstorm": return "fas fa-bolt text-yellow-500";
      case "snow": return "fas fa-snowflake text-blue-200";
      case "mist":
      case "smoke":
      case "haze":
      case "dust":
      case "fog": return "fas fa-smog text-gray-300";
      default: return "fas fa-cloud text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#0D3A73]">{t('weather.conditions')}</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D3A73]"></div>
        </div>
      </div>
    );
  }

  if (error && weatherData.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#0D3A73]">{t('weather.conditions')}</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('error')}: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0D3A73]">{t('weather.atOurStations')}</h2>
        <p className="text-gray-700 text-center mb-12 max-w-3xl mx-auto text-lg leading-relaxed">
          {t('weather.checkConditions')}
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {weatherData.map((city, index) => (
            <div 
              key={index} 
              className={`rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform hover:transform hover:scale-105 ${getTempColor(city.main.temp)} w-full sm:w-64 md:w-72 lg:w-56`}
            >
              <div className="p-4 border-b border-gray-200 bg-white">
                <h3 className="font-bold text-xl text-[#0D3A73]">{city.name}</h3>
              </div>
              
              <div className="p-5 text-center">
                <div className="flex justify-center">
                  {city.weather && city.weather[0] && city.weather[0].icon ? (
                    <img 
                      src={getWeatherIcon(city.weather[0].icon)} 
                      alt={t(city.weather[0].description)}
                      className="w-16 h-16"
                    />
                  ) : (
                    <i className={`text-4xl ${getWeatherIconClass(city.weather?.[0]?.main)}`}></i>
                  )}
                </div>
                
                <div className="mt-2 font-bold text-3xl text-gray-800">
                  {Math.round(city.main.temp)}°C
                </div>
                
                <div className="text-sm text-gray-600 capitalize mt-1">
                  {city.weather?.[0]?.description ? t(city.weather[0].description) : t('weather.dataUnavailable')}
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="text-left">
                    <div className="text-xs text-gray-500">{t('weather.wind')}</div>
                    <div className="font-medium">{Math.round(city.wind?.speed || 0)} km/h</div>
                  </div>
                  
                  <div className="text-left">
                    <div className="text-xs text-gray-500">{t('weather.humidity')}</div>
                    <div className="font-medium">{city.main?.humidity || 0}%</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0D3A73]/10 p-2 text-center text-sm text-[#0D3A73]">
                <span className="font-medium">{t('weather.feelsLike')}: {Math.round(city.main.feels_like)}°C</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>{t('weather.updatedHourly')}: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </section>
  );
};

export default WeatherComponent;