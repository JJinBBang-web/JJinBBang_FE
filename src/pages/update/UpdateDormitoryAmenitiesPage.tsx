// src/pages/review/DormitoryAmenitiesPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { updateDormitoryReviewState } from '../../recoil/review/dormitoryReviewAtoms';
import styles from '../../styles/review/DormitoryAmenities.module.css';
import backArrowIcon from '../../assets/image/backArrowIcon.svg';
import { updateReviewState } from '../../recoil/review/updateReviewAtoms';

interface LocationState {
  from?: string;
}

// 인터페이스 정의 추가
interface FacilityOption {
  [key: string]: boolean;
}

interface FacilitySelections {
  [key: string]: FacilityOption;
}

const UpdateDormitoryAmenitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = (location.state as LocationState) || {};
  const [dormitoryReview, setDormitoryReview] =
    useRecoilState(updateDormitoryReviewState);
  const [review, setReview] = useRecoilState(updateReviewState);
  const contentRef = useRef<HTMLDivElement>(null);
  const {reviewId} = useParams();

  // 각 편의시설에 대한 선택 상태 관리 - 타입 명시
  const [selections, setSelections] = useState<FacilitySelections>({
    화장실: { 개인: false, 공용: false },
    샤워실: { 개인: false, 공용: false },
    냉장고: { 없음: false, 개인: false, 공용: false },
    전자레인지: { 없음: false, 개인: false, 공용: false },
    세탁기: { 없음: false, 개인: false, 공용: false },
    휴게시설: { 있음: false, 없음: false },
  });

    useEffect(() => {
        // 이전 페이지에서 넘어온 경우, 시설 데이터에 따라 선택 상태 업데이트
        if (review?.facilityConditions) {
            // 깊은 복사를 통해 완전히 새로운 selections 객체 생성
            const newSelections: FacilitySelections = {
            화장실: { 개인: false, 공용: false },
            샤워실: { 개인: false, 공용: false },
            냉장고: { 없음: false, 개인: false, 공용: false },
            전자레인지: { 없음: false, 개인: false, 공용: false },
            세탁기: { 없음: false, 개인: false, 공용: false },
            휴게시설: { 있음: false, 없음: false },
            };

            const facilityData = review.facilityConditions;

            // private 시설들 처리
            if (facilityData.private) {
            Object.entries(facilityData.private).forEach(([facility, isSelected]) => {
                if (newSelections[facility] && isSelected) {
                // '개인'을 true로 설정
                newSelections[facility]['개인'] = true;
                }
            });
            }

            // public 시설들 처리
            if (facilityData.public) {
            Object.entries(facilityData.public).forEach(([facility, isSelected]) => {
                if (newSelections[facility] && isSelected) {
                // '공용'을 true로 설정
                newSelections[facility]['공용'] = true;
                }
            });
            }

            // lounge 시설 처리
            if (facilityData.lounge && facilityData.lounge['있음']) {
                newSelections['휴게시설']['있음'] = true;
            } else {
                newSelections['휴게시설']['없음'] = true;
            }

            ['냉장고', '전자레인지', '세탁기'].forEach(facility => {
                const hasPrivate = facilityData.private && facilityData.private[facility];
                const hasPublic = facilityData.public && facilityData.public[facility];
                
                // private도 public도 없으면 "없음" 선택
                if (!hasPrivate && !hasPublic) {
                    newSelections[facility]['없음'] = true;
                }
            });

            setSelections(newSelections);
        }
    }, [review?.facilityConditions]);

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
  const handleNext = () => {

    const convertedFacilityConditions: {
        private: { [key: string]: boolean };
        public: { [key: string]: boolean };
        lounge: { [key: string]: boolean };
    } = {
        private: {},
        public: {},
        lounge: {}
    };

    Object.entries(selections).forEach(([facility, options]) => {
        Object.entries(options).forEach(([option, isSelected]) => {
        if (isSelected) {
            if (facility === '휴게시설') {
                convertedFacilityConditions.lounge[facility] = option === '있음';
            } else {
            if (option === '개인') {
                convertedFacilityConditions.private[facility] = true;
            } else if (option === '공용') {
                convertedFacilityConditions.public[facility] = true;
            }
            // '없음' 옵션의 경우 아무것도 설정하지 않음 (false로 유지)
            }
        }
        });
    });

    setReview(prev => {
        if (!prev) return prev;
        return {
        ...prev,
        facilityConditions: convertedFacilityConditions
        };
    });

    const updatedDormitoryReview = {
        ...dormitoryReview,
        facilityConditions: selections,
    };

    setDormitoryReview(updatedDormitoryReview);

    const updatedReviewForStorage = {
        ...review,
        facilityConditions: convertedFacilityConditions,
    };

    

    if (from === 'update') {
      navigate(`/review/${reviewId}/update`, {
        replace:true,
        state: {
          ...location.state,
          facilityConditions: convertedFacilityConditions,
        },
      });
    } 
  };

  // 이전 버튼 클릭 처리
  const handleBack = () => {
    if (from === 'update') {
      navigate(`/review/${reviewId}/update`, {replace:true});
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
            onClick={handleBack}
          >
            <img src={backArrowIcon} alt="close" />
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
          확인
        </button>
      </footer>
    </div>
  );
};

export default UpdateDormitoryAmenitiesPage;
