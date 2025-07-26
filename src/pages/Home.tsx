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
import { getAPI, putAPI ,deleteAPI} from "../api/bassAPI";

const getReviewKey = (review: any) => {
  if (review.generalReviewInfo) return `general-${review.generalReviewInfo.id}`;
  if (review.dormitoryReviewInfo)
    return `dormitory-${review.dormitoryReviewInfo.id}`;
  if (review.agencyReviewInfo) return `agency-${review.agencyReviewInfo.id}`;
  return "unknown";
};

const QUERY_KEYS = {
  campusData: "CAMPUS_DATA",
  reviewData: "REVIEW_DATA",
};

const Home: React.FC = () => {
  const queryClient = useQueryClient();

  // 수정 예정
  const universityName = "경상국립대학교";

  const {
    data: campusList,
    isFetching: isFetchingCampus,
    isError: isErrorCampus,
  } = useQuery({
    queryKey: [QUERY_KEYS.campusData],
    queryFn: async () => {
      const response = await getAPI(
        `/api/v1/user/univ/campus?universityName=${universityName}`
      );

      return response.data.campusList.map((campus: any) => ({
        img: campus.logoImageUrl || "default_image_url",
        univ: "경상국립대학교",
        campus: campus.campusName,
      }));
    },
    refetchOnWindowFocus: false,
  });

  const rawReviewList = localStorage.getItem("reviewList");

  const reviewList =
    rawReviewList &&
    rawReviewList.startsWith("[") &&
    rawReviewList.endsWith("]")
      ? rawReviewList.slice(1, -1)
      : "";
  

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
    refetchOnWindowFocus: false,
  });
  
  if (isFetchingCampus || isFetchingReviewInfo) {
    console.log("로딩 중...");
    return null;
  }

  if (isErrorCampus || isErrorReviewInfo) {
    console.error("에러 발생");
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

      <div className={styles.safetyContainer} >
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

        {reviewData.length > 0 ? (
          reviewData.map((review: any) => {
            return (
              <div key={getReviewKey(review)}>
                <div className={styles.line} />
                <PreviewReview review={review} />
              </div>
            );
          })
        ) : (
          <div className={styles.noReviewContainer}>
            <div className={styles.line} />
            <img src={emptyCharacterIcon} alt="emptyCharacterIcon" />
            <p className={styles.noReviewText}>
              앗! 아직 최근 본 찐빵이 없어요!
              <br />
              지도에서 내 주변 찐빵을 둘러볼까요?
            </p>
          </div>
        )}
      </div>
      <div />
    </div>
  );
};

export default Home;
