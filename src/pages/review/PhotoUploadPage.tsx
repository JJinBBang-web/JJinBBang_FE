// src/pages/review/PhotoUploadPage.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { reviewState } from "../../recoil/review/reviewAtoms";
import { useReviewAutoSave } from "../../hooks/useReviewAutoSave";
import CancelModal from "../../components/review/CancelModal";
import { useCancelModal } from "../../util/useCancelModal";
import { imageUploadAPI } from "../../api/imageUpload";
import styles from "../../styles/review/PhotoUpload.module.css";
import closeIcon from "../../assets/image/iconClose.svg";
import plusIcon from "../../assets/image/iconPlus.svg";
import closeImageIcon from "../../assets/image/closeImageIcon.svg";

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

  // Recoil 상태 관리
  const [review, setReview] = useRecoilState(reviewState);
  const { restoreAutoSavedData, clearAutoSavedData, hasAutoSavedData } = useReviewAutoSave('photo-upload');

  // 선택된 사진들의 상태 관리 (blob URLs for preview) - 새로운 리뷰 작성 시에는 빈 배열로 시작
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

  // photos 상태가 변경될 때마다 Recoil 상태에 반영 (자동저장 트리거)
  useEffect(() => {
    setReview(prev => ({
      ...prev,
      images: photos
    }));
  }, [photos, setReview]);

  // 사진 추가 핸들러 - 파일 입력 요소 클릭
  const handleAddPhoto = () => {
    // 파일 입력 요소 클릭 트리거
    fileInputRef.current?.click();
  };

  // 파일을 base64로 변환하는 헬퍼 함수
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 파일 변경 핸들러 - base64 변환과 미리보기용 blob URL 모두 생성
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 현재 사진 개수와 새로 추가할 파일 개수 확인
    const totalPhotos = photos.length + files.length;
    if (totalPhotos > 20) {
      alert("사진은 최대 20장까지 업로드할 수 있습니다.");
      return;
    }

    try {
      // 파일들을 base64로 변환
      const base64Images = await Promise.all(
        Array.from(files).map(async (file) => {
          // 파일 크기 체크 (10MB 제한)
          if (file.size > 10 * 1024 * 1024) {
            throw new Error(`파일이 너무 큽니다: ${file.name} (${Math.round(file.size / 1024 / 1024)}MB)`);
          }
          return await fileToBase64(file);
        })
      );

      // Recoil 상태에 base64 이미지 직접 저장 (자동저장을 위해)
      setPhotos((prev) => [...prev, ...base64Images]);
    } catch (error) {
      console.error("File processing failed:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("파일 처리에 실패했습니다. 다시 시도해 주세요.");
      }
    }

    // 파일 입력을 초기화해서 같은 파일을 다시 선택할 수 있게 함
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 개별 사진 제거 핸들러
  const handleRemovePhoto = (index: number) => {
    const photoToRemove = photos[index];
    // blob URL인 경우에만 정리 (base64는 메모리에서 자동 관리됨)
    if (photoToRemove && photoToRemove.startsWith("blob:")) {
      URL.revokeObjectURL(photoToRemove);
    }
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // 다음 페이지로 이동 핸들러 - 현재 선택된 사진들과 함께 상태 전달
  const handleNext = () => {
    // 성공적으로 다음 단계로 넘어갈 때 자동 저장 데이터는 유지 (장점/단점 페이지에서도 사용될 수 있음)
    navigate("/review/filter-ad", {
      state: {
        ...locationState,
        photos,
      },
    });
  };

  // 사진 업로드는 선택사항 (항상 다음 버튼 활성화)
  const isNextEnabled = true;

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
          <span>(필수 항목 아님)</span>
        </div>

        <div className={styles.scrollContainer}>
          <div className={styles.photoGrid}>
            {/* 선택된 사진들 렌더링 */}
            {photos.map((photo, index) => (
              <div key={`photo-${index}`} className={styles.photoItem}>
                <img
                  src={photo}
                  alt={`selected ${index}`}
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
              style={{ display: "none" }}
            />
          </div>
          {/* 현재 선택된 사진 수 표시 */}
          <div className={styles.photoCount}>{photos.length}/20장</div>
        </div>
      </div>

      <footer className={styles.footer}>
        {/* 이전 페이지로 돌아가기 버튼 */}
        <button
          className={styles.prevButton}
          onClick={() => {
            // 이전 페이지로 이동 (가격 입력 페이지들 중 하나를 가정)
            // location.state의 paymentType에 따라 다른 페이지로 이동
            const previousPage =
              locationState?.paymentType === "전세"
                ? "/review/jeonse"
                : "/review/wolse";
            navigate(previousPage, {
              state: location.state,
              replace: false,
            });
          }}
        >
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
