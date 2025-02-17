// src/components/auth/verification/EmailVerificationForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../styles/auth/EmailVerification.module.css';
import AuthInput from '../common/AuthInput';
import AuthButton from '../common/AuthButton';
import { useAuth } from '../../../hooks/useAuth';

const EmailVerificationForm = () => {
  const navigate = useNavigate();
  const { auth, setEmail, updateVerificationStatus } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(inputEmail)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      // API 연동 예정
      setEmail(inputEmail);
      updateVerificationStatus('pending');
    } catch (error) {
      setError('이메일 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (verificationCode.length !== 6) {
      setError('6자리 인증코드를 입력해주세요.');
      return;
    }

    try {
      // API 연동 예정
      updateVerificationStatus('verified');
      navigate('/auth/signup');
    } catch (error) {
      setError('인증에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.container}>
      {auth.verificationStatus === 'none' ? (
        <form onSubmit={handleEmailSubmit} className={styles.form}>
          <h2 className={styles.title}>학생용 이메일로 인증해주세요!</h2>
          <p className={styles.description}>
            새로운 계정으로 인증할 경우, 기존 인증은 해제돼요 인증 후, 동일한
            이메일로 30일 동안은 인증할 수 없어요
          </p>
          <AuthInput
            type="email"
            placeholder="학생용 이메일을 입력해 주세요."
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            error={error || undefined}
          />
          <AuthButton type="submit" variant="primary">
            인증
          </AuthButton>
        </form>
      ) : (
        <form onSubmit={handleVerificationSubmit} className={styles.form}>
          <h2 className={styles.title}>인증코드를 입력해 주세요.</h2>
          <p className={styles.description}>
            이메일 서비스 제공자 사정에 의해 수신까지 30분 정도가 소요될 수
            있어요. 메일 주소, 스팸함, 용량 등을 확인해보시고, 재발송을 눌러
            다시 요청해 주세요
          </p>
          <AuthInput
            type="number"
            placeholder="인증코드 6자리 입력"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            error={error || undefined}
          />
          <div className={styles.buttonGroup}>
            <AuthButton
              type="button"
              variant="secondary"
              onClick={() => updateVerificationStatus('none')}
            >
              재발송
            </AuthButton>
            <AuthButton type="submit" variant="primary">
              확인
            </AuthButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmailVerificationForm;
