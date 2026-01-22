import React, { useState } from 'react';
import baseStyles from '../../MyPage/components/TermsAgreementModal.module.css';
import customStyles from './LeaveServiceModal2.module.css';
import checkIcon from '../../assets/image/checkIcon.svg';
import checkIconActive from '../../assets/image/checkIconActive.svg';

interface LeaveServiceModal2Props {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const LeaveServiceModal2: React.FC<LeaveServiceModal2Props> = ({
  isOpen,
  onConfirm,
  onClose,
}) => {
  const [checkedReasons, setCheckedReasons] = useState<boolean[]>([
    false, false, false, false, false, false
  ]);

  const reasons = [
    '대체 서비스로 이동',
    '개인정보/보안 우려',
    '알림/마케팅 메시지가 많음',
    '일시 사용 중단을 위해',
    '사용 빈도가 낮음',
    '이용이 불편하고 장애가 많음'
  ];

  const toggleReason = (index: number) => {
    const newChecked = [...checkedReasons];
    newChecked[index] = !newChecked[index];
    setCheckedReasons(newChecked);
  };

  const hasSelectedReasons = checkedReasons.some(checked => checked);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={baseStyles.overlay} onClick={handleOverlayClick}>
      <div className={customStyles.container}>
        <div className={baseStyles.handleContainer}>
          <div className={baseStyles.modalHandle}></div>
        </div>
        
        <p className={baseStyles.title}>탈퇴하시는 이유가 궁금해요!</p>
        <p className={baseStyles.description}>
          발전할 찐빵을 위해 마지막으로 부탁드려요!
        </p>
        
        <div className={baseStyles.termsList}>
          {reasons.map((reason, index) => (
            <button key={index} className={customStyles.termItem} onClick={() => toggleReason(index)}>
              <img
                src={checkedReasons[index] ? checkIconActive : checkIcon}
                alt="check"
                className={customStyles.checkIcon}
              />
              <span>{reason}</span>
            </button>
          ))}
        </div>
        
        <button
          className={`${customStyles.confirmButton} ${hasSelectedReasons ? customStyles.active : ''}`}
          onClick={hasSelectedReasons ? onConfirm : undefined}
          disabled={!hasSelectedReasons}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default LeaveServiceModal2;