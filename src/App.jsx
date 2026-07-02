import { Routes, Route, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Navbar, Footer, ProtectedRoute } from "./components";
import {
  Home,
  Explore,
  CountryDetail,
  Guides,
  Saved,
  Login,
  Signup,
  Profile,
} from "./pages";
import { AuthProvider, SavedProvider } from "./context";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <SavedProvider>
        <div className="min-h-screen flex flex-col">
          <ScrollToTop />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/country/:code" element={<CountryDetail />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/saved" element={<Saved />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SavedProvider>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="container-wide py-20 sm:py-32 text-center px-4">
      <p className="coord mb-3">404 · OFF THE MAP</p>
      <h1 className="font-display text-3xl sm:text-4xl text-parchment-50 mb-4">
        This coordinate doesn't exist.
      </h1>
      <p className="text-ink-300 mb-8 max-w-md mx-auto text-sm sm:text-base">
        The page you're looking for may have moved or never existed on our
        atlas.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/explore" className="btn-primary">
          Explore countries
        </Link>
        <Link to="/" className="btn-secondary">
          Return home
        </Link>
      </div>
    </div>
  );
}
