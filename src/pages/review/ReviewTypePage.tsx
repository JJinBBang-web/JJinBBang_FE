// src/pages/review/ReviewTypePage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/review/ReviewType.module.css';
import backArrowIcon from '../../assets/image/backArrowIcon.svg';

const ReviewTypePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType) {
      navigate('/review/address', {
        state: {
          ...locationState,
          buildingType: selectedType,
        },
      });
    }
  };

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <img src={backArrowIcon} alt="back" />
          </button>
          <h1>찐빵 유형을 선택해 볼까요?</h1>
        </header>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.typeButton} ${
              selectedType === '원/투룸' ? styles.selected : ''
            }`}
            onClick={() => handleTypeSelect('원/투룸')}
          >
            원/투룸
          </button>
          <button
            className={`${styles.typeButton} ${
              selectedType === '아파트' ? styles.selected : ''
            }`}
            onClick={() => handleTypeSelect('아파트')}
          >
            아파트
          </button>
          <button
            className={`${styles.typeButton} ${
              selectedType === '주택/빌라' ? styles.selected : ''
            }`}
            onClick={() => handleTypeSelect('주택/빌라')}
          >
            주택/빌라
          </button>
          <button
            className={`${styles.typeButton} ${
              selectedType === '오피스텔' ? styles.selected : ''
            }`}
            onClick={() => handleTypeSelect('오피스텔')}
          >
            오피스텔
          </button>
          <button
            className={`${styles.typeButton} ${
              selectedType === '기숙사' ? styles.selected : ''
            }`}
            onClick={() => handleTypeSelect('기숙사')}
          >
            기숙사
          </button>
          <button
            className={`${styles.typeButton} ${
              selectedType === '하숙집/고시원' ? styles.selected : ''
            }`}
            onClick={() => handleTypeSelect('하숙집/고시원')}
          >
            하숙집/고시원
          </button>
        </div>
      </div>
      <footer className={styles.footer}>
        <button
          className={`${styles.nextButton} ${
            selectedType ? styles.enabled : ''
          }`}
          onClick={handleNext}
          disabled={!selectedType}
        >
          다음
        </button>
      </footer>
    </div>
  );
};

export default ReviewTypePage;
