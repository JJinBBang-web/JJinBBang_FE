// Home.tsx
import React, { useEffect, useState, useMemo } from "react";
import styles from "./Home.module.css";
import home_logo from "../assets/logo/homeLogo.svg";
import campus_icon from "../assets/image/campusIcon.svg";
import Banner from "../components/Banner";
import CampusSlide from "../components/CampusSlide";
import PreviewReview from "../components/PreviewReview";
import campus_img_1 from "../assets/image/campusImg1.svg";

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
        <PreviewReview
          img={campus_img_1}
          name="건물명"
          liked={false}
          housing="원룸"
          price="50만원"
          floor="3층"
          area="24㎡"
          managementFee="5만원"
          rate={4}
          content="리뷰 내용입니다."
          tag={[1, 2, 3]}
        />
        <PreviewReview
          img={campus_img_1}
          name="건물명"
          liked={false}
          housing="원룸"
          price="50만원"
          floor="3층"
          area="24㎡"
          managementFee="5만원"
          rate={4}
          content="리뷰 내용입니다."
          tag={[1, 2, 3]}
        />
        <PreviewReview
          img={campus_img_1}
          name="건물명"
          liked={false}
          housing="원룸"
          price="50만원"
          floor="3층"
          area="24㎡"
          managementFee="5만원"
          rate={4}
          content="리뷰 내용입니다."
          tag={[1, 2, 3]}
        />
      </div>
    </div>
  );
};

export default Home;
