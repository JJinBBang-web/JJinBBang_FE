// src/pages/review/PhotoUploadPage.tsx
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
import styles from '../../styles/review/PhotoUpload.module.css';
import closeIcon from '../../assets/image/iconClose.svg';
import plusIcon from '../../assets/image/iconPlus.svg';
import closeImageIcon from '../../assets/image/closeImageIcon.svg';

// 위치 상태 인터페이스 정의 (라우팅을 통해 전달되는 데이터 구조)
interface LocationState {
  address: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
  };
  buildingName: string;
  floor: string;
  paymentType: string;
  priceData: any;
  roomData: any;
}

const PhotoUploadPage: React.FC = () => {
  // 네비게이션 및 라우팅 관련 훅
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  // 업로드된 사진들의 상태 관리
  const [photos, setPhotos] = useState<string[]>([]);
  // 파일 입력 참조를 위한 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 취소 모달 관련 커스텀 훅
  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  // 사진 추가 핸들러 - 파일 입력 요소 클릭
  const handleAddPhoto = () => {
    // 파일 입력 요소 클릭 트리거
    fileInputRef.current?.click();
  };

  // 파일 변경 핸들러 - 이미지 미리보기 생성
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 새 이미지 파일들을 미리보기 URL로 변환
    const newPhotos = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    // 기존 사진과 새 사진을 합쳐서 최대 20개까지만 저장
    setPhotos((prev) => {
      const combined = [...prev, ...newPhotos];
      return combined.slice(0, 20);
    });

    // 파일 입력을 초기화해서 같은 파일을 다시 선택할 수 있게 함
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 개별 사진 제거 핸들러
  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // 다음 페이지로 이동 핸들러 - 현재 선택된 사진들과 함께 상태 전달
  const handleNext = () => {
    navigate('/review/filter-ad', {
      state: {
        ...locationState,
        photos,
      },
    });
  };

  // 최소 2장의 사진이 있어야 다음 버튼 활성화
  const isNextEnabled = photos.length >= 2;

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
          <h1>직접 촬영한 찐거주 사진을 올려주세요!</h1>
        </header>

        <div className={styles.subtitle}>
          찐거주 사진 &nbsp;
          <span>(2장 이상)</span>
        </div>

        <div className={styles.scrollContainer}>
          <div className={styles.photoGrid}>
            {/* 업로드된 사진들 렌더링 */}
            {photos.map((photo, index) => (
              <div key={index} className={styles.photoItem}>
                <img
                  src={photo}
                  alt={`uploaded ${index}`}
                  className={styles.photo}
                />
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemovePhoto(index)}
                >
                  <img src={closeImageIcon} alt="remove" />
                </button>
              </div>
            ))}

            {/* 사진 추가 버튼 (최대 20장까지) */}
            {photos.length < 20 && (
              <div className={styles.addPhotoBox} onClick={handleAddPhoto}>
                <img src={plusIcon} alt="add" className={styles.plusIcon} />
              </div>
            )}

            {/* 숨겨진 파일 입력 */}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          {/* 현재 업로드된 사진 수 표시 */}
          <div className={styles.photoCount}>{photos.length}/20장</div>
        </div>
      </div>

      <footer className={styles.footer}>
        {/* 이전 페이지로 돌아가기 버튼 */}
        <button className={styles.prevButton} onClick={() => navigate(-1)}>
          이전
        </button>
        {/* 다음 페이지로 이동 버튼 (최소 2장 이상 선택 시 활성화) */}
        <button
          className={`${styles.nextButton} ${
            isNextEnabled ? styles.enabled : ''
          }`}
          onClick={handleNext}
          disabled={!isNextEnabled}
        >
          다음
        </button>
      </footer>

      {/* 취소 모달 */}
      {showCancelModal && (
        <CancelModal
          onClose={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
};

export default PhotoUploadPage;
