import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserAlt, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import styles from './Sidebar.module.css'; // Importing CSS for the Sidebar
import { GoHome, GoBell} from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { PiHamburger } from "react-icons/pi";
import { FiMessageCircle } from "react-icons/fi";
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
            <GoHome className={styles.icon} />
          
          </Link>
          <Link to="/profile" className={styles.menuItem}>
            <CgProfile className={styles.icon} />
          
          </Link>
          <Link to="/Not" className={styles.menuItem}>
            <GoBell className={styles.icon} />
          
          </Link>
          <Link to="/home" className={styles.menuItem}>
            <FiMessageCircle className={styles.icon} />
            
          </Link>
        </div>
      </div>
    </>
  );
};

export default Bar;
