// src/pages/review/PriceInputPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/review/PriceInput.module.css';

interface PriceInfo {
  deposit: string;
  monthlyRent: string;
  maintenanceFee: string;
}

const PriceInputPage: React.FC = () => {
  const navigate = useNavigate();
  const [priceInfo, setPriceInfo] = useState<PriceInfo>({
    deposit: '',
    monthlyRent: '',
    maintenanceFee: '',
  });

  const formatNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleInputChange = (field: keyof PriceInfo, value: string) => {
    setPriceInfo({
      ...priceInfo,
      [field]: formatNumber(value),
    });
  };

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <img src="/assets/image/closeIcon.svg" alt="close" />
          </button>
          <h1>월세 계약 조건은 어떻게 되나요?</h1>
        </header>

        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <label>보증금</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={priceInfo.deposit}
                onChange={(e) => handleInputChange('deposit', e.target.value)}
                placeholder="0"
              />
              <span className={styles.unit}>만원</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>월세</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={priceInfo.monthlyRent}
                onChange={(e) =>
                  handleInputChange('monthlyRent', e.target.value)
                }
                placeholder="0"
              />
              <span className={styles.unit}>만원</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>관리비</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={priceInfo.maintenanceFee}
                onChange={(e) =>
                  handleInputChange('maintenanceFee', e.target.value)
                }
                placeholder="0"
              />
              <span className={styles.unit}>만원</span>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.previousButton}
            onClick={() => navigate(-1)}
          >
            이전
          </button>
          <button
            className={styles.nextButton}
            // 여기서 다음 페이지로 이동하거나 리뷰 정보 제출
            onClick={() => navigate('/review/complete')}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceInputPage;
