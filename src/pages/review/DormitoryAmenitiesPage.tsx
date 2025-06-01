// src/pages/review/DormitoryAmenitiesPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { dormitoryReviewState } from '../../recoil/review/dormitoryReviewAtoms';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
import styles from '../../styles/review/DormitoryAmenities.module.css';
import closeIcon from '../../assets/image/iconClose.svg';

interface LocationState {
  facilities?: any[];
  from?: string;
}

// 인터페이스 정의 추가
interface FacilityOption {
  [key: string]: boolean;
}

interface FacilitySelections {
  [key: string]: FacilityOption;
}

const DormitoryAmenitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { facilities, from } = (location.state as LocationState) || {};
  const [dormitoryReview, setDormitoryReview] =
    useRecoilState(dormitoryReviewState);

  // 각 편의시설에 대한 선택 상태 관리 - 타입 명시
  const [selections, setSelections] = useState<FacilitySelections>({
    화장실: { 개인: false, 공용: false },
    샤워실: { 개인: false, 공용: false },
    냉장고: { 없음: false, 개인: false, 공용: false },
    전자레인지: { 개인: false, 공용: false },
    세탁기: { 개인: false, 공용: false },
    휴게시설: { 유: false, 무: false },
  });

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    // 이전 페이지에서 넘어온 경우, 시설 데이터에 따라 선택 상태 업데이트
    if (facilities) {
      const newSelections = { ...selections };
      // 시설 데이터를 선택 상태에 적용
      setSelections(newSelections);
    }
  }, [facilities]);

  // 옵션 선택 처리 함수 수정
  const handleOptionSelect = (facility: string, option: string) => {
    setSelections((prev) => {
      // 해당 시설의 옵션 객체 복사
      const facilityOptions = { ...prev[facility] };

      // 모든 옵션 false로 초기화
      Object.keys(facilityOptions).forEach((key) => {
        facilityOptions[key] = false;
      });

      // 선택된 옵션만 true로 설정
      facilityOptions[option] = true;

      return {
        ...prev,
        [facility]: facilityOptions,
      };
    });
  };

  // 모든 시설에 대해 하나씩 선택되었는지 확인
  const isNextEnabled = Object.values(selections).every((facility) =>
    Object.values(facility).some((value) => value === true)
  );

  // 다음 버튼 클릭 처리 - PhotoUploadPage로 이동
  const handleNext = () => {
    const updatedReview = {
      ...dormitoryReview,
      facilityConditions: selections,
    };

    setDormitoryReview(updatedReview);
    localStorage.setItem('dormitoryReviewState', JSON.stringify(updatedReview));

    if (from === 'confirm') {
      navigate('/review/confirm', {
        state: {
          ...location.state,
          facilityConditions: selections,
        },
      });
    } else {
      // PhotoUploadPage로 네비게이션
      navigate('/review/room-info', {
        state: {
          ...location.state,
          facilityConditions: selections,
        },
      });
    }
  };

  // 이전 버튼 클릭 처리
  const handleBack = () => {
    if (from === 'confirm') {
      navigate('/review/confirm');
    } else {
      navigate(-1);
    }
  };

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
          <h1>기숙사에 어떤 편의 시설이 제공되었나요?</h1>
        </header>

        <div className={styles.facilitiesContainer}>
          {Object.entries(selections).map(([facility, options]) => (
            <div key={facility} className={styles.facilitySection}>
              <h2 className={styles.facilityTitle}>{facility}</h2>
              <div className={styles.optionsContainer}>
                {Object.entries(options).map(([option, selected]) => (
                  <button
                    key={option}
                    className={`${styles.optionButton} ${
                      selected ? styles.selected : ''
                    }`}
                    onClick={() => handleOptionSelect(facility, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
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

export default DormitoryAmenitiesPage;
