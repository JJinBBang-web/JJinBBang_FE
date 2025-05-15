// src/pages/review/DormitoryConditionsPage.tsx - Fixed version with proper typing
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { reviewState, ReviewState } from '../../recoil/review/reviewAtoms';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
import styles from '../../styles/review/DormitoryConditions.module.css';
import closeIcon from '../../assets/image/iconClose.svg';

interface LocationState {
  dormitoryData?: {
    university: string;
    dormitoryName: string;
    roomCapacity: number;
    floorType: string;
    dormitoryFee: number;
  };
  from?: string;
}

const DormitoryConditionsPage: React.FC = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state as LocationState | undefined;
  const { dormitoryData, from } = locationState || {};

  const [review, setReview] = useRecoilState<ReviewState>(reviewState);

  // Form state
  const [selectedCondition, setSelectedCondition] = useState<string>(
    review.dormitoryCondition || '거리 기준 있음'
  );
  const [locationValue, setLocationValue] = useState<string>(
    review.dormitoryLocation || ''
  );
  const [gpa, setGpa] = useState<string>(review.dormitoryGpa || '');
  const [fee, setFee] = useState<string>(
    review.dormitoryFee ? review.dormitoryFee.toString() : ''
  );

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    if (from === 'confirm') {
      setSelectedCondition(review.dormitoryCondition || '거리 기준 있음');
      setLocationValue(review.dormitoryLocation || '');
      setGpa(review.dormitoryGpa || '');
      setFee(review.dormitoryFee ? review.dormitoryFee.toString() : '');
    }
  }, [from, review]);

  const handleConditionSelect = (condition: string) => {
    setSelectedCondition(condition);

    // Clear related fields based on condition
    if (condition === '조건 없음') {
      setLocationValue('');
      setGpa('');
    } else if (condition === '거리 기준 있음') {
      setGpa('');
    } else if (condition === '성적 기준 있음') {
      setLocationValue('');
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationValue(e.target.value);
  };

  const handleGpaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');

    if (parts.length > 1) {
      const formattedValue = `${parts[0]}.${parts[1].substring(0, 1)}`;
      setGpa(formattedValue);
    } else {
      setGpa(value);
    }
  };

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFee(value);
  };

  const handleNext = () => {
    if (selectedCondition === '거리 기준 있음' && !locationValue) {
      alert('거주 지역을 입력해주세요.');
      return;
    }

    if (selectedCondition === '성적 기준 있음' && !gpa) {
      alert('학기 성적을 입력해주세요.');
      return;
    }

    if (!fee) {
      alert('기숙사비를 입력해주세요.');
      return;
    }

    const updatedReview: ReviewState = {
      ...review,
      dormitoryCondition: selectedCondition,
      dormitoryLocation: locationValue,
      dormitoryGpa: gpa,
      dormitoryFee: parseInt(fee, 10),
    };

    setReview(updatedReview);
    localStorage.setItem('reviewState', JSON.stringify(updatedReview));

    if (from === 'confirm') {
      navigate('/review/confirm', {
        state: {
          ...locationState,
          dormitoryConditions: {
            condition: selectedCondition,
            location: locationValue,
            gpa: gpa,
            fee: parseInt(fee, 10),
          },
        },
      });
    } else {
      navigate('/review/room-info', {
        state: {
          ...locationState,
          dormitoryConditions: {
            condition: selectedCondition,
            location: locationValue,
            gpa: gpa,
            fee: parseInt(fee, 10),
          },
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

  const isNextEnabled = () => {
    if (selectedCondition === '거리 기준 있음') {
      return locationValue.trim() !== '' && fee.trim() !== '';
    } else if (selectedCondition === '성적 기준 있음') {
      return gpa.trim() !== '' && fee.trim() !== '';
    } else {
      return fee.trim() !== '';
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
            onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
          <h1>좋아요! 기숙사 입주 조건은 어떻게 되나요?</h1>
        </header>

        <div className={styles.formSection}>
          <label className={styles.sectionLabel}>조건 선택</label>
          <div className={styles.conditionButtons}>
            <button
              className={`${styles.conditionButton} ${
                selectedCondition === '거리 기준 있음' ? styles.selected : ''
              }`}
              onClick={() => handleConditionSelect('거리 기준 있음')}
            >
              거리 기준 있음
            </button>
            <button
              className={`${styles.conditionButton} ${
                selectedCondition === '성적 기준 있음' ? styles.selected : ''
              }`}
              onClick={() => handleConditionSelect('성적 기준 있음')}
            >
              성적 기준 있음
            </button>
            <button
              className={`${styles.conditionButton} ${
                selectedCondition === '조건 없음' ? styles.selected : ''
              }`}
              onClick={() => handleConditionSelect('조건 없음')}
            >
              조건 없음
            </button>
          </div>
        </div>

        {selectedCondition === '거리 기준 있음' && (
          <div className={styles.formSection}>
            <label className={styles.sectionLabel}>거주 지역</label>
            <input
              type="text"
              className={styles.inputField}
              value={locationValue}
              onChange={handleLocationChange}
              placeholder="예) 찐빵광역시"
            />
          </div>
        )}

        {selectedCondition === '성적 기준 있음' && (
          <div className={styles.formSection}>
            <label className={styles.sectionLabel}>학기 성적</label>
            <input
              type="text"
              className={styles.inputField}
              value={gpa}
              onChange={handleGpaChange}
              placeholder="예) 3.5"
            />
          </div>
        )}

        <div className={styles.formSection}>
          <label className={styles.sectionLabel}>기숙사비</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.inputField}
              value={fee}
              onChange={handleFeeChange}
              placeholder="0"
            />
            <span className={styles.unit}>만원</span>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={handleBack}>
          이전
        </button>
        <button
          className={`${styles.nextButton} ${
            isNextEnabled() ? styles.enabled : ''
          }`}
          onClick={handleNext}
          disabled={!isNextEnabled()}
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

export default DormitoryConditionsPage;
