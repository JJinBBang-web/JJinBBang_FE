// src/App.tsx
import React from 'react';
import logo from './logo.svg';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Heart from './pages/HeartListPage';
import MyPage from './pages/MyPage';
import Nav from './components/Nav';
import KakaoCallback from './pages/auth/KakaoCallback';
import KakaoAuthPage from './pages/auth/KakaoAuthPage';
import MyAccountPage from './pages/auth/MyAccountPage';
import AccountAuthPage from './pages/auth/AccountAuthPage';
import NewStudentVerification from './pages/auth/NewStudentVerification';
import CurrentStudentVerification from './pages/auth/CurrentStudentVerification';
import StudentEmailVerification from './pages/auth/StudentEmailVerification';
import ReviewTypePage from './pages/review/ReviewTypePage';
import AddressInputPage from './pages/review/AddressInputPage';
import AddressSearchPage from './pages/review/AddressSearchPage';
import AddressResultPage from './pages/review/AddressResultPage';
import DormitoryInputPage from './pages/review/DormitoryInputPage';
import DormitoryConditionsPage from './pages/review/DormitoryConditionsPage';
import DormitoryAmenitiesPage from './pages/review/DormitoryAmenitiesPage';
import FloorInputPage from './pages/review/FloorInputPage';
import AgencyInputPage from './pages/review/AgencyInputPage';
import PaymentTypePage from './pages/review/PaymentTypePage';
import JeonseInputPage from './pages/review/JeonseInputPage';
import WolseInputPage from './pages/review/WolseInputPage';
import RoomInfoPage from './pages/review/PhotoUploadPage';
import ReviewAdvantagePage from './pages/review/ReviewAdvantagePage';
import ReviewDisadvantagePage from './pages/review/ReviewDisadvantagePage';
import ReviewContentPage from './pages/review/ReviewContentPage';
import ReviewConfirmPage from './pages/review/ReviewConfirmPage';

import { RecoilRoot } from 'recoil';
import ModalBottomSheet from './components/util/ModalBottomSheet';
import Review from './pages/Review';
import Building from './pages/Building';
import ReportPage from './pages/ReportPage';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const location = useLocation();

  const showHeaderAndNav = ![
    '/auth/verify',
    '/auth/signup',
    '/auth/login',
    '/myaccount',
    '/auth/student/verify',
    '/auth/student/new',
    '/auth/student/current',
    '/auth/kakao',
    '/auth/kakao/callback',
    '/auth/student/email-verification',
    '/review/type',
    '/review/input-address',
    '/review/address',
    '/review/dormitory',
    '/review/dormitory-conditions',
    '/review/dormitory-amenities',
    '/review/result',
    '/review/floor',
    '/review/agency',
    '/review/price',
    '/review/jeonse',
    '/review/wolse',
    '/review/room-info',
    '/review/filter-ad',
    '/review/filter-disad',
    '/review/content',
    '/review/confirm',
    '/building',
    '/building/rv',
    '/building/',
    '/building/rv/',
    '/building/rv/report',
    '/building/rv/report/'
  ].includes(location.pathname);

  return (
    <>
      {showHeaderAndNav}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/heart" element={<Heart />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/myaccount" element={<AccountAuthPage />} />
        <Route path="/auth">
          <Route path="kakao" element={<KakaoAuthPage />} />
          <Route path="kakao/callback" element={<KakaoCallback />} />
          <Route path="student">
            <Route path="verify" element={<MyAccountPage />} />
            <Route path="new" element={<NewStudentVerification />} />
            <Route path="current" element={<CurrentStudentVerification />} />
            <Route
              path="email-verification"
              element={<StudentEmailVerification />}
            />
          </Route>
        </Route>
        <Route path="/review">
          <Route path="type" element={<ReviewTypePage />} />
          <Route path="input-address" element={<AddressInputPage />} />
          <Route path="address" element={<AddressSearchPage />} />
          <Route path="dormitory" element={<DormitoryInputPage />} />
          <Route
            path="dormitory-conditions"
            element={<DormitoryConditionsPage />}
          />
          <Route
            path="dormitory-amenities"
            element={<DormitoryAmenitiesPage />}
          />

          <Route path="result" element={<AddressResultPage />} />
          <Route path="floor" element={<FloorInputPage />} />
          <Route path="agency" element={<AgencyInputPage />} />
          <Route path="price" element={<PaymentTypePage />} />
          <Route path="jeonse" element={<JeonseInputPage />} />
          <Route path="wolse" element={<WolseInputPage />} />
          <Route path="room-info" element={<RoomInfoPage />} />
          <Route path="filter-ad" element={<ReviewAdvantagePage />} />
          <Route path="filter-disad" element={<ReviewDisadvantagePage />} />
          <Route path="content" element={<ReviewContentPage />} />
          <Route path="confirm" element={<ReviewConfirmPage />} />
        </Route>
        <Route path='/building' element={<Building/>}/>
        <Route path='/building/rv' element={<Review/>}/>
        <Route path="/building/rv/report" element={<ReportPage/>} />
        <Route path="/building" element={<Building />} />
      </Routes>
      {showHeaderAndNav && <Nav />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <AppContent />
          <ModalBottomSheet />
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
