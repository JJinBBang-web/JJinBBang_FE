// src/routes/AuthRoutes.tsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import CurrentStudentVerification from '../pages/auth/CurrentStudentVerification';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="verify" element={<CurrentStudentVerification />} />
      {/* 추후 추가될 인증 관련 라우트들 */}
      <Route path="*" element={<Navigate to="/auth/verify" replace />} />
    </Routes>
  );
};

export default AuthRoutes;
