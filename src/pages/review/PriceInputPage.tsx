// src/pages/review/PriceInputPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
import styles from '../../styles/review/PriceInput.module.css';
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

const PriceInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  const [activeTab, setActiveTab] = useState<'전세' | '월세'>('전세');
  const [deposit, setDeposit] = useState<string>('');
  const [monthlyRent, setMonthlyRent] = useState<string>('');
  const [managementFee, setManagementFee] = useState<string>('');

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  const handleTabChange = (tab: '전세' | '월세') => {
    setActiveTab(tab);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    // 입력값에서 숫자만 추출
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(value);
  };

  const formatNumber = (value: string) => {
    if (!value) return '';
    return Number(value).toLocaleString();
  };

  const handleNext = () => {
    const priceData = {
      contractType: activeTab,
      deposit: Number(deposit),
      monthlyRent: activeTab === '월세' ? Number(monthlyRent) : 0,
      managementFee: Number(managementFee),
    };

    navigate('/review/room-info', {
      state: {
        ...locationState,
        priceData,
      },
    });
  };

  const isNextEnabled =
    deposit !== '' && (activeTab === '전세' || monthlyRent !== '');

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
        </header>

        <h1 className={styles.title}>
          {activeTab === '전세'
            ? '전세 계약 조건은 어떻게 되나요?'
            : '월세 계약 조건은 어떻게 되나요?'}
        </h1>

        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${
              activeTab === '전세' ? styles.active : ''
            }`}
            onClick={() => handleTabChange('전세')}
          >
            전세
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === '월세' ? styles.active : ''
            }`}
            onClick={() => handleTabChange('월세')}
          >
            월세
          </button>
        </div>

        <div className={styles.inputGroup}>
          {activeTab === '전세' ? (
            <>
              <div className={styles.inputContainer}>
                <label className={styles.label}>전세</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formatNumber(deposit)}
                    onChange={(e) => handleInputChange(e, setDeposit)}
                    placeholder="0"
                  />
                  <span className={styles.unit}>만원</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.inputContainer}>
                <label className={styles.label}>보증금</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formatNumber(deposit)}
                    onChange={(e) => handleInputChange(e, setDeposit)}
                    placeholder="0"
                  />
                  <span className={styles.unit}>만원</span>
                </div>
              </div>

              <div className={styles.inputContainer}>
                <label className={styles.label}>월세</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formatNumber(monthlyRent)}
                    onChange={(e) => handleInputChange(e, setMonthlyRent)}
                    placeholder="0"
                  />
                  <span className={styles.unit}>만원</span>
                </div>
              </div>
            </>
          )}

          <div className={styles.inputContainer}>
            <label className={styles.label}>관리비</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                value={formatNumber(managementFee)}
                onChange={(e) => handleInputChange(e, setManagementFee)}
                placeholder="0"
              />
              <span className={styles.unit}>만원</span>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={() => navigate(-1)}>
          이전
        </button>
        <button
          className={`${styles.nextButton} ${
            isNextEnabled ? styles.enabled : ''
          }`}
          onClick={handleNext}
          disabled={!isNextEnabled}
        >
          다음
        </button>
      </footer>

      {showCancelModal && (
        <CancelModal
          onClose={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
};

export default PriceInputPage;
