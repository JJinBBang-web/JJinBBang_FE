// src/pages/review/DormitoryAmenitiesPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { dormitoryReviewState } from '../../recoil/review/dormitoryReviewAtoms';
import { reviewState } from '../../recoil/review/reviewAtoms';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
import { useReviewAutoSave } from '../../hooks/useReviewAutoSave';
import { reviewAutoSave, REVIEW_STEPS } from '../../util/reviewAutoSave';
import styles from '../../styles/review/DormitoryAmenities.module.css';
import closeIcon from '../../assets/image/iconClose.svg';
import backArrowIcon from '../../assets/image/backArrowIcon.svg';
import useReviewStepTracking from '../../hooks/useReviewStepTracking';

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
  const [review, setReview] = useRecoilState(reviewState);
  const contentRef = useRef<HTMLDivElement>(null);

  // 각 편의시설에 대한 선택 상태 관리 - 타입 명시
  const [selections, setSelections] = useState<FacilitySelections>({
    화장실: { 개인: false, 공용: false },
    샤워실: { 개인: false, 공용: false },
    냉장고: { 없음: false, 개인: false, 공용: false },
    전자레인지: { 없음: false, 개인: false, 공용: false },
    세탁기: { 없음: false, 개인: false, 공용: false },
    휴게시설: { 있음: false, 없음: false },
  });

  useReviewStepTracking('3-2.3_dormitory_amenities');

  // 자동 저장 기능 추가
  useReviewAutoSave('dormitory-amenities');

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // 페이지 진입 시 currentStep만 업데이트 (reviewState 덮어쓰기 방지)
  useEffect(() => {
    reviewAutoSave.updateCurrentStepOnNext(REVIEW_STEPS.DORMITORY_AMENITIES);
  }, []);

  // 초기 마운트 여부 추적
  const isInitialMount = useRef(true);

  useEffect(() => {
    // confirm 페이지 또는 자동저장에서 복원 시 기존 selections 복원
    if ((from === 'confirm' || from === 'autosave') && dormitoryReview.facilityConditions) {
      setSelections(dormitoryReview.facilityConditions);
    } else if (facilities) {
      // 이전 페이지에서 넘어온 경우, 시설 데이터에 따라 선택 상태 업데이트
      const newSelections = { ...selections };
      // 시설 데이터를 선택 상태에 적용
      setSelections(newSelections);
    }
  }, [facilities, from, dormitoryReview.facilityConditions]);

  // selections 변경 시 review/dormitoryReview 상태 업데이트 (자동저장 트리거)
  useEffect(() => {
    // 초기 마운트 시에는 스킵 (자동저장 데이터 덮어쓰기 방지)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // 모든 시설에 대해 최소 하나가 선택되었는지 확인 (초기 상태 스킵)
    const hasAnySelection = Object.values(selections).some((facility) =>
      Object.values(facility).some((value) => value === true)
    );
    if (!hasAnySelection) return;

    // dormitoryReview 상태 업데이트
    setDormitoryReview((prev) => ({
      ...prev,
      facilityConditions: selections,
    }));

    // reviewState에도 facilityConditions 저장 (auto-save 감지용)
    setReview((prev) => ({
      ...prev,
      facilityConditions: {
        private: {
          화장실: selections['화장실']?.['개인'] || false,
          샤워실: selections['샤워실']?.['개인'] || false,
          냉장고: selections['냉장고']?.['개인'] || false,
          전자레인지: selections['전자레인지']?.['개인'] || false,
          세탁기: selections['세탁기']?.['개인'] || false,
        },
        public: {
          화장실: selections['화장실']?.['공용'] || false,
          샤워실: selections['샤워실']?.['공용'] || false,
          냉장고: selections['냉장고']?.['공용'] || false,
          전자레인지: selections['전자레인지']?.['공용'] || false,
          세탁기: selections['세탁기']?.['공용'] || false,
        },
        lounge: {
          있음: selections['휴게시설']?.['있음'] || false,
        },
      },
    }));
  }, [selections, setDormitoryReview, setReview]);

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

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 모든 시설에 대해 하나씩 선택되었는지 확인
  const isNextEnabled = Object.values(selections).every((facility) =>
    Object.values(facility).some((value) => value === true)
  );

  // 다음 버튼 클릭 처리 - PhotoUploadPage로 이동
  const handleNext = async () => {
    const updatedDormitoryReview = {
      ...dormitoryReview,
      facilityConditions: selections,
    };

    setDormitoryReview(updatedDormitoryReview);

    // reviewState에도 facilityConditions 저장 (auto-save 감지용)
    const updatedReview = {
      ...review,
      facilityConditions: {
        private: {
          화장실: selections['화장실']?.['개인'] || false,
          샤워실: selections['샤워실']?.['개인'] || false,
          냉장고: selections['냉장고']?.['개인'] || false,
          전자레인지: selections['전자레인지']?.['개인'] || false,
          세탁기: selections['세탁기']?.['개인'] || false,
        },
        public: {
          화장실: selections['화장실']?.['공용'] || false,
          샤워실: selections['샤워실']?.['공용'] || false,
          냉장고: selections['냉장고']?.['공용'] || false,
          전자레인지: selections['전자레인지']?.['공용'] || false,
          세탁기: selections['세탁기']?.['공용'] || false,
        },
        lounge: {
          있음: selections['휴게시설']?.['있음'] || false,
        },
      },
    };
    setReview(updatedReview);

    // 다음 페이지로 이동 전 자동 저장 (다음 step으로)
    await reviewAutoSave.save({
      reviewState: updatedReview,
      dormitoryReviewState: updatedDormitoryReview,
      currentStep: REVIEW_STEPS.ROOM_INFO,
      uuid: reviewAutoSave.load()?.uuid,
    });

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

        <div className={styles.facilitiesContainer} ref={contentRef}>
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

      <button className={styles.scrollTopButton} onClick={scrollToTop}>
        <img src={backArrowIcon} alt="위로 가기" />
      </button>

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
