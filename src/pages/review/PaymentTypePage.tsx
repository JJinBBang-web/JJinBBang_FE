// src/pages/review/PaymentTypePage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/review/PaymentType.module.css';
import closeIcon from '../../assets/image/iconClose.svg';

interface LocationState {
  address: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  buildingName: string;
  floor: string;
}

const PaymentTypePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType) {
      if (selectedType === '전세') {
        navigate('/review/jeonse', {
          state: {
            ...locationState,
            paymentType: selectedType,
          },
        });
      } else {
        navigate('/review/wolse', {
          state: {
            ...locationState,
            paymentType: selectedType,
          },
        });
      }
    }
  };

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => navigate('/mypage')}
          >
            <img src={closeIcon} alt="close" />
          </button>
        </header>

        <h1 className={styles.title}>좋아요! 계약 형태를 선택해 주세요</h1>

        <div className={styles.optionContainer}>
          <button
            className={`${styles.optionButton} ${
              selectedType === '전세' ? styles.selected : ''
            }`}
            onClick={() => handleTypeSelect('전세')}
          >
            전세
          </button>

          <button
            className={`${styles.optionButton} ${
              selectedType === '월세' ? styles.selected : ''
            }`}
            onClick={() => handleTypeSelect('월세')}
          >
            월세
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={() => navigate(-1)}>
          이전
        </button>
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

export default PaymentTypePage;
