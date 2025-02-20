import React, { useRef, useState, useEffect } from "react";
import styles from "./PreviewReview.module.css";
import campus_arrow from "../assets/image/image.png";
import heartIconOn from "../assets/image/heartIconOn.svg";
import heartIconOff from "../assets/image/heartIconOff.svg";
import starIconOn from "../assets/image/starIconOn.svg";
import starIconOff from "../assets/image/starIconOff.svg";

const images = Array.from({ length: 43 }, (_, index) =>
  require(`../assets/image/tag_img (${index + 1}).svg`)
);

interface PreviewReviewProps {
  img: string;
  name: string;
  liked: boolean;
  housing: string;
  price: string;
  floor: string;
  area: string;
  managementFee: string;
  rate: number;
  content: string;
  tag: number[];
}

const PreviewReview: React.FC<PreviewReviewProps> = ({
  img,
  name,
  liked,
  housing,
  price,
  floor,
  area,
  managementFee,
  rate,
  content,
  tag,
}) => {
  const [like, setLike] = useState(liked);
  return (
    <div className={styles.previewReviewContainer}>
      <div className={styles.line} />
      <div className={styles.buildingContainer}>
        <img className={styles.buildingImg} src={img} alt={name} />
        <div className={styles.buildingContentContainer}>
          <div className={styles.buildingContent1}>
            <p className={styles.buildingName}>{name}</p>
            <div className={styles.likeContainer}>
              <img
                className={styles.likeButton}
                onClick={() => setLike(!like)}
                src={like ? heartIconOn : heartIconOff}
                alt="heartIcon"
              />
              <p className={styles.likeNum}>999+</p>
            </div>
          </div>
          <div className={styles.buildingContent2}>
            <div className={styles.buildingPrice}>{housing}</div>
            <div className={styles.buildingPrice}>
              {housing} {price}
            </div>
          </div>
          <p className={styles.buildingContent3}>
            {floor}, {area} 관리비 {managementFee}
          </p>
          <div className={styles.buildingContent4}>
            {[...Array(rate)].map((_, index) => (
              <img key={index} src={starIconOn} alt="rate"></img>
            ))}
            {[...Array(5 - rate)].map((_, index) => (
              <img key={index} src={starIconOff} alt="rate"></img>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.reviewContainer}>
        <p className={styles.reviewContent}>{content}</p>
        <div className={styles.tagContainer}>
          <div className={styles.tag}>
            <img src={images[1]} alt="img" />
            <p className={styles.tagText}>좋은 방음</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewReview;
