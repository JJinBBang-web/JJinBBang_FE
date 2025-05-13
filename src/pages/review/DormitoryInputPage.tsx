// src/pages/review/DormitoryInputPage.tsx
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
  from?: string;
}

const DormitoryInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, from } = (location.state as LocationState) || {};
  const [review, setReview] = useRecoilState(reviewState);

  const [dormitoryFee, setDormitoryFee] = useState<string>(
    review.dormitoryFee ? review.dormitoryFee.toString() : ''
  );
  const [roomCapacity, setRoomCapacity] = useState<string>(
    review.roomCapacity ? review.roomCapacity.toString() : ''
  );

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    if (from === 'confirm') {
      setDormitoryFee(
        review.dormitoryFee ? review.dormitoryFee.toString() : ''
      );
      setRoomCapacity(
        review.roomCapacity ? review.roomCapacity.toString() : ''
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
      dormitoryFee: Number(dormitoryFee),
      roomCapacity: Number(roomCapacity),
    };

    setReview(updatedReview);
    localStorage.setItem('reviewState', JSON.stringify(updatedReview));

    const dormitoryData = {
      dormitoryFee: Number(dormitoryFee),
      roomCapacity: Number(roomCapacity),
    };

    if (from === 'confirm') {
      navigate('/review/confirm', {
        state: {
          ...location.state,
          dormitoryData,
        },
      });
    } else {
      navigate('/review/room-info', {
        state: {
          ...location.state,
          dormitoryData,
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

  const isNextEnabled = dormitoryFee !== '' && roomCapacity !== '';

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
          <h1>기숙사명 및 상세정보가 있으면 좋겠어요!</h1>
        </header>

        <div className={styles.inputGroup}>
          <div className={styles.inputContainer}>
            <label className={styles.label}>기숙사비</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                value={formatNumber(dormitoryFee)}
                onChange={(e) => handleInputChange(e, setDormitoryFee)}
                placeholder="0"
              />
              <span className={styles.unit}>만원</span>
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label}>인원 수</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                value={roomCapacity}
                onChange={(e) => handleInputChange(e, setRoomCapacity)}
                placeholder="0"
              />
              <span className={styles.unit}>명</span>
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

export default DormitoryInputPage;
