// src/pages/review/DormitoryInputPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { reviewState, ReviewState } from '../../recoil/review/reviewAtoms';
import CancelModal from '../../components/review/CancelModal';
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

interface University {
  id: number;
  name: string;
  campus: string;
}

const DormitoryInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = (location.state as LocationState) || {};
  const [review, setReview] = useRecoilState(reviewState);
  // Cast to ExtendedReviewState to work with our additional properties
  const extendedReview = review as unknown as ExtendedReviewState;

  // State for form fields
  const [university, setUniversity] = useState<string>(
    extendedReview.university || ''
  );
  const [showUniversityModal, setShowUniversityModal] =
    useState<boolean>(false);
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

  // Universities list for modal
  const universities: University[] = [
    { id: 1, name: '경상국립대학교', campus: '칠암캠퍼스' },
    { id: 2, name: '경상국립대학교', campus: '가좌캠퍼스' },
  ];

  const koreanInitials = [
    'ㄱ',
    'ㄴ',
    'ㄷ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅅ',
    'ㅇ',
    'ㅈ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ];
  const [selectedInitial, setSelectedInitial] = useState<string>('ㄱ');
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

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

  const handleUniversityClick = () => {
    setShowUniversityModal(true);
  };

  const handleInitialSelect = (initial: string) => {
    setSelectedInitial(initial);
  };

  const handleUniversitySelect = (univ: University) => {
    setSelectedUniversity(univ);
  };

  const handleModalConfirm = () => {
    if (selectedUniversity) {
      setUniversity(`${selectedUniversity.name} ${selectedUniversity.campus}`);
    }
    setShowUniversityModal(false);
  };

  const handleModalReset = () => {
    setSelectedUniversity(null);
    setSelectedInitial('ㄱ');
  };

  const handleFloorSelect = (floor: string) => {
    setSelectedFloor(floor);
  };

  const handleNext = () => {
    // Create updated review object with all existing properties plus our additional ones
    const updatedReview = {
      ...review,
      roomCapacity: Number(roomCapacity),
      floorType: selectedFloor,
      dormitoryFee: Number(dormitoryFee),
    };

    // Add our extended properties
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
      navigate('/review/room-info', {
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

      {showUniversityModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBottomSheet}>
            <div className={styles.modalHandle}></div>
            <div className={styles.modalHeader}>
              <h2>대학교</h2>
              <button
                className={styles.closeModalButton}
                onClick={() => setShowUniversityModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.initialNav}>
              {koreanInitials.map((initial) => (
                <div
                  key={initial}
                  className={`${styles.initial} ${
                    selectedInitial === initial ? styles.selectedInitial : ''
                  }`}
                  onClick={() => handleInitialSelect(initial)}
                >
                  {initial}
                </div>
              ))}
            </div>

            <div className={styles.universityList}>
              {universities.map((univ) => (
                <div
                  key={univ.id}
                  className={`${styles.universityItem} ${
                    selectedUniversity?.id === univ.id
                      ? styles.selectedUniversity
                      : ''
                  }`}
                  onClick={() => handleUniversitySelect(univ)}
                >
                  <div className={styles.universityLogo}>
                    {/* Placeholder for university logo */}
                  </div>
                  <div className={styles.universityInfo}>
                    <p className={styles.universityName}>{univ.name}</p>
                    <p className={styles.universityCampus}>{univ.campus}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.resetButton} onClick={handleModalReset}>
                초기화
              </button>
              <button
                className={`${styles.confirmButton} ${
                  selectedUniversity ? styles.enabled : ''
                }`}
                onClick={handleModalConfirm}
                disabled={!selectedUniversity}
              >
                확인
              </button>
            </div>
          </div>
        </div>
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
