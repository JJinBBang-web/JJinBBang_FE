// src/components/review/CancelModal.tsx
import React from "react";
import styles from "../../styles/review/ReviewConfirm.module.css";
import emptyCharacterIcon from "../../assets/image/emptyCharacterIcon.svg";
import { useRecoilState } from "recoil";
import {
  reviewState,
  defaultReviewState,
} from "../../recoil/review/reviewAtoms";

interface CancelModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ onClose, onConfirm }) => {
  const [review, setReview] = useRecoilState(reviewState);

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
            <br /> 저장되지 않아요!
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
            <button
              className={styles.cm_confirmButton}
              onClick={() => {
                setReview(defaultReviewState);
                onConfirm(); 
              }}
            >
              중단
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
