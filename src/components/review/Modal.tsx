// src/components/review/modal.tsx
import React, { useRef, useEffect } from 'react';
import styles from '../../styles/review/Modal.module.css';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  style?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, style }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    // 스크롤 방지
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // 드래그 관련 상태와 함수
  const startYRef = useRef<number | null>(null);
  const currentYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startYRef.current === null) return;

    currentYRef.current = e.touches[0].clientY;
    const diff = currentYRef.current - startYRef.current;

    // 아래로 스와이프할 때만 모달을 이동
    if (diff > 0) {
      if (modalRef.current) {
        modalRef.current.style.transform = `translateY(${diff}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (startYRef.current === null || currentYRef.current === null) return;

    const diff = currentYRef.current - startYRef.current;

    // 일정 거리 이상 스와이프했으면 모달 닫기
    if (diff > 100) {
      onClose();
    } else {
      // 원래 위치로 돌아가기
      if (modalRef.current) {
        modalRef.current.style.transform = 'translateY(0)';
      }
    }

    startYRef.current = null;
    currentYRef.current = null;
  };

  return (
    <div className={styles.modalOverlay} style={style}>
      <div
        className={styles.container}
        ref={modalRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >

        {children}
      </div>
    </div>
  );
};

export default Modal;