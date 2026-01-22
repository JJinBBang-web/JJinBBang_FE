// Home.tsx
import React from "react";
import styles from "./Home.module.css";
import home_logo from "../assets/logo/homeLogo.svg";
import campus_icon from "../assets/image/campusIcon.svg";
import Banner from "../components/Banner";
import CampusSlide from "../components/CampusSlide";
import PreviewReview from "../components/PreviewReview";
import emptyCharacterIcon from "../assets/image/emptyCharacterIcon.svg";
import pencil from "../assets/image/pencil.svg";
import iconRight from "../assets/image/iconRight.svg";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "../api/baseAPI";
import { isLoginState } from "../recoil/auth/isLoginState";
import { useRecoilValue } from "recoil";
import MetaTag from "../util/SEOMetaTag";
import BannerCarousel from "../components/BannerCarousel";
import PopupSheet from "../components/util/Popup";
import ReviewEventBanner from "../assets/image/content/banner/ReviewEventbanner.png";
import { useNavigate } from "react-router-dom";

const getReviewKey = (review: any) => {
  if (review.generalReviewInfo) return `general-${review.generalReviewInfo.id}`;
  if (review.dormitoryReviewInfo)
    return `dormitory-${review.dormitoryReviewInfo.id}`;
  if (review.agencyReviewInfo) return `agency-${review.agencyReviewInfo.id}`;
  return "unknown";
};

const QUERY_KEYS = {
  userData: "USER_DATA",
  campusData: "CAMPUS_DATA",
  reviewData: "RECENT_REVIEW_DATA",
  univData: "UNIV_DATA",
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const isLogin = useRecoilValue(isLoginState);

  const {
    data: userData,
    isFetching: isFetchingUser,
    isError: isErrorUser,
  } = useQuery({
    queryKey: [QUERY_KEYS.userData],
    queryFn: async () => {
      const response = await getAPI(`/api/v1/user`, true);
      return response.data;
    },
    enabled: isLogin,
    refetchOnWindowFocus: false,
  });

  // ✅ 로그인한 경우에만 실행
  const {
    data: campusListLogin,
    isFetching: isFetchingCampusLogin,
    isError: isErrorCampusLogin,
  } = useQuery({
    queryKey: [QUERY_KEYS.campusData, "login"],
    queryFn: async () => {
      const response = await getAPI(
        `/api/v1/user/univ/campus?universityName=${userData?.university}`,
      );
      return response.data.campusList.map((campus: any) => ({
        img: campus.logoImageUrl || "default_image_url",
        univ: userData.university,
        campus: campus.campusName,
        latitude: campus.latitude,
        longitude: campus.longitude,
      }));
    },
    enabled: isLogin && !!userData?.university,
    refetchOnWindowFocus: false,
  });

  // ✅ 비로그인일 때만 실행
  const {
    data: universityList,
    isFetching: isFetchingUniversityList,
    isError: isErrorUniversityList,
  } = useQuery({
    queryKey: [QUERY_KEYS.univData, "guest"],
    queryFn: async () => {
      const response = await getAPI(`/api/v1/user/univ`);
      return response.data.map((univ: any) => ({
        name: univ.universityName,
        code: univ.universityName[0].charCodeAt(0),
      }));
    },
    enabled: !!!userData?.university,
    refetchOnWindowFocus: false,
  });

  const university =
    universityList?.reduce((minUniv: any, currentUniv: any) =>
      currentUniv.code < minUniv.code ? currentUniv : minUniv,
    )?.name || null;

  const {
    data: campusListGuest,
    isFetching: isFetchingCampusGuest,
    isError: isErrorCampusGuest,
  } = useQuery({
    queryKey: [QUERY_KEYS.campusData, "guest"],
    queryFn: async () => {
      const response = await getAPI(
        `/api/v1/user/univ/campus?universityName=${university}`,
      );
      return response.data.campusList.map((campus: any) => ({
        img: campus.logoImageUrl || "default_image_url",
        univ: university,
        campus: campus.campusName,
        latitude: campus.latitude,
        longitude: campus.longitude,
      }));
    },
    enabled: !!!userData?.university && !!university,
    refetchOnWindowFocus: false,
  });

  const campusList = campusListLogin || campusListGuest || [];
  const isFetchingCampus = isLogin
    ? isFetchingCampusLogin
    : isFetchingCampusGuest;

  const reviewDict = JSON.parse(localStorage.getItem("reviewList") || "{}");

  const reviewList = reviewDict[userData?.id] || "[]";

  const {
    data: reviewData,
    isFetching: isFetchingReviewInfo,
    isError: isErrorReviewInfo,
  } = useQuery({
    queryKey: [QUERY_KEYS.reviewData],
    queryFn: async () => {
      if (!reviewList) {
        return [];
      }
      const response = await getAPI(
        `/api/v1/user/recentReview?reviewIds=${reviewList}`,
        true,
      );
      return response.data;
    },
    enabled: isLogin && !!reviewDict && !!userData,
    refetchOnWindowFocus: false,
  });

  const validReviewData =
    Array.isArray(reviewData) && isLogin ? reviewData : [];

  if (
    isFetchingUser ||
    isFetchingCampus ||
    isFetchingReviewInfo ||
    isFetchingUniversityList
  ) {
    return null;
  }

  return (
    <>
      <MetaTag
        title="찐빵 | 자취 후기 공유 플랫폼"
        description="대학교 주변 원룸, 기숙사, 부동산 리뷰를 한눈에!"
        keywords="찐빵, 원룸, 자취방, 기숙사, 리뷰, 대학가, 부동산, 자취, 후기, 추천"
        imgsrc="https://jjinbbang.kr/seo/thumbnail.png"
        url="https://jjinbbang.kr/"
      />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.status_bar} />
          <div className={styles.header_logo}>
            <img src={home_logo} alt="home_logo" />
          </div>
        </div>
        {/* <Banner /> */}
        <BannerCarousel />
        <div className={styles.campus_container}>
          <div className={styles.campus_header}>
            <div className={styles.campus_icon}>
              <img src={campus_icon} alt="campus_icon" />
            </div>
            <p className={styles.campus_text_1}>찐빵과 함께하는 캠퍼스</p>
            <p className={styles.campus_text_2}>
              내 대학 근처의 찐 후기들만 모아 한눈에!
            </p>
          </div>
          <CampusSlide campusList={campusList} />
        </div>

        {/* 기존 safetyContainer 임시 주석처리
      <div className={styles.safetyContainer}>
        <img src={pencil} alt="pencil" />
        <div>
          <p className={styles.safetyText}>
            부동산 직거래, 안전하게 할 수 있을까?
          </p>
          <p className={styles.safetySubText}>
            찐빵이와 함께라면 어렵지 않아요!
          </p>
        </div>
        <div style={{ width: '9px', height: '100%' }}/>
      </div>
      */}
        <img
          src={ReviewEventBanner}
          alt="리뷰 이벤트 배너"
          style={{ width: "92%", cursor: "pointer", borderRadius: "16px" }}
          onClick={() => navigate("/event/review/write")}
        />
        <div className={styles.previewReviewContainer}>
          <div className={styles.previewHeader}>
            <p className={styles.previewTitle}>최근 본 찐빵 후기들</p>
            <p className={styles.previewText}>
              마음에 드는 후기는 관심등록해 보세요!
            </p>
          </div>

          {validReviewData.length > 0 ? (
            validReviewData.map((review: any) => {
              return (
                <div key={getReviewKey(review)}>
                  <div className={styles.line} />
                  <PreviewReview
                    review={review}
                    trackStep="1.1_home_PreviewReview"
                  />
                </div>
              );
            })
          ) : (
            <div className={styles.noReviewContainer}>
              <div className={styles.line} />
              <div className={styles.noReviewImgContainer}>
                <img src={emptyCharacterIcon} alt="emptyCharacterIcon" />
                <p className={styles.noReviewText}>
                  앗! 아직 최근 본 찐빵이 없어요!
                  <br />
                  지도에서 내 주변 찐빵을 둘러볼까요?
                </p>
              </div>
            </div>
          )}
        </div>
        <div />
      </div>
      <div />

      <PopupSheet />
    </>
  );
};

export default Home;
