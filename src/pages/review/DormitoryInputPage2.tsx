// src/pages/review/DormitoryInputPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";

import { reviewState } from "../../recoil/review/reviewAtoms";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import useReviewStepTracking from "../../hooks/useReviewStepTracking";

import styles from "../../styles/review/DormitoryInputPage.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import { floor } from "lodash";

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
    review.roomCapacity ? review.roomCapacity.toString() : ""
  );
  const [selectedFloor, setSelectedFloor] = useState<string>(
    review.floorType || "저층"
  );

  useReviewStepTracking("3-2.1_dormitory_input");

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

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
        : review.roomCapacity !== undefined && review.roomCapacity !== null
          ? String(review.roomCapacity)
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

  const proceedToNextStep = () => {
    // ReviewState에 저장
    setReview((prev) => ({
      ...prev,
      roomCapacity: Number(roomCapacity),
      floorType: selectedFloor,
    }));

    const dormitoryData = {
      roomCapacity: Number(roomCapacity),
      floorType: selectedFloor,
    };

    // 기존 흐름 유지: confirm이면 confirm으로, 아니면 다음 단계로
    if (from === "confirm") {
      navigate("/review/confirm", {
        state: { ...location.state, roomCapacity: Number(roomCapacity), floor: selectedFloor },
      });
    } else {
      navigate("/review/dormitory-conditions", {
        state: { ...location.state, roomCapacity: Number(roomCapacity), floor: selectedFloor },
      });
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
