// src/pages/auth/CurrentStudentVerification.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState } from '../../recoil/auth/atoms';
import styles from '../../styles/auth/CurrentStudentVerification.module.css';
import arrowIcon from '../../assets/image/arrowIcon.svg';
import verifyCompleteIcon from '../../assets/image/verifyCompleteIcon.svg';
import graduateCharacter from '../../assets/image/graduateCharacter.svg';
import warningIcon from '../../assets/image/warningIcon.svg';

const CurrentStudentVerification: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authState);
  const [email, setEmail] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    if (!email) return null;
    if (!email.includes('@')) return '이메일 주소 형식을 확인해 주세요!';
    if (!email.endsWith('.ac.kr')) return '이메일 주소 형식을 확인해 주세요!';
    return null;
  };

  useEffect(() => {
    if (email) {
      setError(validateEmail(email));
    } else {
      setError(null);
    }
  }, [email]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || error) return;

    setIsComplete(true);
    setAuth({
      isAuthenticated: true,
      email: email,
      verificationStatus: 'verified',
    });
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
          새로운 계정으로 인증할 경우, 기존 인증은 해제돼요.
          <br />
          인증 후, 동일한 이메일로 30일 동안은 인증할 수 없어요.
        </p>
        <form onSubmit={handleEmailSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            {error && (
              <img
                src={warningIcon}
                alt="warning"
                className={styles.warningIcon}
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="학생용 이메일을 입력해 주세요."
              className={`${styles.emailInput} ${
                error ? styles.inputError : ''
              }`}
            />
            {error && <p className={styles.errorText}>{error}</p>}
          </div>
          <img
            src={graduateCharacter}
            alt="character"
            className={styles.character}
          />
          <button
            type="submit"
            className={`${styles.submitButton} ${
              !email ? styles.disabled : ''
            }`}
            disabled={!email || !!error}
          >
            인증
          </button>
        </form>
      </main>
    </div>
  );
};

export default CurrentStudentVerification;
