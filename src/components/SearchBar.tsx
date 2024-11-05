import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: (lat: number, lon: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setSearchTerm('');
    }
  };

  const handleLocationClick = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSearch(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        toast.error('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 pl-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={loading}
          className="px-4 py-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/95 transition-colors duration-200 flex items-center gap-2 text-gray-700 disabled:opacity-50"
        >
          <MapPin className="w-5 h-5" />
          {loading ? 'Locating...' : 'Current Location'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;