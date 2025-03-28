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
      title: '만 14세 이상이에요',
      required: true,
      checked: false,
    },
    {
      id: 'service',
      title: '찐빵 서비스 이용약관 동의',
      required: true,
      checked: false,
    },
    {
      id: 'privacy',
      title: '개인정보 수집 및 이용 동의',
      required: true,
      checked: false,
    },
  ]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  // 필수 약관 체크 여부 확인
  const isAllRequiredChecked = terms.every((term) =>
    term.required ? term.checked : true
  );

  // 필수 약관 모두 체크되면 모두 동의도 체크
  useEffect(() => {
    if (isAllRequiredChecked && !terms[0].checked) {
      setTerms((prevTerms) => {
        const newTerms = [...prevTerms];
        newTerms[0].checked = true;
        return newTerms;
      });
      setIsAllChecked(true);
    }
  }, [isAllRequiredChecked]);

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

      // 필수 약관이 모두 체크되었는지 확인
      const allRequiredChecked = newTerms
        .slice(1)
        .every((term) => term.checked);
      setIsAllChecked(allRequiredChecked);
    }
  };

  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.container}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.handleContainer}>
          <div className={styles.modalHandle}></div>
        </div>
        <p className={styles.title}>약관에 동의해주세요</p>
        <p className={styles.description}>
          찐빵이가 개인정보와 서비스 이용 권리 <br /> 잘 지켜줄게요!
        </p>
        <div className={styles.termsList}>
          <button
            key={terms[0].id}
            className={styles.termItem}
            onClick={() => handleTermCheck(terms[0].id)}
          >
            <img
              src={terms[0].checked ? checkIconActive : checkIcon}
              alt="check"
              className={styles.checkIcon}
            />
            <span>{terms[0].title}</span>
          </button>

          <div className={styles.separator}></div>

          {terms.slice(1).map((term) => (
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
              <span>
                <span style={{ color: 'var(--color-gray80)' }}>(필수)</span>
                <span
                  style={{ display: 'inline-block', width: '0.5rem' }}
                ></span>
                {term.title}
              </span>
              <img src={arrowIcon} alt="arrow" className={styles.arrowIcon} />
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
