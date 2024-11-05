import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Search, LogIn } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function WeatherApp() {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState('Delhi');
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  const API_KEY = '4e580ef2035f5be515c37d4297fa80ec';

  const fetchWeather = async (searchCity: string = city) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (response.ok && data.cod === 200) {
        setWeather(data);
        setCity(searchCity);
      } else {
        toast.error(data.message || 'City not found!');
      }
    } catch (error) {
      toast.error('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (response.ok && data.cod === 200) {
        setWeather(data);
        setCity(data.name);
        toast.success('Weather updated for your current location');
      } else {
        toast.error('Failed to fetch weather data for your location');
      }
    } catch (error) {
      toast.error('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWeather();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-2xl font-bold">Weather App</h1>
          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
        <SearchBar onSearch={fetchWeather} onLocationSearch={fetchWeatherByCoords} />
        {loading ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6 text-center">
            <div className="animate-pulse">Loading weather data...</div>
          </div>
        ) : (
          weather && <WeatherCard weather={weather} />
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center p-4">
      {isRegistering ? (
        <RegisterForm onToggleForm={() => setIsRegistering(false)} />
      ) : (
        <LoginForm onLogin={onLogin} onToggleForm={() => setIsRegistering(true)} />
      )}
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthProvider>
      {isLoggedIn ? (
        <WeatherApp />
      ) : (
        <AuthScreen onLogin={() => setIsLoggedIn(true)} />
      )}
    </AuthProvider>
  );
}

export default App;