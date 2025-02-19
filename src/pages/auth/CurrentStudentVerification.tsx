import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../../recoil/auth/atoms';
import styles from '../../styles/auth/CurrentStudentVerification.module.css';
import arrowIcon from '../../assets/image/arrowIcon.svg';
import verifyCompleteIcon from '../../assets/image/verifyCompleteIcon.svg';

const CurrentStudentVerification: React.FC = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState(authState);
  const [email, setEmail] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    console.log('Current authState:', auth);
  }, [auth]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.endsWith('.ac.kr')) {
      setIsComplete(true);
      setAuth((prev) => ({
        ...(prev ?? {
          isAuthenticated: false,
          email: null,
          verificationStatus: 'none',
        }),
        email,
        verificationStatus: 'verified',
      }));
    } else {
      alert('올바른 학교 메일을 입력해주세요.');
    }
  };

  const handleConfirm = () => {
    navigate('/mypage');
  };

  if (isComplete) {
    return (
      <div className="content">
        <header className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <img src={arrowIcon} alt="back" />
          </button>
        </header>
        <main className={styles.completeContainer}>
          <img
            src={verifyCompleteIcon}
            alt="complete"
            className={styles.checkIcon}
          />
          <h2>재학생 인증 완료!</h2>
          <p>반가워요, 찐빵이와 함께</p>
          <p>진 실거주 후기들을 알아가 봐요!</p>
          <button onClick={handleConfirm} className={styles.confirmButton}>
            확인
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="content">
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img src={arrowIcon} alt="back" />
        </button>
      </header>
      <main className={styles.container}>
        <h1>학생용 이메일로 인증해주세요!</h1>
        <p className={styles.description}>
          새로운 계정으로 인증할 경우, 기존 인증은 해제돼요. 인증 후, 동일한
          이메일로 30일 동안은 인증할 수 없어요.
        </p>
        <form onSubmit={handleEmailSubmit} className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="학생용 이메일을 입력해 주세요."
            className={styles.emailInput}
          />
          <button type="submit" className={styles.submitButton}>
            인증
          </button>
        </form>
      </main>
    </div>
  );
};

export default CurrentStudentVerification;
