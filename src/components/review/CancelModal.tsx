// src/components/review/CancelModal.tsx
import React from "react";
import styles from "../../styles/review/ReviewConfirm.module.css";
import emptyCharacterIcon from "../../assets/image/emptyCharacterIcon.svg";
import { useRecoilState } from "recoil";
import {
  reviewState,
  defaultReviewState,
} from "../../recoil/review/reviewAtoms";
import { dormitoryReviewState } from "../../recoil/review/dormitoryReviewAtoms";
import { reviewAutoSave } from "../../util/reviewAutoSave";

interface CancelModalProps {
  onClose: () => void;
  onConfirm: () => void;
  currentStep?: string; // 현재 페이지의 단계 정보
}

const CancelModal: React.FC<CancelModalProps> = ({
  onClose,
  onConfirm,
  currentStep,
}) => {
  const [review] = useRecoilState(reviewState);
  const [dormitoryReview] = useRecoilState(dormitoryReviewState);

  const handleCancel = async () => {
    // 작성 중단 시 현재까지 작성한 내용을 자동 저장
    try {
      await reviewAutoSave.save({
        reviewState: review,
        dormitoryReviewState: dormitoryReview,
        currentStep: currentStep,
        uuid: reviewAutoSave.load()?.uuid
      });
    } catch (error) {}

    // 저장 후 페이지 이동
    onConfirm();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHandle}></div>
        <div className={styles.cancelModal}>
          <h2 className={styles.modalTitle}>작성을 중단할까요?</h2>
          <p className={styles.modalSubtitle}>
            지금까지 작성해 주신 내용은
            <br /> 임시 저장됩니다!
          </p>
          <img
            src={emptyCharacterIcon}
            alt="비어있는 찐빵 캐릭터"
            className={styles.emptyCharacterIcon}
          />
          <div className={styles.modalButtons}>
            <button className={styles.cancelButton} onClick={onClose}>
              이전
            </button>
            <button className={styles.cm_confirmButton} onClick={handleCancel}>
              중단
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
