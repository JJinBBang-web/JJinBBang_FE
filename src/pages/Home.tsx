// Home.tsx
import React, { useEffect, useState, useMemo } from "react";
import styles from "./Home.module.css";
import home_logo from "../assets/logo/homeLogo.svg";
import campus_icon from "../assets/image/campusIcon.svg";
import Banner from "../components/Banner";
import CampusSlide from "../components/CampusSlide";
import PreviewReview from "../components/PreviewReview";
import campus_img_1 from "../assets/image/campusImg1.svg";
import emptyCharacterIcon from "../assets/image/emptyCharacterIcon.svg";
import pencil from "../assets/image/pencil.svg";
import iconRight from "../assets/image/iconRight.svg";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAPI, putAPI, deleteAPI } from "../api/baseAPI";
import { isLoginState } from "../recoil/auth/isLoginState";
import { useRecoilState, useRecoilValue } from "recoil";

const api = {
  code: 200,
  message: '조회 성공',
  data: {
    reviews: [
      {
        dormitoryBasicInfo: {
          id: 1,
          name: '지희관',
          universityName: '경상국립대',
          type: '기숙사',
          floor: '고층', // 옥탑방은 0, 반지하는 -1
          space: 26.44,
          dormFee: 10,
          rating: 3,
          liked: true, // false
        },
        reviewInfo: {
          content:
            '집이 너무 깔끔하고 좋아요. 다만 조식이 맛이 없어요. 다른 기숙사에 비해 조식이 맛이 없어요. 하지만 조식이 맛이 좋아요',
          keywords: [
            'PO_BD_LO_02',
            'PO_BD_LO_01',
            'PO_BD_LO_04',
            'PO_BD_LO_01', // ... 필요한 키워드 추가
            'PO_BD_LO_01',
          ],
          likesCount: 120,
          updatedAt: new Date('2025-02-23T04:06:00.000+09:00'), // yyyy-MM-dd'T'HH:mm:ss.SSSXXX 형식
        },
        image: 'http://localhost:8080/image/1.jpg',
      },
      {
        basicInfo: {
          reviewId: 2,
          name: '한솔원룸',
          type: '투룸',
          contractType: '전세',
          deposit: 2000,
          monthlyRent: 0,
          floor: '저층',
          space: 35.5,
          maintenanceCost: 5,
          rating: 4,
          liked: false,
        },
        reviewInfo: {
          content: '주변이 조용하고 살기 좋아요.',
          keywords: [
            'PO_BD_LO_02',
            'PO_BD_LO_01',
            'PO_BD_LO_04',
            'PO_BD_LO_01', // ... 필요한 키워드 추가
            'PO_BD_LO_01',
          ],
          likesCount: 18,
          updatedAt: new Date('2025-02-23T04:06:00.000+09:00'),
        },
        image: campus_img_1,
      },
      {
        basicInfo: {
          reviewId: 3,
          name: '강남하우스',
          type: '오피스텔',
          contractType: '월세',
          deposit: 1000,
          monthlyRent: 70,
          floor: '중층',
          space: 42.7,
          maintenanceCost: 15,
          rating: 5,
          liked: true,
        },
        reviewInfo: {
          content: '채광이 좋고 전망이 멋져요.',
          keywords: [
            'PO_BD_LO_02',
            'PO_BD_LO_01',
            'PO_BD_LO_04',
            'PO_BD_LO_01', // ... 필요한 키워드 추가
            'PO_BD_LO_01',
          ],
          likesCount: 12,
          updatedAt: new Date('2025-02-23T04:06:00.000+09:00'),
        },
        image: campus_img_1,
      },
    ] as any[],
  },
};

const campus_api = {
  code: 200,
  message: '조회 성공',
  data: {
    campusList: [
      {
        id: 1,
        campusName: '가좌캠퍼스',
        logoImageUrl: 'http://localhost:8080/~~~',
        campusAddress: '경상남도 진주시 ~~',
        latitude: 37.5605,
        longitude: 127.0103,
      },
      {
        id: 2,
        campusName: '칠암캠퍼스',
        logoImageUrl: null, // 이미지가 없는 경우
        campusAddress: '경상남도 진주시 ~~',
        latitude: 37.5605,
        longitude: 127.0103,
      },
      {
        id: 3,
        campusName: '통영캠퍼스',
        logoImageUrl: 'http://localhost:8080/~~~',
        campusAddress: '경상남도 진주시 ~~',
        latitude: 37.5605,
        longitude: 127.0103,
      },
    ],
  },
};

const QUERY_KEYS = {
  userData: "USER_DATA",
  campusData: "CAMPUS_DATA",
  reviewData: "RECENT_REVIEW_DATA",
  univData: "UNIV_DATA",
};

const Home: React.FC = () => {
  const queryClient = useQueryClient();

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
        `/api/v1/user/univ/campus?universityName=${userData?.university}`
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
      currentUniv.code < minUniv.code ? currentUniv : minUniv
    )?.name || null;

  const {
    data: campusListGuest,
    isFetching: isFetchingCampusGuest,
    isError: isErrorCampusGuest,
  } = useQuery({
    queryKey: [QUERY_KEYS.campusData, "guest"],
    queryFn: async () => {
      const response = await getAPI(
        `/api/v1/user/univ/campus?universityName=${university}`
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

  const rawReviewList = localStorage.getItem("reviewList");

  const reviewList =
    rawReviewList &&
    rawReviewList.startsWith("[") &&
    rawReviewList.endsWith("]")
      ? rawReviewList.slice(1, -1)
      : null;

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
        true
      );
      return response.data;
    },
    enabled: isLogin && !!reviewList,
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
    console.log("로딩 중...");
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.status_bar} />
        <div className={styles.header_logo}>
          <img src={home_logo} alt="home_logo" />
        </div>
      </div>
      <Banner />
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
        <img src={iconRight} alt="iconRight" />
      </div>
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
                  key={
                    review.basicInfo?.reviewId ?? review.dormitoryBasicInfo?.id
                  } // `any`로 강제 타입 지정
                  review={review}
                />
              </>
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
  );
};

export default Home;
