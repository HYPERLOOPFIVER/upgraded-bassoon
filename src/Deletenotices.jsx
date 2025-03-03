import { useEffect, useState } from 'react';
import { db } from './Firebase';
import { collection, onSnapshot, orderBy, query, doc, deleteDoc } from 'firebase/firestore';

const DeleteNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotices(noticesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (noticeId) => {
    try {
      await deleteDoc(doc(db, 'notices', noticeId));
      setNotices((prev) => prev.filter((notice) => notice.id !== noticeId));
      alert('Notice deleted successfully');
    } catch (error) {
      setError('Error deleting notice: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Delete Notices</h2>

      {loading ? (
        <p>Loading notices...</p>
      ) : notices.length === 0 ? (
        <p>No notices available.</p>
      ) : (
        <div>
          {notices.map(({ id, title, content, fileUrl }) => (
            <div key={id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
              <h3>{title}</h3>
              <p>{content}</p>
              {fileUrl && (
                <div>
                  {fileUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                    <img src={fileUrl} alt="Attachment" style={{ width: '100px', height: '100px' }} />
                  ) : (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                      View Attachment
                    </a>
                  )}
                </div>
              )}
              <button onClick={() => handleDelete(id)} style={{ color: 'white', background: 'red', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DeleteNotices;
