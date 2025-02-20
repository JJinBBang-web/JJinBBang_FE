// src/components/auth/TermsAgreementModal.tsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/auth/TermsAgreementModal.module.css';
import arrowIcon from '../../assets/image/arrowIcon.svg';
import checkIcon from '../../assets/image/checkIcon.svg';
import checkIconActive from '../../assets/image/checkIconActive.svg';

interface Term {
  id: string;
  title: string;
  required: boolean;
  checked: boolean;
}

interface TermsAgreementModalProps {
  onClose: () => void;
  onComplete: () => void;
}

const TermsAgreementModal: React.FC<TermsAgreementModalProps> = ({
  onClose,
  onComplete,
}) => {
  const [terms, setTerms] = useState<Term[]>([
    { id: 'all', title: '모두 동의', required: false, checked: false },
    {
      id: 'age',
      title: '(필수) 만 14세 이상이에요',
      required: true,
      checked: false,
    },
    {
      id: 'service',
      title: '(필수) 찐빵 서비스 이용약관 동의',
      required: true,
      checked: false,
    },
    {
      id: 'privacy',
      title: '(필수) 개인정보 수집 및 이용 동의',
      required: true,
      checked: false,
    },
  ]);

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    if (currentY - startY > 100) {
      onClose();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTermCheck = (termId: string) => {
    if (termId === 'all') {
      const newCheckedState = !isAllChecked;
      setIsAllChecked(newCheckedState);
      setTerms(
        terms.map((term) => ({
          ...term,
          checked: newCheckedState,
        }))
      );
    } else {
      const newTerms = terms.map((term) =>
        term.id === termId ? { ...term, checked: !term.checked } : term
      );
      setTerms(newTerms);
      setIsAllChecked(newTerms.slice(1).every((term) => term.checked));
    }
  };

  const isAllRequiredChecked = terms.every((term) =>
    term.required ? term.checked : true
  );

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.slideBar} />
        <h1>약관에 동의해주세요</h1>
        <p className={styles.description}>
          찐빵이가 개인정보와 서비스 이용 권리 잘 지켜줄게요!
        </p>

        <div className={styles.termsList}>
          {terms.map((term) => (
            <button
              key={term.id}
              className={styles.termItem}
              onClick={() => handleTermCheck(term.id)}
            >
              <img
                src={term.checked ? checkIconActive : checkIcon}
                alt="check"
                className={styles.checkIcon}
              />
              <span>{term.title}</span>
              {term.id !== 'all' && (
                <img src={arrowIcon} alt="arrow" className={styles.arrowIcon} />
              )}
            </button>
          ))}
        </div>

        <button
          className={`${styles.confirmButton} ${
            isAllRequiredChecked ? styles.active : ''
          }`}
          onClick={isAllRequiredChecked ? onComplete : undefined}
          disabled={!isAllRequiredChecked}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default TermsAgreementModal;
