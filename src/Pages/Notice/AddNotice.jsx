import { useState } from 'react';
import { db } from '../../Firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import styles from '../Notice/AddNotice.module.css';

const AddNotice = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, 'notices'), {
        title,
        content,
        timestamp: serverTimestamp(),
        author: 'Housemaster', // Or fetch the housemaster's name dynamically
      });
      setTitle('');
      setContent('');
      alert('Notice added successfully');
    } catch (error) {
      setError('Error adding notice: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add Notice</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Notice...' : 'Add Notice'}
        </button>
      </form>
    </div>
  );
};

export default AddNotice;
