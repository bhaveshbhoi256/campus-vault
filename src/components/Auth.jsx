// Auth.jsx — The Login / Signup screen.
// Shows a form. User can toggle between "Sign In" and "Create Account".

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Auth() {
  // 'isLogin' toggles between Login and Signup modes
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // stores error messages
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // prevent page from refreshing on form submit
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Create new account
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // If successful, App.jsx will automatically switch to Dashboard
    } catch (err) {
      // Firebase returns error codes like "auth/wrong-password"
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  // Convert Firebase error codes to friendly messages
  function friendlyError(code) {
    const messages = {
      "auth/wrong-password": "Incorrect password. Try again.",
      "auth/user-not-found": "No account found with this email.",
      "auth/email-already-in-use": "This email is already registered.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/invalid-credential": "Invalid email or password.",
    };
    return messages[code] || "Something went wrong. Please try again.";
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo / Title */}
        <div className="auth-logo">
          <span className="logo-icon">🗄️</span>
          <h1>Campus Vault</h1>
          <p>Your notes, always organized.</p>
        </div>

        {/* Toggle buttons: Sign In / Create Account */}
        <div className="auth-tabs">
          <button
            className={isLogin ? "tab active" : "tab"}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Sign In
          </button>
          <button
            className={!isLogin ? "tab active" : "tab"}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Create Account
          </button>
        </div>

        {/* The actual form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Show error message if something went wrong */}
          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
