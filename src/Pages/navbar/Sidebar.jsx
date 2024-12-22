import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserAlt, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import styles from './Sidebar.module.css'; // Importing CSS for the Sidebar

const Bar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar component fixed at the bottom */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.toggleButton} onClick={toggleSidebar}>
          <div className={styles.toggleIcon}></div>
        </div>
        <div className={styles.menuItems}>
          <Link to="/" className={styles.menuItem}>
            <FaHome className={styles.icon} />
            <span className={styles.text}>Home</span>
          </Link>
          <Link to="/profile" className={styles.menuItem}>
            <FaUserAlt className={styles.icon} />
            <span className={styles.text}>Profile</span>
          </Link>
          <Link to="/Not" className={styles.menuItem}>
            <FaFileAlt className={styles.icon} />
            <span className={styles.text}>Notices</span>
          </Link>
          <Link to="/" className={styles.menuItem}>
            <FaSignOutAlt className={styles.icon} />
            <span className={styles.text}>Logout</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Bar;
