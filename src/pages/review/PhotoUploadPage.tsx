// src/pages/review/PhotoUploadPage.tsx
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
import { imageUploadAPI } from '../../api/imageUpload';
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
  const { housingType } = location.state;
  const locationState = location.state as LocationState;

  // 업로드된 사진들의 상태 관리 (CDN URLs)
  const [photos, setPhotos] = useState<string[]>([]);
  // 업로드 중인 파일들의 preview URLs (blob URLs)
  const [previewPhotos, setPreviewPhotos] = useState<string[]>([]);
  // 업로드 상태 관리
  const [uploading, setUploading] = useState<boolean>(false);
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

  // 파일 변경 핸들러 - 업로드 시도 후 실패 시 blob URL 사용
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 현재 사진 개수와 새로 추가할 파일 개수 확인
    const totalPhotos = photos.length + previewPhotos.length + files.length;
    if (totalPhotos > 20) {
      alert('사진은 최대 20장까지 업로드할 수 있습니다.');
      return;
    }

    try {
      setUploading(true);

      // 미리보기 URL 생성
      const newPreviewUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      // 미리보기 추가
      setPreviewPhotos((prev) => [...prev, ...newPreviewUrls]);

      try {
        // 실제 파일 업로드 시도 (S3 또는 legacy)
        const uploadedUrls = await imageUploadAPI.uploadImages(Array.from(files), 'review');

        // 업로드 완료 후 실제 URL로 교체
        setPhotos((prev) => [...prev, ...uploadedUrls]);
        
        // 미리보기 제거
        setPreviewPhotos((prev) => 
          prev.filter(url => !newPreviewUrls.includes(url))
        );

      } catch (uploadError) {
        console.warn('Upload failed, using blob URLs as fallback:', uploadError);
        
        // 업로드 실패 시 blob URL을 그대로 사용 (기존 방식)
        setPhotos((prev) => [...prev, ...newPreviewUrls]);
        
        // 미리보기에서 제거
        setPreviewPhotos((prev) => 
          prev.filter(url => !newPreviewUrls.includes(url))
        );

        // 사용자에게 알림 (선택적)
        console.log('Using local image preview. Images will be uploaded when submitting the review.');
      }

    } catch (error) {
      console.error('File processing failed:', error);
      alert('파일 처리에 실패했습니다. 다시 시도해 주세요.');
      
      // 실패한 미리보기 제거
      const newPreviewUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewPhotos((prev) => 
        prev.filter(url => !newPreviewUrls.includes(url))
      );
    } finally {
      setUploading(false);
    }

    // 파일 입력을 초기화해서 같은 파일을 다시 선택할 수 있게 함
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 개별 사진 제거 핸들러
  const handleRemovePhoto = (index: number, isPreview: boolean = false) => {
    if (isPreview) {
      setPreviewPhotos((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPhotos((prev) => prev.filter((_, i) => i !== index));
    }
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

  // 최소 2장의 사진이 있어야 다음 버튼 활성화 (업로드 중일 때는 비활성화)
  const isNextEnabled = (photos.length >= 2 || (housingType === '공인중개사')) && !uploading;
  
  // 전체 사진 개수 (업로드된 사진 + 미리보기 사진)
  const totalPhotoCount = photos.length + previewPhotos.length;


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
          <h1>
            {housingType === "공인중개사"
              ? "사진이 있다면 첨부해 주세요!"
              : "직접 촬영한 찐거주 사진을 올려주세요!"}
          </h1>
        </header>

        <div className={styles.subtitle}>
          {housingType === "공인중개사"
            ? "현장 사진 등 어떤 정보든 좋아요!"
            : "찐거주 사진"}
          &nbsp;
          <span>{housingType === "공인중개사" ? "(필수 항목 아님)" : "(2장 이상)"}</span>
        </div>

        <div className={styles.scrollContainer}>
          <div className={styles.photoGrid}>
            {/* 업로드된 사진들 렌더링 */}
            {photos.map((photo, index) => (
              <div key={`uploaded-${index}`} className={styles.photoItem}>
                <img
                  src={photo}
                  alt={`uploaded ${index}`}
                  className={styles.photo}
                />
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemovePhoto(index, false)}
                  disabled={uploading}
                >
                  <img src={closeImageIcon} alt="remove" />
                </button>
              </div>
            ))}

            {/* 업로드 중인 사진들 미리보기 렌더링 */}
            {previewPhotos.map((photo, index) => (
              <div key={`preview-${index}`} className={`${styles.photoItem} ${styles.uploading}`}>
                <img
                  src={photo}
                  alt={`uploading ${index}`}
                  className={styles.photo}
                />
                <div className={styles.uploadingOverlay}>
                  <div className={styles.loadingSpinner}></div>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemovePhoto(index, true)}
                  disabled={uploading}
                >
                  <img src={closeImageIcon} alt="remove" />
                </button>
              </div>
            ))}

            {/* 사진 추가 버튼 (최대 20장까지, 업로드 중이 아닐 때만) */}
            {totalPhotoCount < 20 && !uploading && (
              <div className={styles.addPhotoBox} onClick={handleAddPhoto}>
                <img src={plusIcon} alt="add" className={styles.plusIcon} />
              </div>
            )}

            {/* 업로드 중일 때 로딩 표시 */}
            {uploading && totalPhotoCount >= 20 && (
              <div className={styles.uploadingMessage}>
                업로드 중입니다...
              </div>
            )}

            {/* 숨겨진 파일 입력 */}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </div>
          {/* 현재 업로드된 사진 수 표시 */}
          <div className={styles.photoCount}>
            {totalPhotoCount}/20장
            {uploading && <span className={styles.uploadingText}> (업로드 중...)</span>}
          </div>
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
            isNextEnabled ? styles.enabled : ""
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
