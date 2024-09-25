import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Homepage from './components/Pages/Home';
import ProductPage from './components/Product';
import TypesOfHandicrafts from './components/Types of Handicraft';
import HomeDecor from './components/Homedecor';
import StatuesAndSculptures from './components/Statues';
import ContactPage from './components/Pages/Contact';
import AboutPage from './components/About';
import './App.css';
import AddProduct from './components/AdminPage';
import LoginForm from './components/LoginPage';
import SignupPage from './components/SignupPage';

// Auth Context to manage user state
const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.user, isAdmin: action.isAdmin };
    case 'LOGOUT':
      return { ...state, user: null, isAdmin: false }; // Reset isAdmin to false on logout
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAdmin: true, // Initially, assume no admin
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedIsAdmin = JSON.parse(localStorage.getItem('isAdmin'));

    if (storedUser) {
      dispatch({ type: 'LOGIN', user: storedUser, isAdmin: storedIsAdmin });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Header Component with Conditional Links
function Header() {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const handleAdminClick = () => {
    navigate('/Admin');
  };

  return (
    <header className="header">
      <h1 className="header-title">Handmade & Craft Marketplace</h1>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <div className="nav-link dropdown">
          <span className="dropdown-toggle">Categories</span>
          <div className="dropdown-menu">
            <Link to="/types-of-handicrafts" className="dropdown-item">Types of Handicrafts</Link>
            <Link to="/home-decor" className="dropdown-item">Home Decor</Link>
            <Link to="/statues-and-sculptures" className="dropdown-item">Statues and Sculptures</Link>
          </div>
        </div>
        <Link to="/products" className="nav-link">Products</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        <Link to="/Admin" className="nav-link">Admin</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/signup" className="nav-link">Signin</Link>

        {/* Conditional rendering for admin options */}
        {state.user && (
          <>
            {state.isAdmin && (
              <button className="admin-button" onClick={handleAdminClick}>
                Go to Admin Page
              </button>
            )}
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/types-of-handicrafts" element={<TypesOfHandicrafts />} />
            <Route path="/home-decor" element={<HomeDecor />} />
            <Route path="/statues-and-sculptures" element={<StatuesAndSculptures />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Admin Route */}
            <Route path="/Admin" element={<AddProduct />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupPage  />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;