import React from 'react';
import baseStyles from '../../styles/review/ReviewConfirm.module.css';
import customStyles from '../../styles/auth/LeaveServiceModal1.module.css';
import emptyCharacterIcon from '../../assets/image/emptyCharacterIcon.svg';

interface LeaveServiceModal1Props {
  isOpen: boolean;
  onClose: () => void;
  onLeave: () => void;
}

const LeaveServiceModal1: React.FC<LeaveServiceModal1Props> = ({
  isOpen,
  onClose,
  onLeave,
}) => {
  if (!isOpen) return null;

  return (
    <div className={baseStyles.modalOverlay} onClick={onClose}>
      <div className={customStyles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={baseStyles.modalHandle}></div>
        <div className={baseStyles.cancelModal}>
          <h2 className={baseStyles.modalTitle}>탈퇴 하시겠어요?</h2>
          <p className={baseStyles.modalSubtitle}>
            저장된 내용은 복구할 수 없어요!<br />
            신중하게 고민해 주세요!
          </p>
          <img
            src={emptyCharacterIcon}
            alt="character"
            className={baseStyles.emptyCharacterIcon}
          />
          <div className={baseStyles.modalButtons}>
            <button className={baseStyles.cancelButton} onClick={onClose}>
              이전
            </button>
            <button className={baseStyles.cm_confirmButton} onClick={onLeave}>
              탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveServiceModal1;