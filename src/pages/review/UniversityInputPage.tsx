import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/review/FloorInput.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { reviewState } from "../../recoil/review/reviewAtoms";
import UniversityCard from "../../components/review/UniversityCard";
import { useCampusSearch } from "../../hooks/useCampusSearch";
import { useCancelModal } from "../../util/useCancelModal";
import CancelModal from "../../components/review/CancelModal";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lottie/loading.json";
import bigSearchIcon from "../../assets/image/bigSearchIcon.svg";
import { reviewAutoSave, REVIEW_STEPS } from "../../util/reviewAutoSave";

interface LocationState {
  address: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  university: string;
  from?: string;
}

function useDebounce<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

const UniversityInputPage:React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [review, setReview] = useRecoilState(reviewState);
  const { university, address, from } = (location.state as LocationState) || {};

  const [campusName, setCampusName] = useState(
      review.universityName || university || ""
  );

  const [selectedCampusId, setSelectedCampusId] = useState<number | null>(null);
  const debouncedQuery = useDebounce(campusName, 250);

  const search = useCampusSearch({
    query: debouncedQuery,
    limit: 15,
    offset: 0,
    enabled: true,
  });

  const items = search.data?.items ?? [];

  const {
      showCancelModal,
      handleCloseButtonClick,
      handleCancelModalClose,
      handleConfirmCancel,
    } = useCancelModal();

  // 페이지 진입 시 currentStep 저장
  useEffect(() => {
    reviewAutoSave.save({
      reviewState: review,
      dormitoryReviewState: null,
      currentStep: REVIEW_STEPS.UNIVERSITY_INPUT,
      uuid: reviewAutoSave.load()?.uuid,
    });
  }, []);

  useEffect(() => {
    setSelectedCampusId(null);
  }, [debouncedQuery]);

  const selectedItem = useMemo(
    () => items.find((it) => it.campusId === selectedCampusId) ?? null,
    [items, selectedCampusId]
  );

  const handleBack = () => {
    if (from === "confirm") {
      navigate("/review/confirm", {
        state: {
          ...location.state,
        },
      });
    } else {
      navigate("/review/type", {
        state: {
          ...location.state,
        },
      });
    }
  };

  const handleNext = () => {
    if (!selectedItem) return;

    const updatedReview = {
        ...review,
        campusId: selectedItem.campusId,
        universityName: selectedItem.fullName,
    };

    setReview(updatedReview);

    // 다음 페이지로 이동 전 자동 저장 (다음 step으로)
    reviewAutoSave.save({
      reviewState: updatedReview,
      dormitoryReviewState: null,
      currentStep: REVIEW_STEPS.DORMITORY_SELECT,
      uuid: reviewAutoSave.load()?.uuid,
    });

    const nextState = {
        ...location.state,
        campusId: selectedItem.campusId,
    };

    navigate("/review/dormitory-select", {
    state: nextState
    });
  };

  const nextEnabled = !!selectedItem;

  return (
    <div
      className="content"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <div
        className={styles.container}
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{width:"28%"}}></div>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
          <h1>대학명을 입력해주세요</h1>
        </header>
        <div className={styles.inputSection}>
          <input
            type="text"
            className={styles.buildingInput}
            value={campusName}
            onChange={(e) => setCampusName(e.target.value)}
            placeholder="예) 찐빵대학교"
          />
        </div>

        {/* 검색에 따라서 결과 나오게 */}
        <div style={{ flex: 1, overflow: "auto", padding: "2px" }}>
          {/* 로딩 */}
          {search.isFetching && (
              <div
                style={{
                  padding: "6.5rem 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection:"column",
                  gap: "32px",
                }}
              >
                <div className={styles.lottiesImg}>
                  <Lottie
                    animationData={loadingAnimation}
                    loop
                    autoplay
                    style={{ width:70 }}
                />
                <img src={bigSearchIcon} className={styles.bigSearchIcon}/>
                </div>
                <p className={styles.loadingText}>검색중이에요<br/>잠시만 기다려주세요!</p>
              </div>
          )}

          {/* 에러 */}
          {search.isError && (
            <div style={{ padding: "8px 0", fontSize: 13, color: "#ff3b30" }}>
              검색에 실패했어요. 잠시 후 다시 시도해주세요.
            </div>
          )}

          {/* 검색어가 있고 결과가 없을 때 */}
          {!search.isFetching &&
            debouncedQuery.replace(/\s+/g, "").length > 0 &&
            items.length === 0 && (
              <div style={{ padding: "12px 0", fontSize: 13, color: "#777" }}>
                검색 결과가 없어요.
              </div>        
            )}

          {/* 리스트 */}
          <div style={{ display: "grid"}}>
            {items.map((it) => (
              <>
              <UniversityCard
                key={it.campusId}
                fullName={it.fullName}
                campusAddress={it.campusAddress}
                query={campusName}
                selected={it.campusId === selectedCampusId}
                onClick={() => setSelectedCampusId(it.campusId)}
              />
              <hr style={{ width: "100%", border:"none", height: "1px", backgroundColor:"var(--color-gray10)", margin:"0"}}/>
              </>
            ))}
          </div>
        </div>

        <div className={styles.buttonContainer}>
            <button className={styles.prevButton} onClick={handleBack}>
                이전
            </button>
            <button
                className={`${styles.nextButton} ${nextEnabled ? styles.enabled : ""}`}
                onClick={handleNext}
                disabled={!nextEnabled}
            >
                다음
            </button>
        </div>
      </div>
      {showCancelModal && (
        <CancelModal
          onClose={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  )
};

export default UniversityInputPage; 