// src/pages/review/FloorInputPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/review/FloorInput.module.css';

interface BuildingInfo {
  buildingName: string;
  unit: string;
  floor: string;
}

const FloorInputPage: React.FC = () => {
  const navigate = useNavigate();
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfo>({
    buildingName: '',
    unit: '',
    floor: '',
  });

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <img src="/assets/image/closeIcon.svg" alt="close" />
          </button>
          <h1>정확한 주소가 맞나요?</h1>
        </header>

        <div className={styles.addressBox}>
          <div className={styles.currentAddress}>
            경남 진주시 내동로348번길 10 [가좌동 573-1]
          </div>
          <button className={styles.reSearchButton}>주소 재검색</button>
        </div>

        <div className={styles.detailInputs}>
          <div className={styles.inputGroup}>
            <label>건물명</label>
            <input
              type="text"
              value={buildingInfo.buildingName}
              onChange={(e) =>
                setBuildingInfo({
                  ...buildingInfo,
                  buildingName: e.target.value,
                })
              }
              placeholder="진주가좌그린빌주공아파트"
            />
          </div>

          <div className={styles.floorInputs}>
            <label>층수</label>
            <div className={styles.floorButtons}>
              <button>반지하</button>
              <button>저층</button>
              <button>중층</button>
              <button>고층</button>
              <button>옥탑</button>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.previousButton}
            onClick={() => navigate(-1)}
          >
            이전
          </button>
          <button
            className={styles.nextButton}
            onClick={() => navigate('/review/price')}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloorInputPage;
