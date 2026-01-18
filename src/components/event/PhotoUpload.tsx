// src/components/event/PhotoUpload.tsx
import React, { useRef } from "react";
import styles from "./PhotoUpload.module.css";
import plusIcon from "../../assets/image/iconPlus.svg";
import closeImageIcon from "../../assets/image/closeImageIcon.svg";

type Props = {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
};

const PhotoUpload: React.FC<Props> = ({ photos, onChange, maxPhotos = 3 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const totalPhotos = photos.length + files.length;
    if (totalPhotos > maxPhotos) {
      alert(`사진은 최대 ${maxPhotos}장까지 업로드할 수 있습니다.`);
      return;
    }

    try {
      const base64Images = await Promise.all(
        Array.from(files).map(async (file) => {
          if (file.size > 10 * 1024 * 1024) {
            throw new Error(
              `파일이 너무 큽니다: ${file.name} (${Math.round(file.size / 1024 / 1024)}MB)`
            );
          }
          return await fileToBase64(file);
        })
      );

      onChange([...photos, ...base64Images]);
    } catch (error) {
      console.error("File processing failed:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("파일 처리에 실패했습니다. 다시 시도해 주세요.");
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index: number) => {
    const photoToRemove = photos[index];
    if (photoToRemove && photoToRemove.startsWith("blob:")) {
      URL.revokeObjectURL(photoToRemove);
    }
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.description}>
        실제 거주했던 방 사진을 올려주세요 (최대 {maxPhotos}장)
      </p>
      <div className={styles.photoGrid}>
        {photos.map((photo, index) => (
          <div key={`photo-${index}`} className={styles.photoItem}>
            <img src={photo} alt={`선택된 사진 ${index + 1}`} className={styles.photo} />
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => handleRemovePhoto(index)}
            >
              <img src={closeImageIcon} alt="삭제" />
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <div className={styles.addPhotoBox} onClick={handleAddPhoto}>
            <img src={plusIcon} alt="사진 추가" className={styles.plusIcon} />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default PhotoUpload;
