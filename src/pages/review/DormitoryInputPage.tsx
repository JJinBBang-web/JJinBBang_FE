// src/pages/review/DormitoryInputPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { reviewState, ReviewState } from '../../recoil/review/reviewAtoms';
import { selectedTypeNumState } from '../../recoil/map/mapRecoilState';
import { universitiesState } from '../../recoil/map/universityRecoilState';
import { isSheetOpenState } from '../../recoil/util/utilRecoilState'; // ADD THIS IMPORT
import CancelModal from '../../components/review/CancelModal';
import UniversityCampusSelectModal from '../../components/review/UniversityCampusSelectModal';
import { useCancelModal } from '../../util/useCancelModal';
import styles from '../../styles/review/FloorInput.module.css';
import closeIcon from '../../assets/image/iconClose.svg';

// Extended ReviewState interface to include dormitory-specific fields
interface ExtendedReviewState extends ReviewState {
  university?: string;
  dormitoryName?: string;
}

interface LocationState {
  address?: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  buildingName?: string;
  floor?: string;
  from?: string;
}

const DormitoryInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = (location.state as LocationState) || {};
  const [review, setReview] = useRecoilState(reviewState);
  const selectedTypeNum = useRecoilValue(selectedTypeNumState);
  const universities = useRecoilValue(universitiesState);
  const setBottomSheet = useSetRecoilState(isSheetOpenState); // ADD THIS
  const bottomSheet = useRecoilValue(isSheetOpenState); // ADD THIS

  // Cast to ExtendedReviewState to work with our additional properties
  const extendedReview = review as unknown as ExtendedReviewState;

  // State for form fields
  const [university, setUniversity] = useState<string>(
    extendedReview.university || ''
  );
  // REMOVE showUniversityModal state - using Recoil instead
  const [dormitoryName, setDormitoryName] = useState<string>(
    extendedReview.dormitoryName || ''
  );
  const [roomCapacity, setRoomCapacity] = useState<string>(
    review.roomCapacity ? review.roomCapacity.toString() : '0'
  );
  const [selectedFloor, setSelectedFloor] = useState<string>(
    review.floorType || '저층'
  );
  const [dormitoryFee, setDormitoryFee] = useState<string>(
    review.dormitoryFee ? review.dormitoryFee.toString() : ''
  );

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    // Restore state from review if coming from confirm page
    if (from === 'confirm') {
      setUniversity(extendedReview.university || '');
      setDormitoryName(extendedReview.dormitoryName || '');
      setRoomCapacity(
        review.roomCapacity ? review.roomCapacity.toString() : '0'
      );
      setSelectedFloor(review.floorType || '저층');
      setDormitoryFee(
        review.dormitoryFee ? review.dormitoryFee.toString() : ''
      );
    }
  }, [from, review, extendedReview]);

  // Update university name when selectedTypeNum changes
  useEffect(() => {
    if (selectedTypeNum) {
      const selectedUniversity = universities.find(
        (uni) => uni.id === selectedTypeNum
      );
      if (selectedUniversity) {
        setUniversity(
          `${selectedUniversity.universityName} ${selectedUniversity.campus}`
        );
      }
    }
  }, [selectedTypeNum, universities]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(value);
  };

  const handleDormitoryNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDormitoryName(e.target.value);
  };

  const formatNumber = (value: string) => {
    if (!value) return '';
    return Number(value).toLocaleString();
  };

  // UPDATED: Use Recoil state instead of local state
  const handleUniversityClick = () => {
    setBottomSheet({ isOpen: true, type: 'university' });
  };

  // REMOVE handleModalClose - not needed anymore

  const handleFloorSelect = (floor: string) => {
    setSelectedFloor(floor);
  };

  const handleNext = () => {
    const updatedReview = {
      ...review,
      roomCapacity: Number(roomCapacity),
      floorType: selectedFloor,
      dormitoryFee: Number(dormitoryFee),
    };

    const extendedUpdatedReview = {
      ...updatedReview,
      university: university,
      dormitoryName: dormitoryName,
    } as unknown as ReviewState;

    setReview(extendedUpdatedReview);
    localStorage.setItem('reviewState', JSON.stringify(extendedUpdatedReview));

    const dormitoryData = {
      university: university,
      dormitoryName: dormitoryName,
      roomCapacity: Number(roomCapacity),
      floorType: selectedFloor,
      dormitoryFee: Number(dormitoryFee),
    };

    if (from === 'confirm') {
      navigate('/review/confirm', {
        state: {
          ...location.state,
          dormitoryData,
        },
      });
    } else {
      navigate('/review/dormitory-conditions', {
        state: {
          ...location.state,
          dormitoryData,
        },
      });
    }
  };

  const handleBack = () => {
    if (from === 'confirm') {
      navigate('/review/confirm');
    } else {
      navigate(-1);
    }
  };

  // Next button is enabled only when all required fields are filled
  const isNextEnabled =
    university !== '' &&
    dormitoryName !== '' &&
    roomCapacity !== '0' &&
    dormitoryFee !== '';

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
          <h1>기숙사명 및 상세정보가 있으면 좋겠어요!</h1>
        </header>

        <div className={styles.inputSection}>
          <label className={styles.label}>대학교</label>
          <div className={styles.buildingInput} onClick={handleUniversityClick}>
            {university || '예) 찐빵대학교'}
          </div>

          <label className={styles.label}>기숙사명</label>
          <input
            type="text"
            className={styles.buildingInput}
            value={dormitoryName}
            onChange={handleDormitoryNameChange}
            placeholder="예) 기린관"
          />

          <label className={styles.label}>방 인원</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.buildingInput}
              value={roomCapacity}
              onChange={(e) => handleInputChange(e, setRoomCapacity)}
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
                selectedFloor === '저층' ? styles.selected : ''
              }`}
              onClick={() => handleFloorSelect('저층')}
            >
              저층
            </button>
            <button
              className={`${styles.floorButton} ${
                selectedFloor === '중층' ? styles.selected : ''
              }`}
              onClick={() => handleFloorSelect('중층')}
            >
              중층
            </button>
            <button
              className={`${styles.floorButton} ${
                selectedFloor === '고층' ? styles.selected : ''
              }`}
              onClick={() => handleFloorSelect('고층')}
            >
              고층
            </button>
          </div>
        </div>

        <div className={styles.inputSection}>
          <label className={styles.label}>기숙사비</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.buildingInput}
              value={formatNumber(dormitoryFee)}
              onChange={(e) => handleInputChange(e, setDormitoryFee)}
              placeholder="0"
            />
            <span className={styles.unit}>만원</span>
          </div>
        </div>
      </div>

      {/* UPDATED: Conditional rendering based on Recoil state */}
      {bottomSheet.isOpen && bottomSheet.type === 'university' && (
        <UniversityCampusSelectModal />
      )}

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

export default DormitoryInputPage;
