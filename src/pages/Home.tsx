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
        basicInfo: {
          id: 1, // 리뷰 ID
          name: "다희빌",
          type: "원룸",
          contractType: "월세",
          deposit: 500, // 보증금 (단위: 만원)
          monthlyRent: 45, // 월세 (단위: 만원)
          floor: 2, // 옥탑방은 0, 반지하는 -1
          space: 26.44, // 면적 (단위: m²)
          maintenanceCost: 10, // 관리비 (단위: 만원)
          rating: 3, // 별점 (1~5)
          liked: true, // 좋아요 여부
        },
        reviewInfo: {
          content: "집이 너무 깔끔하고...",
          keywords: ["PO_LO_01", "PO_MT_01", "PO_MT_04"], // 태그 키워드
          likesCount: 100,
          updatedAt: new Date("2025-02-23T04:06:00.000+09:00"), // ✅ Date 객체 사용
        },
        image: campus_img_1,
      },
      {
        basicInfo: {
          id: 2,
          name: "한솔원룸",
          type: "투룸",
          contractType: "전세",
          deposit: 2000,
          monthlyRent: 0,
          floor: 1,
          space: 35.5,
          maintenanceCost: 5,
          rating: 4,
          liked: false,
        },
        reviewInfo: {
          content: "주변이 조용하고 살기 좋아요.",
          keywords: ["PO_LO_02", "PO_ST_03", "PO_MT_02"],
          likesCount: 18,
          updatedAt: new Date("2025-02-23T04:06:00.000+09:00"),
        },
        image: campus_img_1,
      },
      {
        basicInfo: {
          id: 3,
          name: "강남하우스",
          type: "오피스텔",
          contractType: "월세",
          deposit: 1000,
          monthlyRent: 70,
          floor: 5,
          space: 42.7,
          maintenanceCost: 15,
          rating: 5,
          liked: true,
        },
        reviewInfo: {
          content: "채광이 좋고 전망이 멋져요.",
          keywords: ["PO_ST_01", "PO_MT_03", "NE_LO_07"],
          likesCount: 12,
          updatedAt: new Date("2025-02-23T04:06:00.000+09:00"),
        },
        image: campus_img_1,
      },
    ],
  },
};

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
        <CampusSlide
          campusList={[
            {
              img: campus_img_1, // 임시로 campus_icon 사용
              univ: "경상국립대학교",
              campus: "가좌캠퍼스",
            },
            {
              img: campus_img_1,
              univ: "경상국립대학교",
              campus: "칠암캠퍼스",
            },
            {
              img: campus_img_1,
              univ: "경상국립대학교",
              campus: "통영캠퍼스",
            },
            {
              img: campus_img_1,
              univ: "경상국립대학교",
              campus: "통영캠퍼스",
            },
            {
              img: campus_img_1,
              univ: "경상국립대학교",
              campus: "통영캠퍼스",
            },
            {
              img: campus_img_1, // 임시로 campus_icon 사용
              univ: "경상국립대학교",
              campus: "가좌캠퍼스",
            },
            {
              img: campus_img_1, // 임시로 campus_icon 사용
              univ: "경상국립대학교",
              campus: "가좌캠퍼스",
            },
            {
              img: campus_img_1, // 임시로 campus_icon 사용
              univ: "경상국립대학교",
              campus: "가좌캠퍼스",
            },
            {
              img: campus_img_1, // 임시로 campus_icon 사용
              univ: "경상국립대학교",
              campus: "가좌캠퍼스",
            },
            {
              img: campus_img_1, // 임시로 campus_icon 사용
              univ: "경상국립대학교",
              campus: "가좌캠퍼스",
            },
            {
              img: campus_img_1, // 임시로 campus_icon 사용
              univ: "경상국립대학교",
              campus: "가좌캠퍼스",
            },
            {
              img: campus_img_1, // 임시로 campus_icon 사용
              univ: "경상국립대학교",
              campus: "가좌캠퍼스",
            },
            {
              img: campus_img_1, // 임시로 campus_icon 사용
              univ: "경상국립대학교",
              campus: "가좌캠퍼스",
            },
          ]}
        />
      </div>
      <div className={styles.previewReviewContainer}>
        <div className={styles.previewHeader}>
          <p className={styles.previewTitle}>최근 본 찐빵 후기들</p>
          <p className={styles.previewText}>
            마음에 드는 후기는 관심등록해 보세요!
          </p>
        </div>

        {api.data.reviews.length > 0 ? (
          api.data.reviews.map((review) => (
            <div>
              <div className={styles.line} />

              <PreviewReview
                key={(review as any).basicInfo.id} // `any`로 강제 타입 지정
                image={(review as any).image}
                basicInfo={(review as any).basicInfo}
                reviewInfo={(review as any).reviewInfo}
              />
            </div>
          ))
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
      <div className={styles.adver}>
        <img src={adSense} alt="adSense" />
      </div>
    </div>
  );
};

export default Home;
