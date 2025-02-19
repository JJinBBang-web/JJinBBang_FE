// src/pages/auth/StudentVerification.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/auth/StudentVerification.module.css';
import arrowIcon from '../../assets/image/arrowIcon.svg';

interface VerificationProps {
  type: 'new' | 'current';
}

const StudentVerification: React.FC<VerificationProps> = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = type === 'new' ? '신입생 인증' : '재학생 인증';
  const description =
    type === 'new'
      ? '합격 증명서를 스캔하거나 사진으로 찍어 첨부해 주세요.'
      : '학생증을 스캔하거나 사진으로 찍어 첨부해 주세요.';

  return (
    <div className="content">
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img src={arrowIcon} alt="back" />
        </button>
        <h1>{pageTitle}</h1>
      </header>

      <div className={styles.container}>
        <div className={styles.guide}>
          <h2>인증코드를 입력해 주세요.</h2>
          <p>{description}</p>
        </div>

        <div className={styles.uploadSection}>
          <p className={styles.uploadGuide}>
            <span>증명서를 스캔하거나 사진으로 찍어 첨부해 주세요.</span>
            <span>[발급일자, 대학교, 이름, 학번, 학과, 문서 확인번호]</span>
            <span>모두 포함되어 있어야 하며</span>
            <span>3개월 이내 발급된 증명서만 유효해요</span>
          </p>
          <button className={styles.uploadButton}>증명서 업로드</button>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.submitButton}
            onClick={() => {
              /* 제출 로직 구현 예정 */
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentVerification;
