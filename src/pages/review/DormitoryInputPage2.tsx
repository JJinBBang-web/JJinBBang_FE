// src/pages/review/DormitoryInputPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";

import { reviewState } from "../../recoil/review/reviewAtoms";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import useReviewStepTracking from "../../hooks/useReviewStepTracking";
import { useReviewAutoSave } from "../../hooks/useReviewAutoSave";
import { reviewAutoSave, REVIEW_STEPS } from "../../util/reviewAutoSave";

import styles from "../../styles/review/DormitoryInputPage.module.css";
import closeIcon from "../../assets/image/iconClose.svg";

interface LocationState {
  address?: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  buildingName?: string;
  roomCapacity?: number;
  floor?: string;
  from?: string;
}

const DormitoryInputPage2: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState) || {};
  const { from } = locationState;

  const [review, setReview] = useRecoilState(reviewState);
  
  const [roomCapacity, setRoomCapacity] = useState<string>(
    review.dormitoryConditions?.roomCapacity ? review.dormitoryConditions?.roomCapacity.toString() : ""
  );
  const [selectedFloor, setSelectedFloor] = useState<string>(
    review.floorType || "저층"
  );

  useReviewStepTracking("3-2.1_dormitory_input");

  // 자동 저장 기능 추가
  useReviewAutoSave('dormitory');

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // 페이지 진입 시 currentStep만 업데이트 (reviewState 덮어쓰기 방지)
  useEffect(() => {
    reviewAutoSave.updateCurrentStepOnNext(REVIEW_STEPS.DORMITORY);
  }, []);

  useEffect(() => {
    // confirm에서 돌아온 경우 값 복원
    if (from === "confirm") {

      const capFromState =
        locationState.roomCapacity ??
        (locationState as any).dormitoryData?.roomCapacity;

      const floorFromState =
        (locationState as any).dormitoryData?.floorType ??
        locationState.floor;

      setRoomCapacity(
      capFromState !== undefined && capFromState !== null
        ? String(capFromState)
        : review.dormitoryConditions?.roomCapacity !== undefined && review.dormitoryConditions?.roomCapacity !== null
          ? String(review.dormitoryConditions.roomCapacity)
          : ""
      );
      setSelectedFloor(
        floorFromState ??
        review.floorType ??
        "저층"
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setRoomCapacity(value);
  };

  const handleFloorSelect = (floor: string) => {
    setSelectedFloor(floor);
  };

  const proceedToNextStep = async () => {
    const capNum = roomCapacity.trim() === "" ? undefined : Number(roomCapacity);

    const updatedReview = {
      ...review,
      dormitoryConditions: {
        ...(review.dormitoryConditions ?? {
          hasDistanceCriteria: false,
          hasGradeCriteria: false,
          dormitoryFee: 0,
        }),
        roomCapacity: capNum,
      },
      floorType: selectedFloor,
    };

    setReview(updatedReview);

    // 다음 페이지로 이동 전 자동 저장 (다음 step으로)
    await reviewAutoSave.save({
      reviewState: updatedReview,
      dormitoryReviewState: null,
      currentStep: REVIEW_STEPS.DORMITORY_CONDITIONS,
      uuid: reviewAutoSave.load()?.uuid,
    });

    const nextState = {
      ...location.state,
      roomCapacity: capNum,
      floor: selectedFloor,
    };

    if (from === "confirm") {
      navigate("/review/confirm", { state: nextState });
    } else {
      navigate("/review/dormitory-conditions", { state: nextState });
    }
  };
  
  const handleNext = () => {
    // 간단 검증
    if (roomCapacity.trim() === "") {
        alert("방 인원을 입력해주세요.");
        return;
    }
    proceedToNextStep();
  };

  const handleBack = () => {
    if (from === "confirm") navigate("/review/confirm");
    else navigate(-1);
  };

  const isNextEnabled = roomCapacity !== "" && selectedFloor !== "";

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
          <h1>방 인원과 층수를 알려주세요!</h1>
        </header>

        <div className={styles.inputSection}>
          <label className={styles.label}>방 인원</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.buildingInput}
              value={roomCapacity}
              onChange={handleInputChange}
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
                selectedFloor === "저층" ? styles.selected : ""
              }`}
              onClick={() => handleFloorSelect("저층")}
              type="button"
            >
              저층
            </button>
            <button
              className={`${styles.floorButton} ${
                selectedFloor === "중층" ? styles.selected : ""
              }`}
              onClick={() => handleFloorSelect("중층")}
              type="button"
            >
              중층
            </button>
            <button
              className={`${styles.floorButton} ${
                selectedFloor === "고층" ? styles.selected : ""
              }`}
              onClick={() => handleFloorSelect("고층")}
              type="button"
            >
              고층
            </button>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={handleBack}>
          이전
        </button>
        <button
          className={`${styles.nextButton} ${isNextEnabled ? styles.enabled : ""}`}
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

export default DormitoryInputPage2;
