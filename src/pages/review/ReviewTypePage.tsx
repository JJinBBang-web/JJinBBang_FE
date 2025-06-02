import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { reviewState } from '../../recoil/review/reviewAtoms';
import styles from '../../styles/review/ReviewType.module.css';
import backArrowIcon from '../../assets/image/backArrowIcon.svg';

const ReviewTypePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};
  const [review, setReview] = useRecoilState(reviewState);
  const [selectedType, setSelectedType] = useState<string | null>(
    review.housingType || null
  );

  useEffect(() => {
    // 수정 모드일 경우 기존 상태 복원
    if (locationState.from === 'confirm' && review.housingType) {
      setSelectedType(review.housingType);
    }
  }, [locationState, review]);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType) {
      // Recoil 상태 업데이트
      setReview((prev) => ({
        ...prev,
        housingType: selectedType,
      }));

      // 로컬 스토리지에 저장
      localStorage.setItem(
        'reviewState',
        JSON.stringify({
          ...review,
          housingType: selectedType,
        })
      );

      // 수정 모드인지 확인
      if (locationState.from === 'confirm') {
        // 수정 모드일 경우 확인 페이지로 돌아가기
        navigate('/review/confirm', {
          state: {
            ...locationState,
            housingType: selectedType,
          },
        });
      } else {
        // 모든 타입에 대해 주소 입력 페이지로 이동 (기숙사 포함)
        navigate('/review/input-address', {
          state: {
            ...locationState,
            housingType: selectedType,
          },
        });
      }
    }
  };

  const handleBack = () => {
    // 수정 모드일 경우
    if (locationState.from === 'confirm') {
      navigate('/review/confirm');
    } else {
      // 일반 모드일 경우 MyPage로 이동
      navigate('/mypage');
    }
  };

  return (
    <div className="content" style={{ backgroundColor: 'var(--white)' }}>
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={backArrowIcon} alt="back" />
          </button>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <h1>찐빵 유형을 선택해 볼까요?</h1>
        </header>
        <div className={styles.buttonGroup}>
          {[
            '원/투룸',
            '아파트',
            '주택/빌라',
            '오피스텔',
            '기숙사',
            '하숙집/고시원',
          ].map((type) => (
            <button
              key={type}
              className={`${styles.typeButton} ${
                selectedType === type ? styles.selected : ''
              }`}
              onClick={() => handleTypeSelect(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 유형 선택 여부에 따라 버튼 레이아웃 변경 */}
        {selectedType ? (
          // 유형이 선택되면 [이전]과 [다음] 버튼을 함께 표시
          <div className={styles.buttonContainer}>
            <button className={styles.prevButton} onClick={handleBack}>
              이전
            </button>
            <button
              className={`${styles.nextButton} ${styles.enabled}`}
              onClick={handleNext}
            >
              다음
            </button>
          </div>
        ) : (
          // 유형이 선택되지 않으면 [다음] 버튼만 표시 (비활성화 상태)
          <button
            className={styles.nextButton}
            onClick={handleNext}
            disabled={!selectedType}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewTypePage;
