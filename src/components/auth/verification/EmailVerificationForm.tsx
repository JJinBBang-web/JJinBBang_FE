// src/components/auth/verification/EmailVerificationForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../../api/auth';
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

  const sendEmailMutation = useMutation({
    mutationFn: authApi.sendVerificationEmail,
    onSuccess: () => {
      setEmail(inputEmail);
      updateVerificationStatus('pending');
      setError(null);
    },
    onError: () => {
      setError('이메일 전송에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: () =>
      authApi.verifyEmailCode(auth.email || '', verificationCode),
    onSuccess: () => {
      updateVerificationStatus('verified');
      navigate('/auth/signup');
    },
    onError: () => {
      setError('인증에 실패했습니다. 올바른 인증번호를 입력해주세요.');
    },
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    sendEmailMutation.mutate(inputEmail);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (verificationCode.length !== 6) {
      setError('6자리 인증코드를 입력해주세요.');
      return;
    }

    verifyCodeMutation.mutate();
  };

  const isLoading = sendEmailMutation.isPending || verifyCodeMutation.isPending;

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
            disabled={isLoading}
          />
          <AuthButton type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? '처리중...' : '인증'}
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
            disabled={isLoading}
          />
          <div className={styles.buttonGroup}>
            <AuthButton
              type="button"
              variant="secondary"
              onClick={() => updateVerificationStatus('none')}
              disabled={isLoading}
            >
              재발송
            </AuthButton>
            <AuthButton type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? '처리중...' : '확인'}
            </AuthButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmailVerificationForm;
