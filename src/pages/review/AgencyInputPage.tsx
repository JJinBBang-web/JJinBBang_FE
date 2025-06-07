import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { reviewState } from "../../recoil/review/reviewAtoms";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import styles from "../../styles/review/FloorInput.module.css";
import closeIcon from "../../assets/image/iconClose.svg";

interface LocationState {
  address: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  from?: string;
}

const AgencyInputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [review, setReview] = useRecoilState(reviewState);
  const { address, from } = (location.state as LocationState) || {};

  const [buildingName, setBuildingName] = useState(
    review.detailedAddress || address?.buildingName || ""
  );


  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    // 수정 모드일 경우 기존 상태 복원
    if (from === "confirm") {
      setBuildingName(review.detailedAddress || "");
      
    }
  }, [from, review]);

  const handleNext = () => {
    if (buildingName) {
      const updatedReview = {
        ...review,
        detailedAddress: buildingName,
      };

      setReview(updatedReview);
      localStorage.setItem("reviewState", JSON.stringify(updatedReview));

      if (from === "confirm") {
        console.log(buildingName);
        navigate("/review/confirm", {
          state: {
            ...location.state,
          },
        });
      } else {
        navigate("/review/result", {
          state: {
            ...location.state,
            buildingName,
          },
        });
      }
    }
  };

  const handleBack = () => {
    if (from === "confirm") {
      navigate("/review/confirm");
    } else {
      navigate(-1);
    }
  };

  const isNextEnabled =
    buildingName.trim() !== "";

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
          <h1>공인중개사의 상호명이 있으면 좋겠어요!</h1>
        </header>
        <div className={styles.inputSection}>
          <label className={styles.label}>상호명</label>
          <input
            type="text"
            className={styles.buildingInput}
            value={buildingName}
            onChange={(e) => setBuildingName(e.target.value.replace(/\s/g, ''))}
            placeholder="예) 찐빵중개사"
          />
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

export default AgencyInputPage;
