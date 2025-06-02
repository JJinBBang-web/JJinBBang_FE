// src/pages/review/DormitoryConditionsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { reviewState } from '../../recoil/review/reviewAtoms';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
import styles from '../../styles/review/DormitoryConditions.module.css';
import closeIcon from '../../assets/image/iconClose.svg';

interface LocationState {
  from?: string;
  dormitoryInfo?: {
    dormitoryFee?: number;
    residenceArea?: string;
    semesterGrade?: number;
    hasDistanceCriteria?: boolean;
    hasGradeCriteria?: boolean;
    roomCapacity?: number;
  };
}

const DormitoryConditionsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from, dormitoryInfo } = (location.state as LocationState) || {};
  const [review, setReview] = useRecoilState(reviewState);

  // 조건 상태들
  const [hasDistanceCriteria, setHasDistanceCriteria] = useState<boolean>(
    dormitoryInfo?.hasDistanceCriteria || false
  );
  const [hasGradeCriteria, setHasGradeCriteria] = useState<boolean>(
    dormitoryInfo?.hasGradeCriteria || false
  );

  // 입력 값들
  const [dormitoryFee, setDormitoryFee] = useState<string>(
    dormitoryInfo?.dormitoryFee ? dormitoryInfo.dormitoryFee.toString() : ''
  );
  const [residenceArea, setResidenceArea] = useState<string>(
    dormitoryInfo?.residenceArea || ''
  );
  const [semesterGrade, setSemesterGrade] = useState<string>(
    dormitoryInfo?.semesterGrade ? dormitoryInfo.semesterGrade.toString() : ''
  );
  const [roomCapacity, setRoomCapacity] = useState<string>(
    dormitoryInfo?.roomCapacity ? dormitoryInfo.roomCapacity.toString() : ''
  );

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    // 확인 페이지에서 온 경우 기존 값 설정
    if (from === 'confirm' && review.dormitoryConditions) {
      const {
        hasDistanceCriteria,
        hasGradeCriteria,
        dormitoryFee,
        residenceArea,
        semesterGrade,
        roomCapacity,
      } = review.dormitoryConditions;

      setHasDistanceCriteria(hasDistanceCriteria || false);
      setHasGradeCriteria(hasGradeCriteria || false);
      setDormitoryFee(dormitoryFee ? dormitoryFee.toString() : '');
      setResidenceArea(residenceArea || '');
      setSemesterGrade(semesterGrade ? semesterGrade.toString() : '');
      setRoomCapacity(roomCapacity ? roomCapacity.toString() : '');
    }
  }, [from, review]);

  const handleDormitoryFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 양의 정수만 허용 (0 포함)
    if (value === '' || /^[0-9]\d*$/.test(value)) {
      setDormitoryFee(value);
    }
  };

  const handleSemesterGradeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '' || !isNaN(Number(value))) {
      const numValue = Number(value);
      if (value === '' || (numValue >= 0 && numValue <= 4.5)) {
        setSemesterGrade(value);
      }
    }
  };

  const handleTextInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  // 조건 선택 토글
  const handleConditionToggle = (condition: 'distance' | 'grade') => {
    if (condition === 'distance') {
      setHasDistanceCriteria((prev) => !prev);
      if (!hasDistanceCriteria) {
        setResidenceArea('');
      }
    } else if (condition === 'grade') {
      setHasGradeCriteria((prev) => !prev);
      if (!hasGradeCriteria) {
        setSemesterGrade('');
      }
    }
  };

  const handleNoneCondition = () => {
    setHasDistanceCriteria(false);
    setHasGradeCriteria(false);
    setResidenceArea('');
    setSemesterGrade('');
  };

  const isNextEnabled = () => {
    let isValid = dormitoryFee.trim() !== '';

    if (hasDistanceCriteria) {
      isValid = isValid && residenceArea.trim() !== '';
    }

    if (hasGradeCriteria) {
      isValid = isValid && semesterGrade.trim() !== '';
    }

    return isValid;
  };

  const handleNext = () => {
    const dormitoryConditions = {
      hasDistanceCriteria,
      hasGradeCriteria,
      dormitoryFee: parseFloat(dormitoryFee),
      residenceArea: hasDistanceCriteria ? residenceArea : '',
      semesterGrade: hasGradeCriteria ? parseFloat(semesterGrade) : undefined,
      roomCapacity: roomCapacity ? parseInt(roomCapacity, 10) : undefined,
    };

    const updatedReview = {
      ...review,
      roomCapacity: roomCapacity ? parseInt(roomCapacity, 10) : undefined,
      dormitoryFee: parseFloat(dormitoryFee),
      dormitoryConditions,
    };

    setReview(updatedReview);
    localStorage.setItem('reviewState', JSON.stringify(updatedReview));

    // 항상 DormitoryAmenitiesPage로 이동하도록 수정
    navigate('/review/dormitory-amenities', {
      state: {
        ...location.state,
        dormitoryConditions,
      },
    });
  };

  const handleBack = () => {
    if (from === 'confirm') {
      navigate('/review/confirm');
    } else {
      navigate(-1);
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

        <div className={styles.conditionsContainer}>
          <p className={styles.conditionsTitle}>조건 선택</p>
          <div className={styles.conditionButtons}>
            <button
              className={`${styles.conditionButton} ${
                hasDistanceCriteria ? styles.selected : ''
              }`}
              onClick={() => handleConditionToggle('distance')}
            >
              거리 기준 있음
            </button>
            <button
              className={`${styles.conditionButton} ${
                hasGradeCriteria ? styles.selected : ''
              }`}
              onClick={() => handleConditionToggle('grade')}
            >
              성적 기준 있음
            </button>
            <button
              className={`${styles.conditionButton} ${
                !hasDistanceCriteria && !hasGradeCriteria ? styles.selected : ''
              }`}
              onClick={handleNoneCondition}
            >
              조건 없음
            </button>
          </div>
        </div>

        <div className={styles.inputContainer}>
          {hasDistanceCriteria && (
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>거주 지역</label>
              <input
                type="text"
                className={styles.input}
                value={residenceArea}
                onChange={(e) => handleTextInputChange(e, setResidenceArea)}
                placeholder="ex) 찐빵광역시"
              />
            </div>
          )}

          {hasGradeCriteria && (
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>학기 성적</label>
              <div className={styles.inputWrapper}>
                <input
                  className={styles.input}
                  value={semesterGrade}
                  onChange={handleSemesterGradeChange}
                  placeholder="4.5"
                  min="0"
                  max="4.5"
                />
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>기숙사비</label>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                value={dormitoryFee}
                onChange={handleDormitoryFeeChange}
                placeholder="0"
                min="0"
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
