import { useState } from 'react';
import { db } from '../../Firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import styles from '../Notice/AddNotice.module.css';

const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset';
const CLOUDINARY_CLOUD_NAME = 'dfzmg1jtd';

const AddNotice = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "ml_default");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      return data.secure_url; // Returns uploaded file URL
    } catch (error) {
      throw new Error('File upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let fileUrl = null;

      if (file) {
        fileUrl = await uploadToCloudinary(file);
      }

      await addDoc(collection(db, 'notices'), {
        title,
        content,
        fileUrl, // Stores file URL if uploaded
        timestamp: serverTimestamp(),
        author: 'Housemaster', // Change as needed
      });

      setTitle('');
      setContent('');
      setFile(null);
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

        <div className={styles.inputGroup}>
          <label htmlFor="file">Upload File (Optional)</label>
          <input type="file" id="file" onChange={handleFileChange} />
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
