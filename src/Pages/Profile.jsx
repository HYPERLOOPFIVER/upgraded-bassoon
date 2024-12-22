import React, { useEffect, useState } from 'react';
import { auth, db } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import styles from '../Pages/Dashboard/Dashboard.module.css';
import Sidebar from './navbar/Sidebar';
import SplashScreen from '../Pages/Dashboard/Splash'; // Import SplashScreen

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSplashing, setIsSplashing] = useState(true); // State to control splash screen visibility
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      fetchUserData(user.uid);
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Display the splash screen for 3 seconds
    const timer = setTimeout(() => {
      setIsSplashing(false);
    }, 3000); // 3 seconds for splash screen

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        setError('No user data found');
      }
    } catch (error) {
      setError(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isSplashing) {
    return <SplashScreen />; // Show splash screen while loading
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <div className={styles.sphere + ' ' + styles.sphere1}></div>
        <div className={styles.sphere + ' ' + styles.sphere2}></div>
        <div className={styles.sphere + ' ' + styles.sphere3}></div>

        <div className={styles.dashboardContainer}>
          <div className={styles.userDetails}>
            <h2 className={styles.greeting}>Hi, {userData.name}</h2>
            <div className={styles.userInfo}>
              <p><strong>Father's Name:</strong> {userData.fname}</p>
              <p><strong>Folio:</strong> {userData.folio}</p>
              <p><strong>House:</strong> {userData.house}</p>
              <p><strong>Email:</strong> {userData.email}</p>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
