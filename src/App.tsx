// src/App.tsx
import React from 'react';
import logo from './logo.svg';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Map from './pages/Map';
import Heart from './pages/HeartListPage';
import MyPage from './pages/MyPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import Nav from './components/Nav';
import KakaoCallback from './pages/auth/KakaoCallback';
import KakaoAuthPage from './pages/auth/KakaoAuthPage';
import MyAccountPage from './pages/auth/MyAccountPage';
import AccountAuthPage from './pages/auth/AccountAuthPage';
import NewStudentVerification from './pages/auth/NewStudentVerification';
import CurrentStudentVerification from './pages/auth/CurrentStudentVerification';
import ReviewTypePage from './pages/review/ReviewTypePage';
import AddressSearchPage from './pages/review/AddressSearchPage';
import AddressResultPage from './pages/review/AddressResultPage';
import FloorInputPage from './pages/review/FloorInputPage';
import PaymentTypePage from './pages/review/PaymentTypePage';
import JeonseInputPage from './pages/review/JeonseInputPage';
import WolseInputPage from './pages/review/WolseInputPage';
import RoomInfoPage from './pages/review/PhotoUploadPage';

import { RecoilRoot } from 'recoil';
import ModalBottomSheet from './components/util/ModalBottomSheet';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const location = useLocation();

  const showHeaderAndNav = ![
    '/auth/verify',
    '/auth/signup',
    '/auth/login',
    '/myaccount',
    '/auth/student/new',
    '/auth/student/current',
    '/auth/kakao',
    '/auth/kakao/callback',
    '/review/type',
    '/review/address',
    '/review/result',
    '/review/floor',
    '/review/price',
    '/review/jeonse',
    '/review/wolse',
    '/review/room-info',
  ].includes(location.pathname);

  return (
    <>
      {showHeaderAndNav}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/heart" element={<Heart />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/myaccount" element={<AccountAuthPage />} />
        <Route path="/auth">
          <Route path="verify" element={<EmailVerificationPage />} />
          <Route path="kakao" element={<KakaoAuthPage />} />
          <Route path="kakao/callback" element={<KakaoCallback />} />
          <Route path="student">
            <Route path="verify" element={<MyAccountPage />} />
            <Route path="new" element={<NewStudentVerification />} />
            <Route path="current" element={<CurrentStudentVerification />} />
          </Route>
        </Route>
        <Route path="/review">
          <Route path="type" element={<ReviewTypePage />} />
          <Route path="address" element={<AddressSearchPage />} />
          <Route path="result" element={<AddressResultPage />} />
          <Route path="floor" element={<FloorInputPage />} />
          <Route path="price" element={<PaymentTypePage />} />
          <Route path="jeonse" element={<JeonseInputPage />} />
          <Route path="wolse" element={<WolseInputPage />} />
          <Route path="room-info" element={<RoomInfoPage />} />{' '}
        </Route>
      </Routes>
      {showHeaderAndNav && <Nav />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppContent />
          <ModalBottomSheet />
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
