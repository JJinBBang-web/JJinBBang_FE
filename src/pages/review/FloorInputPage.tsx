import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { reviewState } from '../../recoil/review/reviewAtoms';
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
  const [selectedFloor, setSelectedFloor] = useState<string | null>(
    review.floorType.includes('층') ? review.floorType : null
  );
  const floors = ['반지하', '저층', '중층', '고층', '옥탑'];

  useEffect(() => {
    // 수정 모드일 경우 기존 상태 복원
    if (from === 'confirm') {
      setBuildingName(review.detailedAddress || '');
      setSelectedFloor(
        review.floorType.includes('층') ? review.floorType : null
      );
    }
  }, [from, review]);

  const handleNext = () => {
    if (buildingName && selectedFloor) {
      const updatedReview = {
        ...review,
        detailedAddress: buildingName,
        floorType: selectedFloor,
      };

      setReview(updatedReview);
      localStorage.setItem('reviewState', JSON.stringify(updatedReview));

      if (from === 'confirm') {
        navigate('/review/confirm', {
          state: {
            ...location.state,
            buildingName,
            floor: selectedFloor,
          },
        });
      } else {
        navigate('/review/result', {
          state: {
            ...location.state,
            buildingName,
            floor: selectedFloor,
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

  const isNextEnabled = buildingName.trim() !== '' && selectedFloor !== null;

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => navigate('/mypage')}
          >
            <img src={closeIcon} alt="close" />
          </button>
        </header>
        <h1 className={styles.title}>건물명 및 상세주소가 있으면 좋겠어요!</h1>
        <div className={styles.inputSection}>
          <label className={styles.label}>건물명</label>
          <input
            type="text"
            className={styles.buildingInput}
            value={buildingName}
            onChange={(e) => setBuildingName(e.target.value)}
            placeholder="예) 찐빵주공아파트"
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
    </div>
  );
};

export default FloorInputPage;
