import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../../../Firebase";
import styles from "../Login/Login.module.css";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // State to control splash screen
  const navigate = useNavigate(); // Initialize useNavigate

  // Check if the user is already logged in
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If the user is logged in, redirect them to the dashboard
        navigate('/dashboard');
      }
    });
    
    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [navigate]);

  // Handle splash screen timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide splash screen after 3 seconds
    }, 3000); // 3 seconds for splash screen

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth(firebaseApp);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // After successful login, redirect to the dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  if (isLoading) {
    return <div><OrbitProgress color="#000000" size="medium" text="BVM" textColor="#000000" /></div>; // Show splash screen while loading
  }

  return (
    <div className={styles.container}>
      {/* Decorative Spheres */}

      {/* Login Form */}
      <div className={styles.formContainer}>
        
        <h1 className={styles.title}>Birla Vidya Mandir</h1>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Sign In
          </button>
        </form>
        <p className={styles.footerText}>
          Don't have an account? Contact your housemaster.
        </p>
      </div>
    </div>
  );
};

export default Login;
