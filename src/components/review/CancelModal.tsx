// src/components/review/CancelModal.tsx
import React from 'react';
import styles from '../../styles/review/ReviewConfirm.module.css';
import emptyCharacterIcon from '../../assets/image/emptyCharacterIcon.svg';

interface CancelModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ onClose, onConfirm }) => {
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
            <button className={styles.confirmButton} onClick={onConfirm}>
              중단
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
