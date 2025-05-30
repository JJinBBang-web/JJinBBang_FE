// src/components/review/DormitoryUniversityModal.tsx
import React, { useState } from 'react';
import styles from './DormitoryUniversityModal.module.css';
import iconClose from '../../assets/image/iconClose.svg';
import gnuCampus1 from '../../assets/image/campusImg1.svg';
import etcCampus from '../../assets/image/campusImg2.svg';

interface University {
  id: number;
  universityName: string;
  campus: string;
  initial: string;
  logoImageUrl: string;
}

interface DormitoryUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUniversitySelect: (university: string) => void;
}

const INITIAL_LIST = [
  'ㄱ',
  'ㄴ',
  'ㄷ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅅ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

// 대학교 데이터 (로컬 데이터 사용)
const universityData: University[] = [
  {
    id: 1,
    universityName: '경상국립대학교',
    campus: '가좌캠퍼스',
    initial: 'ㄱ',
    logoImageUrl: gnuCampus1,
  },
  {
    id: 2,
    universityName: '경상국립대학교',
    campus: '칠암캠퍼스',
    initial: 'ㄱ',
    logoImageUrl: gnuCampus1,
  },
  {
    id: 3,
    universityName: '경상국립대학교',
    campus: '통영캠퍼스',
    initial: 'ㄱ',
    logoImageUrl: gnuCampus1,
  },
  {
    id: 4,
    universityName: '서울대학교',
    campus: '준호네캠퍼스',
    initial: 'ㅅ',
    logoImageUrl: etcCampus,
  },
  {
    id: 5,
    universityName: '성신여자대학교',
    campus: '다희네캠퍼스',
    initial: 'ㅅ',
    logoImageUrl: etcCampus,
  },
  {
    id: 6,
    universityName: '서울과학기술대학교',
    campus: '유찬네캠퍼스',
    initial: 'ㅅ',
    logoImageUrl: etcCampus,
  },
  {
    id: 7,
    universityName: '고려대학교',
    campus: '서울캠퍼스',
    initial: 'ㄱ',
    logoImageUrl: etcCampus,
  },
  {
    id: 8,
    universityName: '고려대학교',
    campus: '세종캠퍼스',
    initial: 'ㄱ',
    logoImageUrl: etcCampus,
  },
  {
    id: 9,
    universityName: '단국대학교',
    campus: '천안캠퍼스',
    initial: 'ㄷ',
    logoImageUrl: etcCampus,
  },
  {
    id: 10,
    universityName: '단국대학교',
    campus: '서울캠퍼스',
    initial: 'ㄷ',
    logoImageUrl: etcCampus,
  },
];

const DormitoryUniversityModal: React.FC<DormitoryUniversityModalProps> = ({
  isOpen,
  onClose,
  onUniversitySelect,
}) => {
  const [selectedInitial, setSelectedInitial] = useState<string>('ㄱ');
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

  // 모달이 닫혀있을 때 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // 초성활성화 조건
  const activeInitials = new Set(universityData.map((uni) => uni.initial));

  // 대학교 필터링
  const filteredUniversities = universityData.filter(
    (uni) => uni.initial === selectedInitial
  );

  const handleInitialSelect = (initial: string) => {
    if (activeInitials.has(initial)) {
      setSelectedInitial(initial);
      setSelectedUniversity(null); // 초성 변경 시 선택된 대학교 초기화
    }
  };

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
  };

  const handleReset = () => {
    setSelectedInitial('ㄱ');
    setSelectedUniversity(null);
  };

  const handleConfirm = () => {
    if (selectedUniversity) {
      onUniversitySelect(
        `${selectedUniversity.universityName} ${selectedUniversity.campus}`
      );
    }
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.handleBar}></div>
          <h2 className={styles.modalTitle}>대학교</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <img src={iconClose} alt="닫기" />
          </button>
        </div>

        <div className={styles.content}>
          {/* 초성 선택 */}
          <div className={styles.initialContainer}>
            {INITIAL_LIST.map((initial) => {
              const isActive = activeInitials.has(initial);
              const isSelected = selectedInitial === initial;

              return (
                <button
                  key={initial}
                  className={
                    isSelected
                      ? styles.selected_initial_btn
                      : isActive
                      ? styles.unselected_initial_btn
                      : styles.initial_btn
                  }
                  onClick={() => handleInitialSelect(initial)}
                  disabled={!isActive}
                >
                  {initial}
                </button>
              );
            })}
          </div>

          {/* 대학교 선택 */}
          <div className={styles.universityContainer}>
            {filteredUniversities.map((uni) => (
              <button
                key={uni.id}
                className={`${styles.uni_btn} ${
                  selectedUniversity?.id === uni.id
                    ? styles.selected_uni_btn
                    : ''
                }`}
                onClick={() => handleUniversitySelect(uni)}
              >
                <img src={uni.logoImageUrl} alt={uni.universityName} />
                <p
                  className={`${styles.uni_title} ${
                    selectedUniversity?.id === uni.id
                      ? styles.selected_text
                      : ''
                  }`}
                >
                  {uni.universityName}
                </p>
                <p
                  className={`${styles.uni_campus} ${
                    selectedUniversity?.id === uni.id
                      ? styles.selected_text
                      : ''
                  }`}
                >
                  {uni.campus}
                </p>
              </button>
            ))}
          </div>

          <div className={styles.btn_content}>
            <button
              className={`${styles.reset_btn} ${
                selectedUniversity !== null ? styles.reset_btn_active : ''
              }`}
              onClick={handleReset}
            >
              초기화
            </button>
            <button
              className={`${styles.confirm_btn} ${
                selectedUniversity !== null ? styles.confirm_btn_active : ''
              }`}
              onClick={handleConfirm}
              disabled={selectedUniversity === null}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DormitoryUniversityModal;
