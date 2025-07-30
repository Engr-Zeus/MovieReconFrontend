const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://movie-reco-3mtt-575e65ee82ac.herokuapp.com/api';
const TMDB_API_KEY = '2cbfc26c419d1e410165ff41abd1b38f';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const authRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
};

// Authentication API calls
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await authRequest(`${API_BASE_URL}/auth/profile`);
    return response.json();
  },
};

// User features API calls
export const userAPI = {
  addToFavorites: async (movieData) => {
    const response = await authRequest(`${API_BASE_URL}/user/favorites`, {
      method: 'POST',
      body: JSON.stringify(movieData),
    });
    return response.json();
  },

  removeFromFavorites: async (movieId) => {
    const response = await authRequest(`${API_BASE_URL}/user/favorites/${movieId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  addToWatchlist: async (movieData) => {
    const response = await authRequest(`${API_BASE_URL}/user/watchlist`, {
      method: 'POST',
      body: JSON.stringify(movieData),
    });
    return response.json();
  },

  removeFromWatchlist: async (movieId) => {
    const response = await authRequest(`${API_BASE_URL}/user/watchlist/${movieId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  rateMovie: async (ratingData) => {
    const response = await authRequest(`${API_BASE_URL}/user/ratings`, {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });
    return response.json();
  },

  updateProfile: async (profileData) => {
    const response = await authRequest(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.json();
  },
};

// Movie discovery API calls (proxy through backend)
export const movieAPI = {
  searchMovies: async (query, page = 1) => {
    const response = await fetch(`${API_BASE_URL}/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
    return response.json();
  },

  getPopularMovies: async (page = 1) => {
    const response = await fetch(`${API_BASE_URL}/movies/popular?page=${page}`);
    return response.json();
  },

  getMovieDetails: async (movieId) => {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);
    return response.json();
  },

  getMovieRecommendations: async (movieId) => {
    const response = await authRequest(`${API_BASE_URL}/movies/${movieId}/recommendations`);
    return response.json();
  },
};

// Legacy function for backward compatibility
export async function searchMovies(query) {
  const data = await movieAPI.searchMovies(query);
  return data.results || [];
} 