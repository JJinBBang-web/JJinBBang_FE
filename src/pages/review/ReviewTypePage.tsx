// src/pages/review/ReviewTypePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/review/ReviewType.module.css';
import backArrowIcon from '../../assets/image/backArrowIcon.svg';

const ReviewTypePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <img src={backArrowIcon} alt="back" />
          </button>
          <h1>찐빵 유형을 선택해 볼까요?</h1>
        </header>

        <div className={styles.buttonGroup}>
          <button
            className={styles.typeButton}
            onClick={() => navigate('/review/address')}
          >
            원/투룸
          </button>
          <button
            className={styles.typeButton}
            onClick={() => navigate('/review/address')}
          >
            아파트
          </button>
          <button
            className={styles.typeButton}
            onClick={() => navigate('/review/address')}
          >
            주택/빌라
          </button>
          <button
            className={styles.typeButton}
            onClick={() => navigate('/review/address')}
          >
            오피스텔
          </button>
          <button
            className={styles.typeButton}
            onClick={() => navigate('/review/address')}
          >
            기숙사
          </button>
          <button
            className={styles.typeButton}
            onClick={() => navigate('/review/address')}
          >
            하숙집/고시원
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewTypePage;
