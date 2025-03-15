import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { reviewState } from '../../recoil/review/reviewAtoms';
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
  paymentType: string;
  from?: string;
}

const JeonseInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from, address, buildingName, floor, paymentType } =
    (location.state as LocationState) || {};
  const [review, setReview] = useRecoilState(reviewState);

  const [deposit, setDeposit] = useState<string>(
    review.deposit ? review.deposit.toString() : ''
  );
  const [managementFee, setManagementFee] = useState<string>(
    review.managementFee ? review.managementFee.toString() : ''
  );

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    // 수정 모드일 경우 기존 상태 복원
    if (from === 'confirm') {
      setDeposit(review.deposit ? review.deposit.toString() : '');
      setManagementFee(
        review.managementFee ? review.managementFee.toString() : ''
      );
    }
  }, [from, review]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(value);
  };

  const formatNumber = (value: string) => {
    if (!value) return '';
    return Number(value).toLocaleString();
  };

  const handleNext = () => {
    const updatedReview = {
      ...review,
      contractType: paymentType,
      deposit: Number(deposit),
      monthlyRent: null,
      managementFee: Number(managementFee) || null,
    };

    setReview(updatedReview);
    localStorage.setItem('reviewState', JSON.stringify(updatedReview));

    const priceData = {
      deposit: Number(deposit),
      managementFee: Number(managementFee) || null,
    };

    if (from === 'confirm') {
      navigate('/review/confirm', {
        state: {
          ...location.state,
          priceData,
        },
      });
    } else {
      navigate('/review/room-info', {
        state: {
          ...location.state,
          priceData,
        },
      });
    }
  };

  const handleBack = () => {
    if (from === 'confirm') {
      navigate('/review/confirm');
    } else {
      navigate(-1);
    }
  };

  const isNextEnabled = deposit !== '' && managementFee !== '';

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
          <h1>전세 계약 조건은 어떻게 되나요?</h1>
        </header>
        <div className={styles.inputGroup}>
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
        <button className={styles.prevButton} onClick={handleBack}>
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

export default JeonseInputPage;
