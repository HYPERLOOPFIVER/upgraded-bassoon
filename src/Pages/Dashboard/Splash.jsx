import React from 'react';
import styles from './SplashScreen.module.css'; // Import CSS Module for styling
import Sp from './../../assets/R.png'
const SplashScreen = () => {
  return (
    <div className={styles.splashContainer}>
      <div className={styles.splashLogo}>
        {/* Add your logo or animation */}
        <img src={Sp} alt="Logo" className={styles.logo} />
        <h2 className={styles.appname}>BIRLA VIDYA</h2>
        <h2 className={styles.appname}>MANDIR</h2>
     
      </div>
      <div className={styles.loadingBarContainer}>
      <div className={styles.loadingBar}></div>
      </div>
    </div>
  );
};

export default SplashScreen;
