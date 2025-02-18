// src/pages/MyPage.tsx
import React from 'react';
import styles from '../styles/MyPage.module.css';
import questionIcon from '../assets/image/questionIcon.svg';
import arrowIcon from '../assets/image/arrowIcon.svg';
import characterIcon from '../assets/image/characterIcon.svg';

const MyPage: React.FC = () => {
  return (
    <div className="content">
      <h1 className={styles.title}>나의 찐빵</h1>

      <div className={styles.infoContainer}>
        <div className={styles.banner}>
          <img src={questionIcon} alt="question" />
          <p>학교 인증을 통해 모든 기능을 무료로 즐겨보세요!</p>
        </div>

        <button className={styles.loginButton}>
          <div className={styles.buttonContent}>
            <img
              src={characterIcon}
              alt="character"
              className={styles.character}
            />
            <span>로그인을 해주세요</span>
            <img src={arrowIcon} alt="arrow" className={styles.arrow} />
          </div>
        </button>
      </div>

      <div className={styles.emptyStateContainer}>
        <img
          src={characterIcon}
          alt="empty state"
          className={styles.emptyCharacter}
        />
        <p>앗! 아직 등록된 찐빵이 없어요!</p>
      </div>
    </div>
  );
};

export default MyPage;
