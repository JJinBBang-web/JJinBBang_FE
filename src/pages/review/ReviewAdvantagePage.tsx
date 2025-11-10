import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  JjinFilterState,
  JjinAgencyFilterState,
  FilterCategory,
  FilterItem,
} from "../../recoil/util/filterRecoilState";
import { DormFilterState } from "../../recoil/util/dormFilterState";
import { reviewState } from "../../recoil/review/reviewAtoms";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import { useReviewAutoSave } from "../../hooks/useReviewAutoSave";
import { reviewAutoSave, REVIEW_STEPS } from "../../util/reviewAutoSave";
import styles from "../../styles/review/ReviewAdvantage.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import backArrowIcon from "../../assets/image/backArrowIcon.svg";

interface LocationState {
  photos?: string[];
  from?: string;
  advantages?: string[];
  housingType?: string;
}

const ReviewAdvantagePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const { photos, from, advantages, housingType } = locationState || {};

  // 두 가지 필터 모두 가져오기
  const filters = useRecoilValue<FilterCategory[]>(
    housingType === "공인중개사" ? JjinAgencyFilterState : JjinFilterState
  );
  const dormFilters = useRecoilValue<FilterCategory[]>(DormFilterState);
  const [review, setReview] = useRecoilState(reviewState);

  // housingType 우선순위: location.state > review 상태
  const currentHousingType = housingType || review.housingType;

  // 기숙사 유형인지 체크
  const isDormitory = currentHousingType === "기숙사";

  // 건물 유형에 따라 필터 선택
  const currentFilters = isDormitory ? dormFilters : filters;

  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    advantages || review.pros || []
  );
  const maxSelections = 5;
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // 자동 저장 기능 추가
  useReviewAutoSave('filter-ad');

  useEffect(() => {
    // housingType이 location.state에서 왔다면 review 상태에 반영
    if (housingType && housingType !== review.housingType) {
      setReview((prev) => ({
        ...prev,
        housingType: housingType,
      }));
    }

    // 수정 모드일 경우 기존 상태 복원
    if (from === "confirm") {
      setSelectedFilters(review.pros || []);
    }
  }, [from, review, housingType, setReview]);

  // 장점-단점 상반된 태그 매핑 (장점 → 단점)
  const oppositeTagMapping: { [key: string]: string } = {
    // 위치/주변환경
    "교통이 편리해요": "교통이 불편해요",
    "주변 환경이 깨끗해요": "환경이 지저분해요",
    "동네가 조용해요": "동네가 시끄러워요",
    "공원이 가까워요": "공원이 멀어요",
    "생활권이 편리해요": "생활권이 불편해요",
    "학교와 가까워요": "학교와 멀어요",
    "동네가 안전해요": "동네가 안전하지 않아요",
    "이웃들이 친절해요": "이웃들이 불친절해요",
    // 집 내부 상태
    "채광이 좋아요": "채광이 부족해요",
    "통풍이 잘 돼요": "통풍이 안돼요",
    "방음이 잘 돼요": "방음이 안돼요",
    "신축이라 세련됐어요": "집 상태가 낡았어요",
    "곰팡이가 없어요": "곰팡이가 많아요",
    "냉난방이 잘 돼요": "냉난방이 안돼요",
    "배수와 수압이 좋아요": "배수와 수압이 약해요",
    // 편의시설과 관리
    "주차가 편리해요": "주차가 어려워요",
    "엘리베이터가 있어요": "엘리베이터가 없어요",
    "쓰레기 처리가 편해요": "쓰레기 처리가 불편해요",
    "관리비가 합리적이에요": "관리비가 비싸요",
    "인터넷이 잘 돼요": "인터넷이 느려요",
    "관리가 정기적이에요": "관리가 부족해요",
    "이사가 편했어요": "이사가 힘들었어요",
  };

  const handleFilterClick = (label: string) => {
    setSelectedFilters((prev) => {
      let newFilters: string[];

      if (prev.includes(label)) {
        // 이미 선택된 태그를 클릭한 경우 제거
        newFilters = prev.filter((item) => item !== label);
      } else if (prev.length >= maxSelections) {
        // 최대 선택 수에 도달한 경우 알림 표시
        alert("최대 5개까지 선택할 수 있습니다!");
        return prev;
      } else {
        // 상반된 태그가 단점에서 선택되었는지 확인
        const oppositeTag = oppositeTagMapping[label];
        const selectedDisadvantages = review.cons || [];

        if (oppositeTag && selectedDisadvantages.includes(oppositeTag)) {
          alert("같은 항목이 단점으로 선택되었습니다!");
          return prev;
        }

        // 최대 선택 수 미만이고 상반된 태그가 없는 경우 추가
        newFilters = [...prev, label];
      }

      // 실시간으로 review state 업데이트 (자동 저장 트리거)
      setReview((prevReview) => ({
        ...prevReview,
        pros: newFilters,
      }));

      return newFilters;
    });
  };

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (selectedFilters.length < 3) {
      alert("최소 3개의 장점을 선택해 주세요!");
      return;
    }

    const updatedReview = {
      ...review,
      pros: selectedFilters,
      housingType: currentHousingType, // 현재 housingType 보장
    };

    setReview(updatedReview);

    if (from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
          advantages: selectedFilters,
        },
      });
    } else {
      // "다음" 버튼 클릭 시 자동저장에 다음 단계 기록
      reviewAutoSave.save({
        reviewState: updatedReview,
        dormitoryReviewState: null,
        currentStep: REVIEW_STEPS.FILTER_DISAD
      });

      navigate("/review/filter-disad", {
        state: {
          ...location.state,
          advantages: selectedFilters,
        },
      });
    }
  };

  const handleBack = () => {
    if (from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
        },
        replace: true,
      });
    } else {
      // 이전 페이지로 이동 (사진 업로드 페이지로)
      navigate("/review/room-info", {
        state: location.state,
        replace: false,
      });
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
          <h1>
            {currentHousingType === "공인중개사"
              ? "이 공인중개사의 장점은 무엇인가요?"
              : "이 찐빵의 장점은 무엇인가요?"}
          </h1>
          <p className={styles.sub_title}>(최대 {maxSelections}개 선택 가능)</p>
        </header>
        <div className={styles.content} ref={contentRef}>
          {currentFilters.map((category: FilterCategory) => (
            <div className={styles.jjin_filter_wrap} key={category.id}>
              <p className={styles.filter_title}>{category.category}</p>
              <div className={styles.jjin_filter}>
                {category.positiveFilters.map(
                  (item: FilterItem, index: number) => (
                    <button
                      key={index}
                      className={`${styles.filter_btn} ${
                        selectedFilters.includes(item.label)
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => handleFilterClick(item.label)}
                    >
                      <img
                        src={item.icon}
                        alt={item.label}
                        className={styles.filter_icon}
                      />
                      <p className={styles.filter_text}>{item.label}</p>
                    </button>
                  )
                )}
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
            selectedFilters.length > 0 ? styles.enabled : ""
          }`}
          onClick={handleNext}
          disabled={selectedFilters.length === 0}
        >
          다음
        </button>
      </footer>

      {showCancelModal && (
        <CancelModal
          onClose={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
          currentStep="filter-ad"
        />
      )}
    </div>
  );
};

export default ReviewAdvantagePage;
