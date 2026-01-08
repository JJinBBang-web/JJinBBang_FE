import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  reviewState,
  defaultReviewState,
} from "../../recoil/review/reviewAtoms";
import { dormitoryReviewState } from "../../recoil/review/dormitoryReviewAtoms";
import { selectedTypeNumState } from "../../recoil/map/mapRecoilState";
import { reviewAutoSave, REVIEW_STEPS } from "../../util/reviewAutoSave";
import AutoSaveRestoreSheet from "../../components/review/AutoSaveRestoreSheet";
import useReviewStepTracking, { trackReviewStep } from "../../hooks/useReviewStepTracking";
import styles from "../../styles/review/ReviewType.module.css";
import backArrowIcon from "../../assets/image/backArrowIcon.svg";

const ReviewTypePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};
  const { housingType } = locationState;
  const [review, setReview] = useRecoilState(reviewState);
  const [dormitoryReview, setDormitoryReview] = useRecoilState(dormitoryReviewState);
  const setSelectedTypeNum = useSetRecoilState(selectedTypeNumState);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAutoSaveSheet, setShowAutoSaveSheet] = useState(false);

  // 자동 저장 기능 - type 페이지 진입 시 초기 저장
  useEffect(() => {
    const initAutoSave = async () => {
      await reviewAutoSave.save({
        reviewState: review,
        dormitoryReviewState: dormitoryReview,
        currentStep: REVIEW_STEPS.TYPE,
        uuid: reviewAutoSave.load()?.uuid,
      });

      // GA4 Review Funnel Tracking: Step 1
      // 저장 완료 후 트래킹 실행 (UUID 보장)
      trackReviewStep('1_review_type_select');
    };

    initAutoSave();
  }, []);

  const housingTypeNum = (type: string) => {
    if (
      ["원/투룸", "아파트", "주택/빌라", "오피스텔", "하숙집/고시원"].includes(
        type
      )
    ) {
      return 1;
    } else if (type === "기숙사") {
      return 2;
    } else {
      return 3;
    }
  };

  useEffect(() => {
    // 수정 모드일 경우 기존 상태 복원
    if (locationState.from === "confirm" && review.housingType) {
      setSelectedType(review.housingType);
    } else {
      // 새로운 리뷰 작성 시작 - 자동저장 데이터가 있는지 확인
      const hasAutoSave = reviewAutoSave.hasData();
      if (hasAutoSave) {
        // 자동 저장 데이터가 있으면 바텀 시트 표시
        setShowAutoSaveSheet(true);
      }
      // 건물 유형 선택을 초기화 (자동 저장된 데이터가 있어도)
      // 사용자가 '이어서 작성'을 선택하면 해당 페이지로 직접 이동하므로
      // type 페이지에서는 항상 선택되지 않은 상태로 시작
      setSelectedType(null);
    }
  }, [locationState.from]);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);

    // 기숙사 선택 시 캠퍼스 선택 상태 즉시 초기화 (수정 모드가 아닐 때만)
    if (type === "기숙사" && locationState.from !== "confirm") {
      setSelectedTypeNum(null);
    }
  };

  const handleNext = () => {
    if (selectedType) {
      // housingType 변경 시 전체 리셋이 필요한 경우 체크
      if (
        housingType &&
        housingTypeNum(selectedType) !== housingTypeNum(housingType)
      ) {
        // 유형 카테고리가 변경되면 초기화 후 새로운 housingType 설정
        setReview({
          ...defaultReviewState,
          housingType: selectedType,
        });
        locationState.from = null;
      } else {
        // 일반적인 경우: 기존 데이터 유지하면서 housingType만 업데이트
        setReview((prev) => ({
          ...prev,
          housingType: selectedType,
        }));
      }

      // 수정 모드인지 확인
      if (locationState.from === "confirm") {
        // 수정 모드일 경우 확인 페이지로 돌아가기
        navigate("/review/confirm", {
          state: {
            ...locationState,
            housingType: selectedType,
          },
        });
      } else {
        // "다음" 버튼 클릭 시:
        // 1. 현재 페이지 데이터를 즉시 저장 (다음 step으로)
        reviewAutoSave.save({
          reviewState: review,
          dormitoryReviewState: null,
          currentStep: REVIEW_STEPS.ADDRESS_INPUT, // 다음 페이지
          uuid: reviewAutoSave.load()?.uuid
        });

        // 공인중개사는 주소 검색 없이 바로 상호명 입력 페이지로 이동
        if (selectedType === "공인중개사") {
          navigate("/review/agency", {
            state: {
              ...locationState,
              housingType: selectedType,
            },
            replace: false,
          });
        } else {
          // 기타 타입(기숙사, 원룸 등)은 주소 입력 페이지로 이동
          navigate("/review/input-address", {
            state: {
              ...locationState,
              housingType: selectedType,
            },
            replace: false,
          });
        }
      }
    }
  };

  const handleBack = () => {
    // 수정 모드일 경우
    if (locationState.from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
        },
        replace: true,
      });
    } else {
      // 일반 모드일 경우 MyPage로 이동
      navigate("/mypage", { replace: true });
    }
  };

  // 자동 저장 복원 - 이어서 작성
  const handleContinueFromAutoSave = () => {
    const savedData = reviewAutoSave.load();
    if (savedData) {
      // Recoil 상태 복원
      if (savedData.reviewState) {
        setReview(savedData.reviewState);
      }
      if (savedData.dormitoryReviewState) {
        setDormitoryReview(savedData.dormitoryReviewState);
      }

      // 마지막 작성 페이지로 이동
      const lastPage = reviewAutoSave.getLastEditedPage();
      if (lastPage) {
        setShowAutoSaveSheet(false);
        navigate(lastPage.path, { state: lastPage.state });
      } else {
        // 페이지를 찾을 수 없으면 현재 페이지에서 계속
        setShowAutoSaveSheet(false);
      }
    } else {
      setShowAutoSaveSheet(false);
    }
  };

  // 자동 저장 복원 - 새롭게 작성
  const handleNewStartFromAutoSave = async() => {
    // 자동 저장 데이터 삭제
    reviewAutoSave.clear();
    // Recoil 상태 초기화
    setReview(defaultReviewState);
    // 바텀 시트 닫기
    setShowAutoSaveSheet(false);

    // 명시적으로 새로운 상태와 UUID로 저장해야 합니다.
    await reviewAutoSave.save({
      reviewState: review,
      dormitoryReviewState: dormitoryReview,
      currentStep: REVIEW_STEPS.TYPE,
      uuid: crypto.randomUUID(), // 새로 시작하므로 명시적으로 새 UUID 생성
    });

    // GA4 이벤트 수동 전송
    trackReviewStep('1_review_type_select');
  };

  // 자동 저장 복원 - 닫기
  const handleCloseAutoSaveSheet = () => {
    setShowAutoSaveSheet(false);
  };

  return (
    <>
      <AutoSaveRestoreSheet
        isOpen={showAutoSaveSheet}
        onClose={handleCloseAutoSaveSheet}
        onContinue={handleContinueFromAutoSave}
        onNewStart={handleNewStartFromAutoSave}
      />
      <div className="content" style={{ backgroundColor: "var(--white)" }}>
        <div className={styles.container}>
          <header className={styles.header}>
            <button className={styles.backButton} onClick={handleBack}>
              <img src={backArrowIcon} alt="back" />
            </button>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
            <h1>찐빵 유형을 선택해 볼까요?</h1>
          </header>
          <div className={styles.buttonGroup}>
            {[
              "원/투룸",
              "아파트",
              "주택/빌라",
              "오피스텔",
              "기숙사",
              "하숙집/고시원",
              "공인중개사",
            ].map((type) => (
              <button
                key={type}
                className={`${styles.typeButton} ${
                  selectedType === type ? styles.selected : ""
                }`}
                onClick={() => handleTypeSelect(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {/* 유형 선택 여부에 따라 버튼 레이아웃 변경 */}
          {selectedType ? (
            // 유형이 선택되면 [이전]과 [다음] 버튼을 함께 표시
            <div className={styles.buttonContainer}>
              <button className={styles.prevButton} onClick={handleBack}>
                이전
              </button>
              <button
                className={`${styles.nextButton} ${styles.enabled}`}
                onClick={handleNext}
              >
                다음
              </button>
            </div>
          ) : (
            // 유형이 선택되지 않으면 [다음] 버튼만 표시 (비활성화 상태)
            <button
              className={styles.nextButton}
              onClick={handleNext}
              disabled={!selectedType}
            >
              다음
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewTypePage;
