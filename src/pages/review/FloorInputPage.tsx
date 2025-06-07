import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { reviewState } from '../../recoil/review/reviewAtoms';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
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
  const [squareFootage, setSquareFootage] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string | null>(
    review.floorType.includes('층') ? review.floorType : null
  );
  const floors = ['반지하', '저층', '중층', '고층', '옥탑'];

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    // 수정 모드일 경우 기존 상태 복원
    if (from === 'confirm') {
      setBuildingName(review.detailedAddress || '');
      setSelectedFloor(
        review.floorType.includes('층') ? review.floorType : null
      );
    }
  }, [from, review]);

  const handleSquareFootageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // 빈 값이거나 숫자와 소수점만 포함하는 경우에만 허용
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSquareFootage(value);
    }
  };

  const handleNext = () => {
    if (buildingName && selectedFloor && squareFootage) {
      const updatedReview = {
        ...review,
        detailedAddress: buildingName,
        floorType: selectedFloor,
        description: squareFootage ? `${squareFootage}평` : review.description,
      };

      setReview(updatedReview);
      localStorage.setItem('reviewState', JSON.stringify(updatedReview));

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
            onChange={(e) => setBuildingName(e.target.value)}
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
                onClick={() => setSelectedFloor(floor)}
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
        />
      )}
    </div>
  );
};

export default FloorInputPage;
