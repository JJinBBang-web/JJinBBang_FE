import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { reviewState } from '../../recoil/review/reviewAtoms';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
import { useReviewAutoSave } from '../../hooks/useReviewAutoSave';
import { reviewAutoSave, REVIEW_STEPS } from '../../util/reviewAutoSave';
import styles from '../../styles/review/FloorInput.module.css';
import closeIcon from '../../assets/image/iconClose.svg';

interface LocationState {
  address: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  from?: string;
}

const FloorInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [review, setReview] = useRecoilState(reviewState);
  const { address, from } = (location.state as LocationState) || {};

  const [buildingName, setBuildingName] = useState(
    review.detailedAddress || address?.buildingName || ''
  );
  const [squareFootage, setSquareFootage] = useState(
    review.space ? review.space.toString() : ''
  );
  const [selectedFloor, setSelectedFloor] = useState<string | null>(
    review.floorType.includes('층') ? review.floorType : null
  );
  const floors = ['반지하', '저층', '중층', '고층', '옥탑'];

  // buildingName 변경 시 실시간 업데이트
  const handleBuildingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBuildingName(value);
    setReview((prev) => ({
      ...prev,
      detailedAddress: value,
    }));
  };

  // floor 선택 시 실시간 업데이트
  const handleFloorSelect = (floor: string) => {
    setSelectedFloor(floor);
    setReview((prev) => ({
      ...prev,
      floorType: floor,
    }));
  };

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // 자동 저장 기능 추가
  useReviewAutoSave('floor');

  useEffect(() => {
    // 수정 모드일 경우 기존 상태 복원
    if (from === 'confirm') {
      setBuildingName(review.detailedAddress || '');
      setSelectedFloor(
        review.floorType.includes('층') ? review.floorType : null
      );
      setSquareFootage(review.space ? review.space.toString() : '');
    }
  }, [from, review]);

  const handleSquareFootageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // 빈 값이거나 숫자와 소수점만 포함하는 경우에만 허용
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSquareFootage(value);
      // 실시간으로 review state 업데이트 (자동 저장 트리거)
      setReview((prev) => ({
        ...prev,
        space: value ? Number(value) : 0,
      }));
    }
  };

  const handleNext = () => {
    if (buildingName && selectedFloor && squareFootage) {
      const updatedReview = {
        ...review,
        detailedAddress: buildingName,
        floorType: selectedFloor,
        space: Number(squareFootage),
        // description은 리뷰 내용 텍스트이므로 여기서 설정하지 않음
      };

      setReview(updatedReview);

      if (from === 'confirm') {
        navigate('/review/confirm', {
          state: {
            ...location.state,
            buildingName,
            floor: selectedFloor,
            squareFootage: squareFootage,
          },
        });
      } else {
        // "다음" 버튼 클릭 시 자동저장에 다음 단계 기록
        reviewAutoSave.save({
          reviewState: updatedReview,
          dormitoryReviewState: null,
          currentStep: REVIEW_STEPS.PRICE
        });

        navigate('/review/result', {
          state: {
            ...location.state,
            buildingName,
            floor: selectedFloor,
            squareFootage: squareFootage,
          },
        });
      }
    }
  };

  const handleBack = () => {
    if (from === 'confirm') {
      navigate('/review/confirm');
    } else {
      navigate(-1);
    }
  };

  const isNextEnabled =
    buildingName.trim() !== '' &&
    selectedFloor !== null &&
    squareFootage.trim() !== '';

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
          <h1>건물명 및 상세주소가 있으면 좋겠어요!</h1>
        </header>
        <div className={styles.inputSection}>
          <label className={styles.label}>건물명</label>
          <input
            type="text"
            className={styles.buildingInput}
            value={buildingName}
            onChange={handleBuildingNameChange}
            placeholder="예) 찐빵주공아파트"
          />
          <label className={styles.label}>평수</label>
          <input
            type="text"
            className={styles.buildingInput}
            value={squareFootage}
            onChange={handleSquareFootageChange}
            placeholder="예) 24.5"
          />
        </div>
        <div className={styles.floorSection}>
          <label className={styles.label}>층수</label>
          <div className={styles.floorOptions}>
            {floors.map((floor) => (
              <button
                key={floor}
                className={`${styles.floorButton} ${
                  selectedFloor === floor ? styles.selected : ''
                }`}
                onClick={() => handleFloorSelect(floor)}
              >
                {floor}
              </button>
            ))}
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
          currentStep="floor"
        />
      )}
    </div>
  );
};

export default FloorInputPage;
