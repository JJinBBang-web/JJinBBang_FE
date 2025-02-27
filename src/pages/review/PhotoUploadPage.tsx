// src/pages/review/PhotoUploadPage.tsx
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/review/PhotoUpload.module.css';
import closeIcon from '../../assets/image/iconClose.svg';
import plusIcon from '../../assets/image/iconPlus.svg';
import closeImageIcon from '../../assets/image/closeImageIcon.svg';

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
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

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

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

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
            onClick={() => navigate('/mypage')}
          >
            <img src={closeIcon} alt="close" />
          </button>
        </header>

        <h1 className={styles.title}>직접 촬영한 찐거주 사진을 올려주세요!</h1>

        <div className={styles.subtitle}>찐거주 사진 (2장 이상)</div>

        <div className={styles.photoGrid}>
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

          {photos.length < 20 && (
            <div className={styles.addPhotoBox} onClick={handleAddPhoto}>
              <img src={plusIcon} alt="add" className={styles.plusIcon} />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className={styles.photoCount}>{photos.length}/20장</div>
      </div>

      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={() => navigate(-1)}>
          이전
        </button>
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
    </div>
  );
};

export default PhotoUploadPage;
