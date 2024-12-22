import { useState } from 'react';
import { auth, db } from '../../../Firebase';  // Import auth and db from Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css'; // Import the CSS module

const Signup = () => {
  const [name, setName] = useState('');
  const [fname, setFname] = useState('');
  const [folio, setFolio] = useState('');
  const [house, setHouse] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create student data to be added to Firestore
      const studentData = {
        name,
        fname,
        folio,
        house,
        email,
        role: 'student',  // Role for this user is student
      };

      // Add student data to Firestore (in users collection)
      await setDoc(doc(db, 'users', user.uid), studentData);  // Store the student data in Firestore using user.uid as document ID

      alert('Student added successfully');
      navigate('/dashboard');  // Redirect to the Dashboard after adding the student
    } catch (error) {
      setError(`Error adding student: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2>Add a New Student</h2>
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Name</label>
          <input
            type="text"
            id="name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="fname" className={styles.label}>Father's Name</label>
          <input
            type="text"
            id="fname"
            className={styles.input}
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="folio" className={styles.label}>Folio</label>
          <input
            type="text"
            id="folio"
            className={styles.input}
            value={folio}
            onChange={(e) => setFolio(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="house" className={styles.label}>House</label>
          <input
            type="text"
            id="house"
            className={styles.input}
            value={house}
            onChange={(e) => setHouse(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.button}>Add Student</button>
      </form>
    </div>
  );
};

export default Signup;
