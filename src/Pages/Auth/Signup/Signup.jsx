import { useState } from 'react';
import { auth, db } from '../../../Firebase';  // Import auth and db from Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import styles from './Signup.module.css'; // Updated CSS module name

const CreateStudent = () => {
  const [name, setName] = useState('');
  const [fname, setFname] = useState('');
  const [folio, setFolio] = useState('');
  const [house, setHouse] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentsPhone, setParentsPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create student account in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store student details in Firestore
      const studentData = {
        name,
        fname,
        folio,
        house,
        email,
        parentsPhone, // Added parent's phone number field
        role: 'student',
      };

      await setDoc(doc(db, 'students', user.uid), studentData);

      alert('Student account created successfully');
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2>Create Student Account</h2>
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
          <label htmlFor="parentsPhone" className={styles.label}>Parents' Phone No.</label>
          <input
            type="tel"
            id="parentsPhone"
            className={styles.input}
            value={parentsPhone}
            onChange={(e) => setParentsPhone(e.target.value)}
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

        <button type="submit" className={styles.button}>Create Student</button>
      </form>
    </div>
  );
};

export default CreateStudent;
