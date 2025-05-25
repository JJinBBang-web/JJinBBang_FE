import React, { ReactNode, useEffect } from 'react';
import styles from '../../styles/review/Modal.module.css';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;  
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  useEffect(() => {
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.container}>
        <div className={styles.handle}></div>
        {children}
      </div>
    </div>
  );
};

export default Modal;