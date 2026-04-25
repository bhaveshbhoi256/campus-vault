// App.jsx — The ROOT component. Everything starts here.
// React's useState tracks data that changes (like who's logged in).
// React's useEffect runs code when the component first loads.

import { useState, useEffect } from "react";
import { auth } from "./firebase";           // our Firebase connection
import { onAuthStateChanged } from "firebase/auth"; // listens for login/logout
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import "./App.css";

export default function App() {
  // 'user' holds the logged-in user's info, or null if logged out
  const [user, setUser] = useState(null);
  // 'loading' prevents a flash of the login page on refresh
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase tells us whenever the login state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe; // cleanup when component unmounts
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Campus Vault…</p>
      </div>
    );
  }

  // If logged in → show Dashboard, otherwise → show Auth (login/signup)
  return user ? <Dashboard user={user} /> : <Auth />;
}
