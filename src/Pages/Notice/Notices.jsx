import { useEffect, useState } from 'react';
import { db } from '../../Firebase'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions
import SplashScreen from '../Dashboard/Splash'; // Import the SplashScreen component

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'notices')); // Fetch notices from Firestore
        const noticesArray = [];
        querySnapshot.forEach((doc) => {
          noticesArray.push({ id: doc.id, ...doc.data() });
        });
        setNotices(noticesArray); // Store notices in state
      } catch (error) {
        setError(`Error fetching notices: ${error.message}`);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchNotices();
  }, []); // Empty dependency array means it runs once when the component mounts

  const styles = {
    noticesContainer: {
      backgroundColor: '#121212',
      color: '#fff',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '95%',
      margin: '20px auto',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
      wordWrap: 'break-word',
    },
    noticesTitle: {
      textAlign: 'center',
      color: '#1e90ff',
      fontSize: '24px',
      marginBottom: '20px',
    },
    noticesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    noticeCard: {
      backgroundColor: '#1e1e1e',
      padding: '15px',
      borderRadius: '8px',
      border: '1px solid #333',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'pre-wrap', // Ensures the text wraps properly
      wordBreak: 'break-word', // Prevents words from breaking the layout
    },
    noticeTitle: {
      color: '#1e90ff',
      fontSize: '18px',
      marginBottom: '8px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap', // Keeps title on one line
    },
    noticeContent: {
      fontSize: '14px',
      lineHeight: '1.5',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'pre-wrap', // Wraps long content
      wordBreak: 'break-word', // Prevents breaking words in the middle
    },
    noNotices: {
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '16px',
    },
    loadingText: {
      color: '#fff',
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '18px',
    },
    errorText: {
      color: '#ff4d4f',
      textAlign: 'center',
      marginTop: '20px',
      padding: '10px',
      fontSize: '16px',
      backgroundColor: '#fff5f5',
      borderRadius: '5px',
    },
  };

  if (loading) {
    return <SplashScreen />; // Show splash screen while loading
  }

  if (error) {
    return (
      <div style={styles.errorText}>
        {error}
      </div>
    );
  }

  return (
    <div style={styles.noticesContainer}>
      <h2 style={styles.noticesTitle}>Notices</h2>
      <div>
        {notices.length === 0 ? (
          <p style={styles.noNotices}>No notices available at the moment.</p>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} style={styles.noticeCard}>
              <h3 style={styles.noticeTitle}>
                {notice.title || 'Untitled Notice'}
              </h3>
              <p style={styles.noticeContent}>
                {notice.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notices;
