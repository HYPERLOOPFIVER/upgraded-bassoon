import React, { useEffect, useState } from 'react';
import { auth, db } from '../../Firebase';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import styles from './Dashboard.module.css';
import { OrbitProgress } from 'react-loading-indicators';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]); // Store latest notices

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
        fetchLatestNotices(); // Fetch notices
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      let userDoc = await getDoc(doc(db, 'users', userId));

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        // If user is not found in 'users', check in 'students'
        userDoc = await getDoc(doc(db, 'students', userId));

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setError('No user data found in users or students collection');
        }
      }
    } catch (error) {
      setError(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the 2 latest notices
  const fetchLatestNotices = () => {
    const q = query(collection(db, 'notices'), orderBy('timestamp', 'desc'), limit(2));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotices(noticesData);
    });

    return () => unsubscribe();
  };

  if (loading) {
    return (
      <div>
        <OrbitProgress color="#000000" size="medium" text="BVM" textColor="#000000" />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Dashboard</h2>
      <div className={`${styles.sphere} ${styles.sphere1}`}></div>
      <div className={`${styles.sphere} ${styles.sphere2}`}></div>
      <div className={`${styles.sphere} ${styles.sphere3}`}></div>
      
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
                <button className={`${styles.addStudentButton} ${styles.button}`} onClick={() => navigate('/signup')}>
                  Add New Student
                </button>
                <button className={`${styles.addNoticeButton} ${styles.button}`} onClick={() => navigate('/AddNotice')}>
                  Add Notice
                </button>
                <button className={`${styles.addNoticeButton} ${styles.button}`} onClick={() => navigate('/delete')}>
                  Delete Notice
                </button>
                <button className={`${styles.totalStudentsButton} ${styles.button}`} onClick={() => navigate('/totalstudents')}>
                  View Total Students
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className={styles.sectionTitle}>Dashboard</h3>
              <p>Check your results, notices, and upcoming events.</p>
              <div className={styles.buttonContainer}>
               
                <button className={`${styles.totalStudentsButton} ${styles.button}`} onClick={() => navigate('/Result')}>
                  View Result
                </button>
              </div>
              
              {/* Display Latest Notices */}
              <h3 className={styles.sectionTitle}>Latest Notices</h3>
              {notices.length === 0 ? (
                <p>No notices available.</p>
              ) : (
                <div className={styles.noticeList}>
                  {notices.map(({ id, title, content, fileUrl }) => (
                    <div key={id} className={styles.noticeCard}>
                      <h4 className={styles.noticeTitle}>{title}</h4>
                      <p className={styles.noticeContent}>{content}</p>
                      
                      {/* Show Attachment (Image or Link) */}
                      {fileUrl && (
                        <div className={styles.attachment}>
                          {fileUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                            <img src={fileUrl} alt="Attachment" className={styles.noticeImage} />
                          ) : (
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={styles.attachmentLink}>
                              View Attachment
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
