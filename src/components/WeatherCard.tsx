import React, { useState } from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets, Navigation, Activity, ChevronDown, ChevronUp, Compass } from 'lucide-react';

interface WeatherCardProps {
  weather: any;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const [showActivities, setShowActivities] = useState(false);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-16 h-16 text-yellow-400" />;
      case 'clouds':
        return <Cloud className="w-16 h-16 text-gray-400" />;
      case 'rain':
        return <CloudRain className="w-16 h-16 text-blue-400" />;
      default:
        return <Sun className="w-16 h-16 text-yellow-400" />;
    }
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getWindSpeedCategory = (speed: number) => {
    if (speed < 0.5) return { label: 'Calm', color: 'text-green-500' };
    if (speed < 6) return { label: 'Light Breeze', color: 'text-blue-400' };
    if (speed < 12) return { label: 'Moderate', color: 'text-yellow-500' };
    if (speed < 20) return { label: 'Strong', color: 'text-orange-500' };
    return { label: 'Storm', color: 'text-red-500' };
  };

  const getActivitiesForWeather = (condition: string, temp: number) => {
    const activities = {
      clear: {
        title: 'Perfect for Outdoor Activities!',
        activities: [
          { name: 'Go for a picnic in the park', suitable: temp >= 20 && temp <= 30 },
          { name: 'Beach day', suitable: temp >= 25 },
          { name: 'Outdoor sports', suitable: temp >= 15 && temp <= 30 },
          { name: 'Garden maintenance', suitable: temp >= 15 && temp <= 28 },
          { name: 'Cycling', suitable: temp >= 15 && temp <= 30 }
        ]
      },
      clouds: {
        title: 'Great for Mild Activities!',
        activities: [
          { name: 'Photography session', suitable: true },
          { name: 'Light hiking', suitable: temp >= 15 },
          { name: 'Visit a café', suitable: true },
          { name: 'Shopping', suitable: true },
          { name: 'City walking tour', suitable: temp >= 10 }
        ]
      },
      rain: {
        title: 'Indoor Fun Time!',
        activities: [
          { name: 'Visit a museum', suitable: true },
          { name: 'Watch a movie', suitable: true },
          { name: 'Indoor rock climbing', suitable: true },
          { name: 'Board games café', suitable: true },
          { name: 'Cooking class', suitable: true }
        ]
      }
    };

    const weatherType = condition.toLowerCase();
    return activities[weatherType as keyof typeof activities] || activities.clear;
  };

  const weatherCondition = weather.weather[0].main.toLowerCase();
  const temperature = Math.round(weather.main.temp);
  const recommendedActivities = getActivitiesForWeather(weatherCondition, temperature);
  const windSpeed = weather.wind.speed;
  const windDirection = getWindDirection(weather.wind.deg);
  const windCategory = getWindSpeedCategory(windSpeed);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6 transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{weather.name}</h2>
          <div className="flex items-center justify-center mb-4">
            {getWeatherIcon(weather.weather[0].main)}
          </div>
          <p className="text-5xl font-bold text-gray-800 mb-2">
            {temperature}°C
          </p>
          <p className="text-xl text-gray-600 capitalize">
            {weather.weather[0].description}
          </p>
        </div>
        
        <div className="flex flex-col justify-center space-y-4">
          {/* Wind Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Wind className="w-6 h-6 text-blue-500 mr-2" />
                <span className="font-medium text-gray-700">Wind Status</span>
              </div>
              <span className={`font-semibold ${windCategory.color}`}>
                {windCategory.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-800">{windSpeed}</span>
                <span className="ml-1 text-gray-600">m/s</span>
              </div>
              <div className="flex items-center justify-end">
                <Compass className="w-5 h-5 text-gray-500 mr-1" />
                <span className="font-medium text-gray-700">{windDirection}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Droplets className="w-6 h-6 text-blue-500 mr-3" />
            <span className="text-gray-700">Humidity: {weather.main.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Navigation className="w-6 h-6 text-blue-500 mr-3" />
            <span className="text-gray-700">
              Pressure: {weather.main.pressure} hPa
            </span>
          </div>
          <div className="flex items-center">
            <Sun className="w-6 h-6 text-blue-500 mr-3" />
            <span className="text-gray-700">
              Feels like: {Math.round(weather.main.feels_like)}°C
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <button
          onClick={() => setShowActivities(!showActivities)}
          className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-blue-500 mr-2" />
            <span className="font-medium text-blue-700">
              {recommendedActivities.title}
            </span>
          </div>
          {showActivities ? (
            <ChevronUp className="w-5 h-5 text-blue-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-500" />
          )}
        </button>

        {showActivities && (
          <div className="mt-4 space-y-2">
            {recommendedActivities.activities.map((activity, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  activity.suitable
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-50 text-gray-500 line-through'
                }`}
              >
                {activity.name}
                {!activity.suitable && (
                  <span className="text-sm ml-2">
                    (Not recommended in current temperature)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;