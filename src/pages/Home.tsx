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
import adSense from "../assets/image/adSense.svg";

const api = {
  code: 200,
  message: "조회 성공",
  data: {
    reviews: [
      {
        dormitoryBasicInfo: {
          id: 1,
          name: "지희관",
          universityName: "경상국립대",
          type: "기숙사",
          floor: "고층", // 옥탑방은 0, 반지하는 -1
          space: 26.44,
          dormitoryFee: 10,
          rating: 3,
          liked: true, // false
        },
        reviewInfo: {
          content: "집이 너무 깔끔하고...",
          keywords: [
            "PO_BD_LO_01",
            "PO_BD_MT_01",
            "PO_BD_MT_04", // ... 필요한 키워드 추가
          ],
          likesCount: 120,
          updatedAt: new Date("2025-02-23T04:06:00.000+09:00"), // yyyy-MM-dd'T'HH:mm:ss.SSSXXX 형식
        },
        image: "http://localhost:8080/image/1.jpg",
      },
      {
        basicInfo: {
          reviewId: 2,
          name: "한솔원룸",
          type: "투룸",
          contractType: "전세",
          deposit: 2000,
          monthlyRent: 0,
          floor: "저층",
          space: 35.5,
          maintenanceCost: 5,
          rating: 4,
          liked: false,
        },
        reviewInfo: {
          content: "주변이 조용하고 살기 좋아요.",
          keywords: ["PO_BD_LO_02", "PO_BD_ST_03", "PO_BD_MT_02"],
          likesCount: 18,
          updatedAt: new Date("2025-02-23T04:06:00.000+09:00"),
        },
        image: campus_img_1,
      },
      {
        basicInfo: {
          reviewId: 3,
          name: "강남하우스",
          type: "오피스텔",
          contractType: "월세",
          deposit: 1000,
          monthlyRent: 70,
          floor: "중층",
          space: 42.7,
          maintenanceCost: 15,
          rating: 5,
          liked: true,
        },
        reviewInfo: {
          content: "채광이 좋고 전망이 멋져요.",
          keywords: ["PO_BD_ST_01", "PO_BD_MT_03", "NE_BD_LO_07"],
          likesCount: 12,
          updatedAt: new Date("2025-02-23T04:06:00.000+09:00"),
        },
        image: campus_img_1,
      },
    ],
  },
};

const campus_api = {
  code: 200,
  message: "조회 성공",
  data: {
    campusList: [
      {
        id: 1,
        campusName: "가좌캠퍼스",
        logoImageUrl: "http://localhost:8080/~~~",
        campusAddress: "경상남도 진주시 ~~",
        latitude: 37.5605,
        longitude: 127.0103,
      },
      {
        id: 2,
        campusName: "칠암캠퍼스",
        logoImageUrl: null, // 이미지가 없는 경우
        campusAddress: "경상남도 진주시 ~~",
        latitude: 37.5605,
        longitude: 127.0103,
      },
      {
        id: 3,
        campusName: "통영캠퍼스",
        logoImageUrl: "http://localhost:8080/~~~",
        campusAddress: "경상남도 진주시 ~~",
        latitude: 37.5605,
        longitude: 127.0103,
      },
    ],
  },
};

const campusList = campus_api.data.campusList.map((campus) => ({
  img: campus.logoImageUrl || "default_image_url",
  univ: "경상국립대학교",
  campus: campus.campusName,
}));

const Home: React.FC = () => {
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
      <div className={styles.previewReviewContainer}>
        <div className={styles.previewHeader}>
          <p className={styles.previewTitle}>최근 본 찐빵 후기들</p>
          <p className={styles.previewText}>
            마음에 드는 후기는 관심등록해 보세요!
          </p>
        </div>

        {api.data.reviews.length > 0 ? (
          api.data.reviews.map((review) => {
            const hasBasicInfo = "basicInfo" in review;
            const hasDormitoryBasicInfo = "dormitoryBasicInfo" in review;

            return (
              <>
                <div className={styles.line} />
                <PreviewReview
                  key={review.basicInfo?.reviewId ?? review.dormitoryBasicInfo?.id} // `any`로 강제 타입 지정
                  review={review}
                />
              </>
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
