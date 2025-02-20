// src/routes/AuthRoutes.tsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import EmailVerificationPage from '../pages/auth/EmailVerificationPage';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="verify" element={<EmailVerificationPage />} />
      {/* 추후 추가될 인증 관련 라우트들 */}
      <Route path="*" element={<Navigate to="/auth/verify" replace />} />
    </Routes>
  );
};

export default AuthRoutes;
