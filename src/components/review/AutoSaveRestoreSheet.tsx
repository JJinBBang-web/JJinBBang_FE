// src/components/review/AutoSaveRestoreSheet.tsx
import React from "react";
import styles from "./AutoSaveRestoreSheet.module.css";
import emptyCharacterIcon from "../../assets/image/emptyCharacterIcon.svg";

interface AutoSaveRestoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onNewStart: () => void;
}

const AutoSaveRestoreSheet: React.FC<AutoSaveRestoreSheetProps> = ({
  isOpen,
  onClose,
  onContinue,
  onNewStart,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.sheet_header}>
          <div className={styles.header_divider}></div>
        </div>
        <div className={styles.sheet_title_wrap}>
          <div className={styles.sheet_info_wrap}>
            <p className={styles.sheet_title}></p>
          </div>
        </div>
        <div className={styles.content_wrap}>
          <h2 className={styles.main_title}>임시 저장된 후기가 있어요!</h2>
          <p className={styles.sub_title}>
            이어서 후기를 작성하시겠어요?
            <br />
            작성이 완료되면 임시저장 게시물은 사라집니다.
          </p>
          <div className={styles.character_wrap}>
            <img
              src={emptyCharacterIcon}
              alt="캐릭터"
              className={styles.character}
            />
          </div>
        </div>
        <div className={styles.button_wrap}>
          <button className={styles.new_start_button} onClick={onNewStart}>
            새롭게 작성
          </button>
          <button className={styles.continue_button} onClick={onContinue}>
            이어서 작성
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoSaveRestoreSheet;
