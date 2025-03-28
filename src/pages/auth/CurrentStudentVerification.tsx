// src/pages/auth/CurrentStudentVerification.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authState, AuthState } from '../../recoil/auth/atoms';
import styles from '../../styles/auth/CurrentStudentVerification.module.css';
import arrowIcon from '../../assets/image/arrowIcon.svg';
import verifyCompleteIcon from '../../assets/image/verifyCompleteIcon.svg';
import graduateCharacter from '../../assets/image/graduateCharacter.svg';
import warningIcon from '../../assets/image/warningIcon.svg';

enum VerificationStep {
  EMAIL_INPUT,
  CODE_VERIFICATION,
  COMPLETE,
}

const CurrentStudentVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useSetRecoilState(authState);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<VerificationStep>(
    location.state?.verified
      ? VerificationStep.COMPLETE
      : VerificationStep.EMAIL_INPUT
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setError(validateEmail(newEmail));
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setVerificationCode(newCode);
    setError(null);
  };

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string) => {
    if (!email) return null;

    // 기본 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return '이메일 주소 형식을 확인해 주세요!';
    }

    // 학교 이메일 도메인 검사
    if (!email.endsWith('.ac.kr')) {
      return '학교 이메일 주소만 사용 가능합니다!';
    }

    return null;
  };

  // 이메일 제출 및 인증 코드 발송
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || error) return;

    setIsLoading(true);
    // 실제 API 호출 대신 타임아웃으로 처리
    setTimeout(() => {
      setIsLoading(false);
      setStep(VerificationStep.CODE_VERIFICATION);
    }, 1000);
  };

  // 인증 코드 검증
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setError('인증번호 6자리를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    // 테스트용: 인증 코드 '123456'으로 고정
    setTimeout(() => {
      setIsLoading(false);
      if (verificationCode === '123456') {
        setStep(VerificationStep.COMPLETE);
      } else {
        setError('인증번호가 일치하지 않아요!');
      }
    }, 1000);
  };

  // 인증 완료 후 확인
  const handleConfirm = () => {
    setAuth((prev: AuthState) => ({
      ...prev,
      isAuthenticated: true,
      email: email,
      verificationStatus: 'verified',
    }));
    navigate('/mypage');
  };

  // 인증 코드 재발송
  const handleResendCode = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // 이메일 입력 화면 렌더링
  const renderEmailForm = () => (
    <main className={styles.container}>
      <h1 className={styles.title}>학생용 이메일로 인증해주세요!</h1>
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
            onChange={handleEmailChange}
            placeholder="학생용 이메일을 입력해 주세요."
            className={`${styles.emailInput} ${error ? styles.inputError : ''}`}
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
            !email || isLoading ? styles.disabled : ''
          }`}
          disabled={!email || !!error || isLoading}
        >
          {isLoading ? '처리 중...' : '인증'}
        </button>
      </form>
    </main>
  );

  // 인증 코드 입력 화면 렌더링
  const renderCodeVerification = () => (
    <main className={styles.container}>
      <h1 className={styles.title}>인증코드를 입력해 주세요.</h1>
      <span className={styles.description}>
        <p>메일이 오지 않나요?</p>
        이메일 서비스 제공자 사정에 의해 수신까지 30분 정도가 소요될 수 있어요.
        메일 주소, 스팸함, 용량 등을 확인해보시고, [재발송]을 눌러 다시 요청해
        주세요
        <br />
        또는 수신 문제에 대해 학교 웹메일 담당자에게 문의해 주세요
      </span>
      <form onSubmit={handleCodeSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          {error && (
            <img
              src={warningIcon}
              alt="warning"
              className={styles.warningIcon}
            />
          )}
          <input
            type="text"
            value={verificationCode}
            onChange={handleCodeChange}
            placeholder="인증코드를 입력해 주세요."
            className={`${styles.emailInput} ${error ? styles.inputError : ''}`}
            maxLength={6}
          />
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.resendButton}
            onClick={handleResendCode}
            disabled={isLoading}
          >
            재발송
          </button>
          <button
            type="submit"
            className={`${styles.submitButton} ${
              verificationCode.length < 6 || isLoading ? styles.disabled : ''
            }`}
            disabled={verificationCode.length < 6 || isLoading}
          >
            {isLoading ? '처리 중...' : '확인'}
          </button>
        </div>
      </form>
    </main>
  );

  // 인증 완료 화면 렌더링
  const renderComplete = () => (
    <main className={styles.completeContainer}>
      <img
        src={verifyCompleteIcon}
        alt="complete"
        className={styles.checkIcon}
      />
      <h2>재학생 인증 완료!</h2>
      <p>반가워요, 찐빵이와 함께</p>
      <p>찐 실거주 후기들을 알아가 봐요!</p>
      <button onClick={handleConfirm} className={styles.confirmButton}>
        확인
      </button>
    </main>
  );

  return (
    <div className="content">
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img
            src={arrowIcon}
            alt="back"
            className={
              step !== VerificationStep.COMPLETE ? styles.flippedIcon : ''
            }
          />
        </button>
      </header>
      {step === VerificationStep.EMAIL_INPUT && renderEmailForm()}
      {step === VerificationStep.CODE_VERIFICATION && renderCodeVerification()}
      {step === VerificationStep.COMPLETE && renderComplete()}
    </div>
  );
};

export default CurrentStudentVerification;
