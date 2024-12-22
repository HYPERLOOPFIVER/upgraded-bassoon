import React, { useEffect, useState } from 'react';
import { auth, db } from '../../Firebase';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import SplashScreen from '../Dashboard/Splash'; // Import SplashScreen
import styles from './Dashboard.module.css';

import Chat from '../Messages/Chat';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // State for user data loading
  const [showSplash, setShowSplash] = useState(true); // State for splash screen
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Show splash screen for 2 seconds, then check auth
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      fetchUserData(user.uid);
    });

    return () => {
      clearTimeout(splashTimer);
      unsubscribe();
    };
  }, [navigate]);

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

  if (showSplash) {
    return <SplashScreen />; // Show splash screen
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sphere + ' ' + styles.sphere1}></div>
      <div className={styles.sphere + ' ' + styles.sphere2}></div>
      <div className={styles.sphere + ' ' + styles.sphere3}></div>
      <div className={styles.dashboardContainer}>
        <div className={styles.userDetails}>
          <h2 className={styles.greeting}>Hi, {userData.name}</h2>
          <div className={styles.userInfo}>
            <p><strong>Folio:</strong> {userData.folio}</p>
          </div>
          <hr />
        </div>

        <div className={styles.features}>
          {userData.role === 'housemaster' ? (
            <>
              <h3 className={styles.sectionTitle}>Your Housemaster Dashboard</h3>
              <p>Manage student activities, notices, and more.</p>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.addStudentButton}
                  onClick={() => navigate('/signup')}
                >
                  Add New Student
                </button>
                <button
                  className={styles.addNoticeButton}
                  onClick={() => navigate('/AddNotice')}
                >
                  Add Notice
                </button>
                <button
                  className={styles.totalStudentsButton}
                  onClick={() => navigate('/totalstudents')}
                >
                  View Total Students
                </button>
                <Chat housemasterView={true} />
              </div>
            </>
          ) : (
            <>
              <h3 className={styles.sectionTitle}>Your Student Dashboard</h3>
              <p>Check your results, notices, and upcoming events.</p>
              <div className={styles.buttonContainer}>
                <a
                  href="https://birlavidyamandir.com/SchoolExamResult1.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className={styles.viewResultButton}>
                    View Result
                  </button>
                </a>
                <button onClick={() => navigate('/Cs')} className={styles.chatButton}>
                  Chat with Housemaster
                </button>
              </div>
              <Chat selectedStudentId="CryXUMqfE7bmVVfV9kO4QJfVL2Z2" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
