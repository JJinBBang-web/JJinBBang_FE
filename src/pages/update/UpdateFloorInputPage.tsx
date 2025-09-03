import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styles from '../../styles/review/FloorInput.module.css';
import backArrowIcon from "../../assets/image/backArrowIcon.svg";
import { updateReviewState } from '../../recoil/review/updateReviewAtoms';
import { floorToKorean, koreanToFloor } from '../../util/mapping';
import { defaultReviewState, ReviewState } from '../../recoil/review/reviewAtoms';

interface LocationState {
  address: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  floor: string;
  space: number;
  from?: string;
}

const UpdateFloorInputPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [review, setReview] = useRecoilState(updateReviewState);
    const { space, floor, address, from } = (location.state as LocationState) || {};

    const [buildingName, setBuildingName] = useState(
        review?.detailedAddress || address?.buildingName || ''
    );
    const [squareFootage, setSquareFootage] = useState<string>(() => {
        if (typeof space === 'number') return String(space);
        if (typeof review?.space === 'number') return String(review.space);
        return '';
    });
    const [selectedFloor, setSelectedFloor] = useState<string | null>(() => (
        floor ?? (review?.floorType ? floorToKorean[review.floorType] ?? null : null)
    ));
    const floors = ['반지하', '저층', '중층', '고층', '옥탑'];

    const { reviewId } = useParams();

    const isAgency = review?.housingType === "AGENCY";


    useEffect(() => {
        if (from === 'update') {
            setBuildingName(review?.detailedAddress || '');
            setSelectedFloor(
            review?.floorType ? floorToKorean[review.floorType] ?? null : null
            );
            if (typeof review?.space === 'number') {
            setSquareFootage(String(review.space));
            }
        }
    }, [from, review]);
    

    const handleSquareFootageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 숫자/소수점만 허용
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setSquareFootage(value);
        }
    };


  const handleNext = () => {
    console.log(buildingName);
    if (isAgency) {
      const updatedReview = {
            ...review,
            detailedAddress: buildingName,
        };

        setReview(prev => {
            const base: ReviewState = prev ?? defaultReviewState;
            return {
                ...base,
                detailedAddress: buildingName,
            };
        });
        

        if (from === 'update') {
            navigate(`/review/${reviewId}/update`, {
            state: {
                ...location.state,
                detailedAddress: buildingName,
            },
            });
        } 
        console.log(review);
    } else {
    if (buildingName && selectedFloor && squareFootage) {
        const floorCode = koreanToFloor[selectedFloor];
        const spaceValue = Number(squareFootage);

        if (Number.isNaN(spaceValue)) return;

        const updatedReview = {
            ...review,
            detailedAddress: buildingName,
            floorType: floorCode,
            space: spaceValue,
        };

        setReview(prev => {
            const base: ReviewState = prev ?? defaultReviewState;
            return {
                ...base,
                detailedAddress: buildingName,
                floorType: floorCode,
                space: spaceValue,
            };
        });
        

        if (from === 'update') {
            navigate(`/review/${reviewId}/update`, {
            state: {
                ...location.state,
                buildingName,
                floor: selectedFloor,
                space: spaceValue,
            },
            });
        } 
    }
  }
  };

  const handleBack = () => {
    if (from === 'update') {
      navigate(`/review/${reviewId}/update`);
    } else {
      navigate(-1);
    }
  };

  const isNextEnabled =
    isAgency ? buildingName.trimEnd() !== '' :
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
            onClick={handleBack}
          >
            <img src={backArrowIcon} alt="close" />
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
          {review?.housingType === "AGENCY" ? "" 
          : <>
            <label className={styles.label}>평수</label>
            <input
              type="text"
              className={styles.buildingInput}
              value={squareFootage}
              onChange={handleSquareFootageChange}
              placeholder="예) 24.5"
            />
            </>}
          
        </div>
        {review?.housingType === "AGENCY" ? "" 
        : <>
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
        </> }
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
          확인
        </button>
      </footer>
    </div>
  );
};

export default UpdateFloorInputPage;
