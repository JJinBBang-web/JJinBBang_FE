import React from "react";
import styles from "./BannerCarousel.module.css";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import banner1 from "../assets/image/content/banner/Banner1.svg";
import banner2 from "../assets/image/content/banner/Banner2.svg";


const BannerCarousel = () => {
  const navigation = useNavigate();

  const banners = [
    { id: 1, img: banner1, to: "/content" },
    { id: 2, img: banner2, to: "/content" },
  ];

   const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,

    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  return (
    <div className={styles.banner}>
        <Slider {...settings}>
            {banners.map((b) => (
            <div
                key={b.id}
                className={styles.slide}
                onClick={() => navigation(b.to)}
                role="button"
                tabIndex={0}
            >
                <img className={styles.img} src={b.img} alt={`banner-${b.id}`} />
            </div>
            ))}
      </Slider>
    </div>
  );
};

export default BannerCarousel;
