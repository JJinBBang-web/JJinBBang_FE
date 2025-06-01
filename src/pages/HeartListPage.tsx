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
        dormitoryBasicInfo: {
          id: 1,
          name: "지희관",
          universityName: "경상국립대",
          type: "기숙사",
          floor: "저층", // 옥탑방은 0, 반지하는 -1
          space: 26.44,
          dormitoryFee: 10,
          rating: 3,
          liked: true, // false
        },
        reviewInfo: {
          content: "집이 너무 깔끔하고...",
          keywords: ["PO_BD_ST_01", "PO_BD_MT_03", "NE_BD_LO_07"],
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
          floor: "고층",
          space: 35.5,
          maintenanceCost: 5,
          rating: 4,
          liked: false,
        },
        reviewInfo: {
          content: "주변이 조용하고 살기 좋아요.",
          keywords: ["PO_BD_ST_01", "PO_BD_MT_03", "NE_BD_LO_07"],
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

const Heart: React.FC = () => {
  const [isOpen, setIsOpen] = useRecoilState(isFilterModalOpenState);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header} />
        <Banner />
        <div className={styles.bookmarkContainer}>
          <div className={styles.filterContainer}>
            <div
              className={styles.filter}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <p className={styles.filterText}>필터</p>
              <img className={styles.filterImg} src={downIcon} alt="downIcon" />
            </div>
          </div>
          {api.data.reviews.map((review) => {
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
          })}
        </div>
      </div>
      <FilterModal />
    </>
  );
};

export default Heart;
