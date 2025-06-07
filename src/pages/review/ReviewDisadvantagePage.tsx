import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  JjinFilterState,
  JjinAgencyFilterState,
  FilterCategory,
  FilterItem,
} from "../../recoil/util/filterRecoilState";
import { reviewState } from "../../recoil/review/reviewAtoms";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import styles from "../../styles/review/ReviewAdvantage.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import backArrowIcon from "../../assets/image/backArrowIcon.svg";

interface LocationState {
  photos?: string[];
  from?: string;
  advantages?: string[];
  disadvantages?: string[];
}

const ReviewDisadvantagePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { housingType } = location.state;
  const { photos, from, advantages, disadvantages } =
    (location.state as LocationState) || {};
  const filters = useRecoilValue<FilterCategory[]>(
    housingType === "공인중개사" ? JjinAgencyFilterState : JjinFilterState
  );
  const [review, setReview] = useRecoilState(reviewState);

  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    disadvantages || review.cons || []
  );
  const maxSelections = 5;
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    // 수정 모드일 경우 기존 상태 복원
    if (from === "confirm") {
      setSelectedFilters(review.cons || []);
    }
  }, [from, review]);

  const handleFilterClick = (label: string) => {
    setSelectedFilters((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : prev.length < maxSelections
        ? [...prev, label]
        : prev
    );
  };

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    const updatedReview = {
      ...review,
      cons: selectedFilters,
    };

    setReview(updatedReview);
    localStorage.setItem("reviewState", JSON.stringify(updatedReview));

    if (from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
          disadvantages: selectedFilters,
        },
      });
    } else {
      navigate("/review/content", {
        state: {
          ...location.state,
          disadvantages: selectedFilters,
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
      });
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
          <h1>
            {" "}
            {housingType === "공인중개사"
              ? "이 공인중개사의 단점은 무엇인가요?"
              : "이 찐빵의 단점은 무엇인가요?"}
          </h1>
          <p className={styles.sub_title}>(최대 {maxSelections}개 선택 가능)</p>
        </header>
        <div className={styles.content} ref={contentRef}>
          {filters.map((category: FilterCategory) => (
            <div className={styles.jjin_filter_wrap} key={category.id}>
              <p className={styles.filter_title}>{category.category}</p>
              <div className={styles.jjin_filter}>
                {category.negativeFilters.map(
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
        />
      )}
    </div>
  );
};

export default ReviewDisadvantagePage;
