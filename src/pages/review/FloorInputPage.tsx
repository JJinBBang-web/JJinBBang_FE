// src/pages/review/FloorInputPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/review/FloorInput.module.css';
import closeIcon from '../../assets/image/iconClose.svg';

interface LocationState {
  address: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
}

const FloorInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { address } = (location.state as LocationState) || {
    address: { roadAddress: '', jibunAddress: '', buildingName: '' },
  };

  const [buildingName, setBuildingName] = useState(address.buildingName || '');
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);

  const floors = ['반지하', '저층', '중층', '고층', '옥탑'];

  const handleNext = () => {
    if (buildingName && selectedFloor) {
      navigate('/review/price', {
        state: {
          ...location.state,
          buildingName,
          floor: selectedFloor,
        },
      });
    }
  };

  const isNextEnabled = buildingName.trim() !== '' && selectedFloor !== null;

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>{' '}
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
        <button className={styles.prevButton} onClick={() => navigate(-1)}>
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
