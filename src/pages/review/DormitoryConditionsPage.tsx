// src/pages/review/DormitoryConditionsPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { reviewState } from '../../recoil/review/reviewAtoms';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
import { useReviewAutoSave } from '../../hooks/useReviewAutoSave';
import { reviewAutoSave, REVIEW_STEPS } from '../../util/reviewAutoSave';
import styles from '../../styles/review/DormitoryConditions.module.css';
import closeIcon from '../../assets/image/iconClose.svg';
import useReviewStepTracking from '../../hooks/useReviewStepTracking';

interface LocationState {
  from?: string;
  dormitoryInfo?: {
    dormitoryFee?: number;
    residenceArea?: string;
    semesterGrade?: number;
    hasDistanceCriteria?: boolean;
    hasGradeCriteria?: boolean;
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

  useReviewStepTracking('3-2.2_dormitory_conditions');

  // 자동 저장 기능 추가
  useReviewAutoSave('dormitory-conditions');

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // 페이지 진입 시 currentStep만 업데이트 (reviewState 덮어쓰기 방지)
  useEffect(() => {
    reviewAutoSave.updateCurrentStepOnNext(REVIEW_STEPS.DORMITORY_CONDITIONS);
  }, []);

  // 초기 마운트 여부 추적
  const isInitialMount = useRef(true);

  useEffect(() => {
    // 확인 페이지 또는 자동저장에서 복원 시 기존 값 설정
    if ((from === 'confirm' || from === 'autosave') && review.dormitoryConditions) {
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
    }
  }, [from, review]);

  // 입력값 변경 시 review 상태 업데이트 (자동저장 트리거)
  useEffect(() => {
    // 초기 마운트 시에는 스킵 (자동저장 데이터 덮어쓰기 방지)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setReview((prev) => {
      const prevDorm = prev.dormitoryConditions ?? {
        hasDistanceCriteria: false,
        hasGradeCriteria: false,
        dormitoryFee: 0,
      };

      const nextDorm = {
        ...prevDorm,
        hasDistanceCriteria,
        hasGradeCriteria,
        dormitoryFee: dormitoryFee ? parseFloat(dormitoryFee) : 0,
        residenceArea: hasDistanceCriteria ? residenceArea : '',
        semesterGrade: hasGradeCriteria && semesterGrade ? parseFloat(semesterGrade) : undefined,
      };

      return {
        ...prev,
        dormitoryFee: dormitoryFee ? parseFloat(dormitoryFee) : 0,
        dormitoryConditions: nextDorm,
      };
    });
  }, [dormitoryFee, residenceArea, semesterGrade, hasDistanceCriteria, hasGradeCriteria, setReview]);

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

  const handleNext = async () => {
    setReview((prev) => {
      const prevDorm = prev.dormitoryConditions ?? {
        hasDistanceCriteria: false,
        hasGradeCriteria: false,
        dormitoryFee: 0,
      };

      const nextDorm = {
        ...prevDorm,
        hasDistanceCriteria,
        hasGradeCriteria,
        dormitoryFee: parseFloat(dormitoryFee),
        residenceArea: hasDistanceCriteria ? residenceArea : "",
        semesterGrade: hasGradeCriteria ? parseFloat(semesterGrade) : undefined,
      };
      return {
        ...prev,
        dormitoryFee: parseFloat(dormitoryFee),
        dormitoryConditions: nextDorm,
      };
    });

    const dormitoryConditions = {
      ...(review.dormitoryConditions ?? {}),
      hasDistanceCriteria,
      hasGradeCriteria,
      dormitoryFee: parseFloat(dormitoryFee),
      residenceArea: hasDistanceCriteria ? residenceArea : "",
      semesterGrade: hasGradeCriteria ? parseFloat(semesterGrade) : undefined,
    };

    // 다음 페이지로 이동 전 자동 저장 (다음 step으로)
    const updatedReviewForSave = {
      ...review,
      dormitoryFee: parseFloat(dormitoryFee),
      dormitoryConditions,
    };
    await reviewAutoSave.save({
      reviewState: updatedReviewForSave,
      dormitoryReviewState: null,
      currentStep: REVIEW_STEPS.DORMITORY_AMENITIES,
      uuid: reviewAutoSave.load()?.uuid,
    });

    if (from === 'confirm') {
      navigate('/review/confirm', {
        state: {
          ...location.state,
          dormitoryConditions,
        },
      });
    } else {
      // 기본 플로우: DormitoryAmenitiesPage로 이동
      navigate('/review/dormitory-amenities', {
        state: {
          ...location.state,
          dormitoryConditions,
        },
      });
    }
  };

  const handleBack = () => {
    if (from === 'confirm') {
      navigate('/review/confirm');
    } else {
      // 기숙사 플로우: 이전 페이지는 dormitory (인원/층수 입력)
      navigate('/review/dormitory', {
        state: {
          ...location.state,
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
