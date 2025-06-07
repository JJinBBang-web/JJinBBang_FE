// src/util/useCancelModal.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCancelModal = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();

  const handleCloseButtonClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  const handleConfirmCancel = () => {
    navigate('/mypage');
  };

  return {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  };
};
