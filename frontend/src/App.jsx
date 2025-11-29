import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
} from "react-router-dom";
import Hero from "./components/Home/Hero";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import ArtistsPage from "./pages/ArtistsPage";
import CollaborationsPage from "./pages/CollaborationsPage";
import AttendeeRegistrationPage from "./pages/AttendeeRegistrationPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { Button } from "./components/ui/button";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* User Pages */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/collaborations" element={<CollaborationsPage />} />
        <Route path="/register" element={<AttendeeRegistrationPage />} />

        {/* Admin Pages */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </Router>
  );
}

// Navigation Component
const Navigation = () => {
  return (
    <nav className="bg-black border-b border-white/5 p-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="text-white font-bold text-2xl hover:opacity-80">
          🎵 Music<span className="text-blue-400">Live</span>
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "opacity-100" : "opacity-60 hover:opacity-80"
            }
          >
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/5"
            >
              🏠 Home
            </Button>
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? "opacity-100" : "opacity-60 hover:opacity-80"
            }
          >
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/5"
            >
              🎵 Events
            </Button>
          </NavLink>
          <NavLink
            to="/artists"
            className={({ isActive }) =>
              isActive ? "opacity-100" : "opacity-60 hover:opacity-80"
            }
          >
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/5"
            >
              🎤 Artists
            </Button>
          </NavLink>
          <NavLink
            to="/collaborations"
            className={({ isActive }) =>
              isActive ? "opacity-100" : "opacity-60 hover:opacity-80"
            }
          >
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/5"
            >
              🤝 Collaborations
            </Button>
          </NavLink>
          <NavLink to="/register">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Register
            </Button>
          </NavLink>
          <NavLink to="/admin/login">
            <Button className="bg-black text-white hover:bg-slate-900">
              Admin
            </Button>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default App;
