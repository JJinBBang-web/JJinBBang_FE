// src/pages/review/AddressInputPage.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
import styles from '../../styles/review/AddressInput.module.css';
import closeIcon from '../../assets/image/iconClose.svg';
import searchIcon from '../../assets/image/iconSearch.svg';

const AddressInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  const handleSearchClick = () => {
    navigate('/review/address', { state: location.state });
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
            onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
          <h1 className={styles.title}>주소를 입력해 주세요!</h1>
        </header>
        <p className={styles.description}>
          검색 결과에서 동, 호수까지 확인해주세요
        </p>
        <div className={styles.searchBox} onClick={handleSearchClick}>
          <span className={styles.placeholder}>예) 찐빵로 47, 찐빵동 122</span>
          <img src={searchIcon} alt="search" className={styles.searchIcon} />
        </div>
      </div>
      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={() => navigate(-1)}>
          이전
        </button>
        <button className={styles.nextButton} disabled={true}>
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

export default AddressInputPage;
