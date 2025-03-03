import React, { useEffect, useState } from 'react';
import { auth, db } from '../Firebase'; // Removed Firebase Storage
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, updatePassword } from 'firebase/auth';
import axios from 'axios'; // Using Axios to upload to Cloudinary

import styles from '../Pages/Profile.module.css';
import Sidebar from './navbar/Sidebar';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/');
        return;
      }
      fetchUserData(user.uid);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      let userDoc = await getDoc(doc(db, 'users', userId));
  
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        // Try fetching from 'students' if not found in 'users'
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
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      setError(`Error logging out: ${error.message}`);
    }
  };

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      if (user && newPassword.trim().length >= 6) {
        await updatePassword(user, newPassword);
        alert('Password updated successfully');
      } else {
        alert('Password must be at least 6 characters long');
      }
    } catch (error) {
      alert(`Error changing password: ${error.message}`);
    }
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset
    formData.append('cloud_name', 'dfzmg1jtd'); // Your Cloudinary cloud name

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dfzmg1jtd/image/upload', formData);
      const imageUrl = response.data.secure_url;

      // Update Firestore with the new image URL
      await updateDoc(doc(db, 'users', user.uid), { profileImage: imageUrl });
      setUserData((prevData) => ({ ...prevData, profileImage: imageUrl }));
      alert('Profile image updated successfully!');
    } catch (error) {
      alert(`Error uploading image: ${error.message}`);
    }
  };

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
        <div className={styles.dashboardContainer}>
          <div className={styles.profileHeader}>
            <label htmlFor="profileImageUpload" className={styles.profileImageWrapper}>
              <img
                src={userData.profileImage || 'https://th.bing.com/th/id/OIP._Ddbd2n5ycgaxIPyYMqwZQHaHa?rs=1&pid=ImgDetMain'}
                alt="Profile"
                className={styles.profileImage}
              />
              <input
                type="file"
                id="profileImageUpload"
                accept="image/*"
                onChange={handleProfileImageChange}
                className={styles.fileInput}
              />
            </label>
          </div>

          <h2 className={styles.greeting}>Hi, {userData.name}</h2>
          <div className={styles.userInfo}>
            <p><strong>Father's Name:</strong> {userData.fname}</p>
            <p><strong>Folio:</strong> {userData.folio}</p>
            <p><strong>House:</strong> {userData.house}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
          <hr />

          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
          <div className={styles.passwordChange}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.inputField}
            />
            <button className={styles.changePasswordButton} onClick={handleChangePassword}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
