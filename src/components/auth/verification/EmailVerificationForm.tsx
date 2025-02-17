// src/components/auth/verification/EmailVerificationForm.tsx
import React, { useState } from 'react';
import styles from '../../../styles/auth/EmailVerification.module.css';
import AuthInput from '../common/AuthInput';
import AuthButton from '../common/AuthButton';

interface EmailVerificationFormProps {
  onSubmit: (email: string, code: string) => void;
}

const EmailVerificationForm = ({ onSubmit }: EmailVerificationFormProps) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 이메일 전송 로직 구현 예정
    setIsEmailSent(true);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, verificationCode);
  };

  return (
    <div className={styles.container}>
      {!isEmailSent ? (
        <form onSubmit={handleEmailSubmit} className={styles.form}>
          <h2 className={styles.title}>학생용 이메일로 인증해주세요!</h2>
          <p className={styles.description}>
            새로운 계정으로 인증할 경우, 기존 인증은 해제돼요 인증 후, 동일한
            이메일로 30일 동안은 인증할 수 없어요
          </p>
          <AuthInput
            type="email"
            placeholder="학생용 이메일을 입력해 주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AuthButton type="submit" variant="primary">
            인증
          </AuthButton>
        </form>
      ) : (
        <form onSubmit={handleVerificationSubmit} className={styles.form}>
          <h2 className={styles.title}>인증코드를 입력해 주세요.</h2>
          <p className={styles.description}>
            메일이 오지 않나요? 이메일 서비스 제공자 사정에 의해 수신까지 30분
            정도가 소요될 수 있어요. 메일 주소, 스팸함, 용량 등을 확인해보시고,
            [재발송]을 눌러 다시 요청해 주세요
          </p>
          <AuthInput
            type="number"
            placeholder="인증코드 6자리 입력"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <div className={styles.buttonGroup}>
            <AuthButton
              type="button"
              variant="secondary"
              onClick={() => setIsEmailSent(false)}
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
