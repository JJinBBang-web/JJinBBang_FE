// src/pages/auth/NewStudentVerification.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../../recoil/auth/atoms';
import styles from '../../styles/auth/NewStudentVerification.module.css';
import arrowIcon from '../../assets/image/arrowIcon.svg';
import graduateCharacter from '../../assets/image/graduateCharacter.svg';
import verifyCompleteIcon from '../../assets/image/verifyCompleteIcon.svg';
import { validateFile, uploadFile } from '../../util/fileUpload';

type VerificationStatus = 'initial' | 'uploading' | 'pending' | 'complete';

const NewStudentVerification: React.FC = () => {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>('initial');
  const [file, setFile] = useState<File | null>(null);
  const [auth, setAuth] = useRecoilState(authState);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files?.length) return;
    try {
      const file = files[0];
      validateFile(file);
      setFile(file);
      // API 연동 대신 바로 complete 상태로 변경
      setVerificationStatus('complete');
    } catch (error) {
      alert(
        error instanceof Error ? error.message : '파일 업로드에 실패했습니다.'
      );
      setVerificationStatus('initial');
    }
  };

  const handleConfirm = () => {
    // 인증 상태를 pending으로 설정
    setAuth((prev) => ({
      ...prev,
      verificationStatus: 'pending',
    }));
    navigate('/mypage');
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'initial':
        return (
          <>
            <h1 className={styles.title}>합격 증명서를 첨부해 주세요!</h1>
            <div className={styles.description}>
              <p>증명서를 스캔하거나 사진으로 찍어 첨부해 주세요</p>
              <p>[발급일자, 대학교, 이름, 학번, 학과, 문서 확인번호]</p>
              <p>모두 포함되어 있어야 하며</p>
              <p>3개월 이내 발급된 증명서만 유효해요</p>
            </div>
            <img
              src={graduateCharacter}
              alt="graduate character"
              className={styles.character}
            />
            <label className={styles.uploadButton}>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileUpload}
                hidden
              />
              증명서 업로드
            </label>
          </>
        );
      case 'pending':
        return (
          <div className={styles.statusContainer}>
            <img
              src={graduateCharacter}
              alt="graduate character"
              className={styles.character}
            />
            <h2>인증 대기중</h2>
            <p>진행 상황은 추후 알림을 통해 알려드릴게요!</p>
          </div>
        );
      case 'complete':
        return (
          <div className={styles.statusContainer}>
            <img
              src={verifyCompleteIcon}
              alt="complete"
              className={styles.completeIcon}
            />
            <h2>업로드 완료!</h2>
            <p>증명서 확인에는 7일 정도가 소요돼요</p>
            <p>빠른 확인을 위해 찐빵이가 노력할게요!</p>
            <div className={styles.buttonGroup}>
              <label className={styles.cancelButton}>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                  hidden
                />
                재업로드
              </label>
              <button onClick={handleConfirm} className={styles.confirmButton}>
                확인
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="content">
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img src={arrowIcon} alt="back" className={styles.flippedIcon} />
        </button>
      </header>
      <main className={styles.container}>{renderContent()}</main>
    </div>
  );
};

export default NewStudentVerification;
