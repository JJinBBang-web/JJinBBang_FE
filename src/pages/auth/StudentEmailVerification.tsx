// src/pages/auth/StudentEmailVerification.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../../recoil/auth/atoms';
import styles from '../../styles/auth/StudentEmailVerification.module.css';
import arrowIcon from '../../assets/image/arrowIcon.svg';
import warningIcon from '../../assets/image/warningIcon.svg';

type VerificationStep = 'code' | 'error';

const StudentEmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState(authState);
  const [step, setStep] = useState<VerificationStep>('code');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 인증 코드 제출 처리
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요.');
      return;
    }

    // 테스트를 위해 인증 코드는 '112233'으로 고정
    if (code !== '112233') {
      setError('인증번호가 일치하지 않아요!');
      setStep('error');
      return;
    }

    // 인증 성공
    setAuth((prev) => ({
      ...prev,
      isAuthenticated: true,
      verificationStatus: 'verified',
      email: 'student@gnu.ac.kr', // 테스트용 이메일 설정
    }));

    // 인증 완료 페이지로 돌아가면서 완료 상태로 설정
    navigate('/auth/student/current', { state: { verified: true } });
  };

  // 재발송 처리
  const handleResend = () => {
    setError(null);
    setCode('');
    setStep('code');
  };

  return (
    <div className="content">
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img src={arrowIcon} alt="back" />
        </button>
      </header>

      <main className={styles.container}>
        <h1 className={styles.title}>인증코드를 입력해 주세요.</h1>
        <p className={styles.description}>
          메일이 오지 않나요? <br /> <br />
          이메일 서비스 제공자 사정에 의해 수신까지 30분 정도가 소요될 수
          있어요. 메일 주소, 스팸함, 용량 등을 확인해보시고, [재발송]을 눌러
          다시 요청해 주세요
        </p>

        <form onSubmit={handleCodeSubmit} className={styles.form}>
          <div className={styles.inputContainer}>
            {step === 'error' && (
              <img
                src={warningIcon}
                alt="warning"
                className={styles.warningIcon}
              />
            )}
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                if (step === 'error') {
                  setStep('code');
                  setError(null);
                }
              }}
              placeholder="인증코드를 입력해 주세요."
              className={`${styles.codeInput} ${
                step === 'error' ? styles.inputError : ''
              }`}
              maxLength={6}
            />
            {step === 'error' && (
              <p className={styles.errorText}>인증번호가 일치하지 않아요!</p>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.resendButton}
              onClick={handleResend}
            >
              재발송
            </button>
            <button
              type="submit"
              className={styles.confirmButton}
              disabled={code.length === 0}
              style={{
                backgroundColor:
                  code.length === 0
                    ? 'var(--color-gray40)'
                    : 'var(--primary-color)',
                cursor: code.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              확인
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default StudentEmailVerification;
