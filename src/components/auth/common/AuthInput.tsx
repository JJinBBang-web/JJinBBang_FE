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
}

const AuthInput = ({
  type,
  placeholder,
  value,
  onChange,
  error,
  label,
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
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default AuthInput;
