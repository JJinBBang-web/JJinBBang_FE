// src/components/auth/common/AuthButton.tsx
import React from 'react';
import styles from '../../../styles/auth/AuthButton.module.css';

interface AuthButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
}

const AuthButton = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
}: AuthButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default AuthButton;
