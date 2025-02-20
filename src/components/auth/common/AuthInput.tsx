// src/components/auth/common/AuthInput.tsx
import React from 'react';
import styles from '../../../styles/auth/AuthInput.module.css';

interface AuthInputProps {
  type: 'text' | 'email' | 'number';
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label?: string;
  disabled?: boolean; // disabled prop 추가
}

const AuthInput = ({
  type,
  placeholder,
  value,
  onChange,
  error,
  label,
  disabled = false, // 기본값 설정
}: AuthInputProps) => {
  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        className={`${styles.input} ${error ? styles.error : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default AuthInput;
