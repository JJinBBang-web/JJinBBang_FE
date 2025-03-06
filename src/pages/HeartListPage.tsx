import React, { useEffect, useState, useMemo } from "react";
import { useRecoilState } from "recoil";
import styles from "./HeartListPage.module.css";
import Banner from "../components/Banner";
import PreviewReview from "../components/PreviewReview";
import downIcon from "../assets/image/downIcon.svg";
import campus_img_1 from "../assets/image/campusImg1.svg";
import FilterModal from "../components/hartListPage/FilterModal";
import { isFilterModalOpenState } from "../recoil/hartListPage/isFilterModalOpenState";

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
          keywords: ["NE_ST_07", "NE_MT_03", "NE_MT_02"],
          likesCount: 12,
          updatedAt: new Date("2025-02-23T04:06:00.000+09:00"),
        },
        image: campus_img_1,
      },
    ],
  },
};

const Heart: React.FC = () => {
    const [isOpen, setIsOpen] = useRecoilState(isFilterModalOpenState);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header} />
        <Banner />
        <div className={styles.bookmarkContainer}>
          <div className={styles.filterContainer}>
            <div className={styles.filter} onClick={() => setIsOpen((prev) => !prev)}>
              <p className={styles.filterText}>필터</p>
              <img className={styles.filterImg} src={downIcon} alt="downIcon" />
            </div>
          </div>
          {api.data.reviews.map((review) => (
            <div style={{width:"320px"}}>
              <div className={styles.line} />

              <PreviewReview
                key={(review as any).basicInfo.id} // `any`로 강제 타입 지정
                image={(review as any).image}
                basicInfo={(review as any).basicInfo}
                reviewInfo={(review as any).reviewInfo}
              />
            </div>
          ))}
        </div>
      </div>
      <FilterModal />
    </>
  );
};

export default Heart;
