// src/App.tsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  matchPath,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import Heart from "./pages/HeartListPage";
import MyPage from "./pages/MyPage";
import Nav from "./components/Nav";
import Building from "./pages/Building";
import Review from "./pages/Review";
import ReportPage from "./pages/ReportPage";
import UpdateBuildTypePage from "./pages/update/UpdateBuildTypePage";
import UpdateConfirmPage from "./pages/update/UpdateConfirmPage";
import LoginResultPage from "./pages/LoginResultPage";
import MyAccountPage from "./pages/auth/MyAccountPage";
import AccountAuthPage from "./pages/auth/AccountAuthPage";
import NewStudentVerification from "./pages/auth/NewStudentVerification";
import CurrentStudentVerification from "./pages/auth/CurrentStudentVerification";
import ReviewTypePage from "./pages/review/ReviewTypePage";
import AddressInputPage from "./pages/review/AddressInputPage";
import AddressSearchPage from "./pages/review/AddressSearchPage";
import AddressResultPage from "./pages/review/AddressResultPage";
import DormitoryInputPage from "./pages/review/DormitoryInputPage";
import DormitoryConditionsPage from "./pages/review/DormitoryConditionsPage";
import DormitoryAmenitiesPage from "./pages/review/DormitoryAmenitiesPage";
import FloorInputPage from "./pages/review/FloorInputPage";
import AgencyInputPage from "./pages/review/AgencyInputPage";
import PaymentTypePage from "./pages/review/PaymentTypePage";
import JeonseInputPage from "./pages/review/JeonseInputPage";
import WolseInputPage from "./pages/review/WolseInputPage";
import RoomInfoPage from "./pages/review/PhotoUploadPage";
import ReviewAdvantagePage from "./pages/review/ReviewAdvantagePage";
import ReviewDisadvantagePage from "./pages/review/ReviewDisadvantagePage";
import ReviewContentPage from "./pages/review/ReviewContentPage";
import ReviewConfirmPage from "./pages/review/ReviewConfirmPage";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";
import ModalBottomSheet from "./components/util/ModalBottomSheet";
import { useAuthInitialization } from "./hooks/useAuthInitialization";
import { useUserInfo } from "./hooks/useUserInfo";
import { hideNavState } from "./recoil/util/modalState";
import TagManager from "react-gtm-module";
import UpdateAddressInputPage from "./pages/update/UpdateAddressInputPage";
import UpdateContractTypePage from "./pages/update/UpdateContractTypePage";
import UpdateContractPricePage from "./pages/update/UpdateContractPricePage";
import UpdateAdventagePage from "./pages/update/UpdateAdventagePage";
import UpdateDisadventagePage from "./pages/update/UpdateDisadventagePage";
import UpdateContentPage from "./pages/update/UpdateContentPage";
import UpdateAddressSearchPage from "./pages/update/UpdateAddressSearchPage";
import UpdateFloorInputPage from "./pages/update/UpdateFloorInputPage";
import UpdateDormitoryInputPage from "./pages/update/UpdateDormitoryInputPage";
import UpdateDormitoryConditionsPage from "./pages/update/UpdateDormitoryConditionsPage";
import UpdateDormitoryAmenitiesPage from "./pages/update/UpdateDormitoryAmenitiesPage";
import UpdatePhotoUploadPage from "./pages/update/UpdatePhotoUploadPage";
import ContentPage from "./pages/content/Content";
import ContentDetail from "./pages/content/ContentDetail";
import RecoilNexus, { setRecoil } from "./util/RecoilNexus";
import { explorationFrequencyState } from "./recoil/util/explorationFrequencyState";
import ContentLoginPage from "./pages/content/ContentLogin";
import ContentManagePage from "./pages/content/ContentManage";
import ContentWritePage from "./pages/content/ContentWrite";
import EventReviewPage from "./pages/EventRevew";
import EventAddressSearchPage from "./pages/event/EventAddressSearchPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      // retry: false, // 재시도 비활성화
      // retry: 5,   // 5번 재시도
    },
  },
});
const AppContent: React.FC = () => {
  const location = useLocation();
  const hideNav = useRecoilValue(hideNavState);
  const setHideNav = useSetRecoilState(hideNavState);
  
  // 인증 초기화
  const { isInitializing } = useAuthInitialization();
  
  // 사용자 정보 조회 및 상태 관리
  useUserInfo(isInitializing);
  
  // GTM 태그 매니저
  useEffect(() => {
    const timer = setTimeout(() => {
      TagManager.dataLayer({
        dataLayer: {
          event: "pageview",
          pagePath: location.pathname,
        },
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  // 경로 변환 시 nav 초기화
  useEffect(() => {
    setHideNav(false);
  }, [location.pathname, setHideNav]);

  const hiddenNavPaths = [
    "/auth/*",
    "/myaccount",
    "/review/*",
    "/building/:buildingId",
    "/building/review/:reviewId",
    "/building/review/:reviewId/report",
    "/content/:reportId",
    "/admin/content/*",
    "/event/review/write",
    "/event/address-search",
  ];

  const showHeaderAndNav = !hiddenNavPaths.some((pattern) =>
    matchPath({ path: pattern, end: false }, location.pathname)
  ) && !hideNav;

  return (
    <>
      <RecoilNexus />
      {showHeaderAndNav}
      <Routes>
        <Route path="/login/result" element={<LoginResultPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/heart" element={<Heart />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/myaccount" element={<AccountAuthPage />} />
        <Route path="/auth">
          <Route path="student">
            <Route path="verify" element={<MyAccountPage />} />
            <Route path="new" element={<NewStudentVerification />} />
            <Route path="current" element={<CurrentStudentVerification />} />
          </Route>
        </Route>
        <Route path="/review">
          # 1_review_type_select
          <Route path="type" element={<ReviewTypePage />} />
          # 2.1_address_input
          <Route path="input-address" element={<AddressInputPage />} />
          # 2.2_address_search
          <Route path="address" element={<AddressSearchPage />} />

          # 3-1.1_floor_input
          <Route path="floor" element={<FloorInputPage />} />
          # 3-1.2_address_result
          <Route path="result" element={<AddressResultPage />} />
          # 3-1.3_contractType
          <Route path="price" element={<PaymentTypePage />} />
          # 3-1.4_price
          <Route path="jeonse" element={<JeonseInputPage />} />
          <Route path="wolse" element={<WolseInputPage />} />
          
          # 3-2.1_dormitory_input
          <Route path="dormitory" element={<DormitoryInputPage />} />
          # 3-2.2_dormitory_conditions
          <Route
            path="dormitory-conditions"
            element={<DormitoryConditionsPage />}
          />
          # 3-2.3_dormitory_amenities
          <Route
            path="dormitory-amenities"
            element={<DormitoryAmenitiesPage />}
          />

          # 3-3_agency_input
          <Route path="agency" element={<AgencyInputPage />} />

          # 4_room_info
          <Route path="room-info" element={<RoomInfoPage />} />
          # 5.1_filter_ad
          <Route path="filter-ad" element={<ReviewAdvantagePage />} />
          # 5.2_filter_disad
          <Route path="filter-disad" element={<ReviewDisadvantagePage />} />
          # 6_content
          <Route path="content" element={<ReviewContentPage />} />
          # 7_confirm
          <Route path="confirm" element={<ReviewConfirmPage />} />
        </Route>

      <Route path="/building/:buildingId" element={<Building />} />
      <Route path="/building/review/:reviewId" element={<Review />} />

      <Route path="/building/review/:reviewId/report" element={<ReportPage />} />
      <Route path="/review/:reviewId/update" element={<UpdateConfirmPage/>}/>
      <Route path="/review/:reviewId/update/type" element={<UpdateBuildTypePage/>}/>
      <Route path="/review/:reviewId/update/input-address" element={<UpdateAddressInputPage/>}/>
      <Route path="/review/:reviewId/update/address" element={<UpdateAddressSearchPage/>}/>
      <Route path="/review/:reviewId/update/floor" element={<UpdateFloorInputPage/>}/>
      <Route path="/review/:reviewId/update/contract" element={<UpdateContractTypePage/>}/>
      <Route path="/review/:reviewId/update/contract/price" element={<UpdateContractPricePage/>}/>
      <Route path="/review/:reviewId/update/filter-ad" element={<UpdateAdventagePage/>}/>
      <Route path="/review/:reviewId/update/filter-disad" element={<UpdateDisadventagePage/>}/>
      <Route path="/review/:reviewId/update/content" element={<UpdateContentPage/>}/>
      <Route path="/review/:reviewId/update/dormitory" element={<UpdateDormitoryInputPage />} />
      <Route path="/review/:reviewId/update/dormitory-conditions" element={<UpdateDormitoryConditionsPage />} />
      <Route path="/review/:reviewId/update/dormitory-amenities" element={<UpdateDormitoryAmenitiesPage />} />
      <Route path="/review/:reviewId/update/photo-upload" element={<UpdatePhotoUploadPage />} />
      <Route path="/content" element={<ContentPage/>}/>
      <Route path="/content/:reportId" element={<ContentDetail/>} />
      <Route path="/admin/content/login" element={<ContentLoginPage/>} />
      <Route path="/admin/content" element={<ContentManagePage/>} />
      <Route path="/admin/content/write" element={<ContentWritePage/>} />
      <Route path="/admin/content/edit/:reportId" element={<ContentWritePage/>} />
      <Route path="/event/review/write" element={<EventReviewPage/>} />
      <Route path="/event/address-search" element={<EventAddressSearchPage/>} />
      </Routes>
      {showHeaderAndNav && <Nav />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient} >
        <BrowserRouter>
          <AppContent />
          <ModalBottomSheet />
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
