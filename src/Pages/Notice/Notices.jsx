import { useEffect, useState } from 'react';
import { db } from '../../Firebase';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import styles from './Notice.module.css'; // Import CSS file

const NoticesDisplay = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    let q = query(collection(db, 'notices'), orderBy('timestamp', 'desc'));

    if (filter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      q = query(q, where('timestamp', '>=', today));
    } else if (filter === "date" && selectedDate) {
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      const nextDay = new Date(selected);
      nextDay.setDate(nextDay.getDate() + 1);

      q = query(q, where('timestamp', '>=', selected), where('timestamp', '<', nextDay));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotices(noticesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter, selectedDate]);

  const isImage = (fileUrl) => {
    return fileUrl && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileUrl);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Notices</h2>

      {/* Filters */}
      <div className={styles.filters}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("today")}>Today</button>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setFilter("date");
          }} 
        />
      </div>

      {loading ? (
        <p className={styles.loading}>Loading notices...</p>
      ) : notices.length === 0 ? (
        <p className={styles.noNotices}>No notices available.</p>
      ) : (
        <div className={styles.noticeList}>
          {notices.map(({ id, title, content, fileUrl, timestamp, author }) => (
            <div key={id} className={styles.noticeCard}>
              <h3 className={styles.noticeTitle}>{title}</h3>
              <p className={styles.noticeContent}>{content}</p>

              {fileUrl && (
                <div className={styles.attachment}>
                  {isImage(fileUrl) ? (
                    <img src={fileUrl} alt="Notice Attachment" className={styles.noticeImage} />
                  ) : (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.attachmentLink}
                    >
                      View Attachment
                    </a>
                  )}
                </div>
              )}

              <p className={styles.noticeFooter}>
                {author} - {new Date(timestamp?.toDate()).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticesDisplay;
