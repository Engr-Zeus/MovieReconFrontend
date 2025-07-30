import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { searchMovies } from './utils/api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { AuthProvider, useAuth } from './context/AuthContext';
import { authAPI, userAPI } from './utils/api';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Home() {
  const [search, setSearch] = React.useState('');
  const [movies, setMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const results = await searchMovies(search);
      setMovies(results);
    } catch (err) {
      setError('Failed to fetch movies');
    }
    setLoading(false);
  };

  return (
    <Box maxWidth={900} mx="auto">
      <Typography variant="h4" gutterBottom>Discover Movies</Typography>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by title, genre, or year"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: 8, fontSize: 16 }}
        />
        <Button type="submit" variant="contained" color="primary">Search</Button>
      </form>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Box mt={2}>
        {movies.length === 0 && !loading ? (
          <Typography>No movies to display. Try searching!</Typography>
        ) : (
          <Grid container spacing={2}>
            {movies.map(movie => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <Card>
                  {movie.poster_path && (
                    <CardMedia
                      component="img"
                      height="350"
                      image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{movie.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </Box>
        <Box mb={2}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Box>
  );
}

function Register() {
  const { register } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await register(name, email, password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </Box>
        <Box mb={2}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </Box>
        <Box mb={2}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </Box>
        <Box mb={2}>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </Box>
  );
}

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [editing, setEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await userAPI.updateProfile({ name, email });
      if (response.user) {
        updateUser(response.user);
        setMessage('Profile updated successfully!');
        setEditing(false);
      }
    } catch (error) {
      setMessage('Failed to update profile');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h4" gutterBottom>Profile</Typography>
      {message && <Typography color="primary">{message}</Typography>}
      
      {editing ? (
        <>
          <Box mb={2}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: 8, fontSize: 16 }}
            />
          </Box>
          <Box mb={2}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: 8, fontSize: 16 }}
            />
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </>
      ) : (
        <>
          <Typography>Name: {user?.name}</Typography>
          <Typography>Email: {user?.email}</Typography>
          <Button variant="outlined" onClick={() => setEditing(true)} sx={{ mt: 2 }}>
            Edit
          </Button>
          <Button variant="outlined" onClick={handleLogout} sx={{ mt: 2, ml: 2 }}>
            Logout
          </Button>
        </>
      )}
      
      <Box mt={4}>
        <Typography variant="h6">Favorites</Typography>
        <ul>
          {user?.favorites?.map(movie => (
            <li key={movie.movieId}>{movie.title}</li>
          )) || <li>No favorites yet</li>}
        </ul>
        <Typography variant="h6" sx={{ mt: 2 }}>Watchlist</Typography>
        <ul>
          {user?.watchlist?.map(movie => (
            <li key={movie.movieId}>{movie.title}</li>
          )) || <li>No watchlist yet</li>}
        </ul>
      </Box>
    </Box>
  );
}

function MovieDetails() {
  return <Typography variant="h4">Movie Details Page</Typography>;
}

function Navigation() {
  const { isAuthenticated, user } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Movie Recommendation
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        {!isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Typography variant="body2" sx={{ ml: 2 }}>
              Welcome, {user?.name}!
            </Typography>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

function AppContent() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <Navigation />
        <Box sx={{ p: 2 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
