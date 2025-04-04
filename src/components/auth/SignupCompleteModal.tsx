// src/components/auth/SignupCompleteModal.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState, AuthState } from '../../recoil/auth/atoms';
import styles from '../../styles/auth/SignupCompleteModal.module.css';
import checkIconActive from '../../assets/image/checkIconActive.svg';

interface SignupCompleteModalProps {
  onConfirm: () => void;
  onVerify: () => void;
}

const SignupCompleteModal: React.FC<SignupCompleteModalProps> = ({
  onConfirm,
  onVerify,
}) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState<AuthState>(authState);

  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onConfirm();
    }
  };

  // 확인 버튼 클릭 핸들러
  const handleConfirmClick = () => {
    // isLoggedIn 상태를 true로 설정
    setAuth((prevAuth) => ({
      ...prevAuth,
      isAuthenticated: true,
      verificationStatus: 'unverified',
    }));

    // MyPage로 돌아가기
    onConfirm();
  };

  // 학교 인증하기 버튼 클릭 핸들러
  const handleVerifyClick = () => {
    // isLoggedIn 상태를 true로 설정
    setAuth((prevAuth) => ({
      ...prevAuth,
      isAuthenticated: true,
      verificationStatus: 'unverified',
    }));

    // 모달 닫기 처리
    onVerify();

    // MyAccountPage로 이동
    navigate('/myaccount');
  };

  // 포털을 통해 body에 직접 렌더링
  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container}>
        <div className={styles.handleContainer}>
          <div className={styles.modalHandle}></div>
        </div>
        <div className={styles.content}>
          <img src={checkIconActive} alt="complete" className={styles.icon} />
          <h2 className={styles.title}>회원 가입 완료</h2>
          <p className={styles.description}>
            학교 인증을 통해
            <br />
            모든 기능을 무료로 즐겨보세요!
          </p>
        </div>
        <div className={styles.modalButtons}>
          <button onClick={handleConfirmClick} className={styles.confirmButton}>
            확인
          </button>
          <button onClick={handleVerifyClick} className={styles.verifyButton}>
            학교 인증하기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SignupCompleteModal;
