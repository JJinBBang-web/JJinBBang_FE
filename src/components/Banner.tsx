import React from "react";
import styles from "./Banner.module.css";
import banner_jjinbbang from "../assets/image/bannerJJinBBang.svg";


const Banner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.banner_text_container}>
        <p className={styles.banner_text_1}>
          검증된 학생들의 진짜 후기가 궁금하다면?
        </p>
        <p className={styles.banner_text_2}>언제든 찐빵과 함께해봐!</p>
      </div>
      <img
        className={styles.banner_img}
        src={banner_jjinbbang}
        alt="banner_jjinbbang"
      />
    </div>
  );
};

export default Banner;
