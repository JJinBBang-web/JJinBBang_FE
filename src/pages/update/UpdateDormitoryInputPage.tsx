// src/pages/review/DormitoryInputPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styles from './UpdateDormitoryInputPage.module.css'
import { updateReviewState } from '../../recoil/review/updateReviewAtoms';
import { floorToKorean, koreanToFloor } from '../../util/mapping';
import backArrowIcon from "../../assets/image/backArrowIcon.svg";

interface LocationState {
  address?: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  buildingName?: string;
  floorType?: string;
  roomCapacity?: number,
  universityName?: string,
  from?: string;
}

const UpdateDormitoryInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from, roomCapacity, floorType, buildingName, universityName } = (location.state as LocationState) || {};
  const [review, setReview] = useRecoilState(updateReviewState);

  const {reviewId} = useParams();

  // Cast to ExtendedReviewState to work with our additional properties
  // const extendedReview = review as unknown as ExtendedReviewState;

  // State for form fields
  // const [university, setUniversity] = useState<string>(
  //   extendedReview.university || ''
  // );
  const [university, setUniversity] = useState(
    universityName || review?.universityName || ''
  )
  const [dormitoryName, setDormitoryName] = useState(
    buildingName || review?.detailedAddress || ''
  );
  const [capacity, setCapacity] = useState<number | undefined>(
    roomCapacity ?? review?.roomCapacity ?? review?.dormitoryConditions?.roomCapacity ?? undefined
  );
  const [selectedFloor, setSelectedFloor] = useState(() => {
    if (floorType) return floorType;
    if (review?.floorType && floorToKorean[review.floorType]) {
      return floorToKorean[review.floorType];
    }
    return '';
  });

  useEffect(() => {
    if (from === 'update') {
      if (universityName) setUniversity(universityName);
      if (buildingName) setDormitoryName(buildingName);
      if (roomCapacity !== undefined) setCapacity(roomCapacity);
      if (floorType) setSelectedFloor(floorType);
    }
  }, [from, universityName, buildingName, roomCapacity, floorType]);


  const handleInputChange = <T extends string | number | undefined>(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const parsedValue = (rawValue === '' ? undefined : Number(rawValue)) as T;
    setter(parsedValue);
  };

  // const handleDormitoryNameChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setDormitoryName(e.target.value);
  // };

  const handleFloorSelect = (floor: string) => {
    setSelectedFloor(floor);
  };

  const handleNext = () => {
    const updatedReview = {
      ...review!,
      dormitoryConditions: {
        hasDistanceCriteria: review?.dormitoryConditions?.hasDistanceCriteria ?? false,
        hasGradeCriteria: review?.dormitoryConditions?.hasGradeCriteria ?? false,
        dormitoryFee: review?.dormitoryConditions?.dormitoryFee ?? 0,
        residenceArea: review?.dormitoryConditions?.residenceArea,
        semesterGrade: review?.dormitoryConditions?.semesterGrade,
        roomCapacity: Number(capacity ?? 0),
      },
      floorType: koreanToFloor[selectedFloor] ?? '',
      universityName: university?? "",
      detailedAddress: dormitoryName ?? "",
      housingType: "DORMITORY"
    };

    setReview(updatedReview);
    

    const dormitoryData = {
      universityName: university,
      dormitoryName: dormitoryName,
      roomCapacity: Number(capacity || 0),
      floorType: koreanToFloor[selectedFloor],
    };

    if (from === 'update') {
      navigate(`/review/${reviewId}/update`, {
        replace:true,
        state: {
          ...location.state,
          dormitoryData,
        },
      });
    }
  };

  const handleBack = () => {
    if (from === 'update') {
      navigate(`/review/${reviewId}/update`, {replace:true});
    } else {
      navigate(-1);
    }
  };

  // 수정된 조건: 기숙사비 제거, 층수 선택 추가
  const isNextEnabled =
    university.trim() !== '' &&
    dormitoryName.trim() !== '' &&
    capacity !== undefined &&
    capacity > 0 &&
    selectedFloor !== '';

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
          <h1>기숙사명 및 상세정보가 있으면 좋겠어요!</h1>
        </header>

        <div className={styles.inputSection}>
          <label className={styles.label}>대학교</label>
          <div className={styles.buildingInput}>
            {university || "예) 찐빵대학교"}
          </div>

          <label className={styles.label}>기숙사명</label>
          <div className={styles.buildingInput}>
            {dormitoryName || "예) 찐빵관"}
          </div>

          <label className={styles.label}>방 인원</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.buildingInput}
              value={capacity ?? ''}
              onChange={(e) => handleInputChange(e, setCapacity)}
              placeholder="0"
            />
            <span className={styles.unit}>인실</span>
          </div>
        </div>

        <div className={styles.floorSection}>
          <label className={styles.label}>층수</label>
          <div className={styles.floorOptions}>
            <button
              className={`${styles.floorButton} ${
                selectedFloor === "저층" ? styles.selected : ""
              }`}
              onClick={() => handleFloorSelect("저층")}
            >
              저층
            </button>
            <button
              className={`${styles.floorButton} ${
                selectedFloor === "중층" ? styles.selected : ""
              }`}
              onClick={() => handleFloorSelect("중층")}
            >
              중층
            </button>
            <button
              className={`${styles.floorButton} ${
                selectedFloor === "고층" ? styles.selected : ""
              }`}
              onClick={() => handleFloorSelect("고층")}
            >
              고층
            </button>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={handleBack}>
          이전
        </button>
        <button
          className={`${styles.nextButton} ${
            isNextEnabled ? styles.enabled : ""
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

export default UpdateDormitoryInputPage;
