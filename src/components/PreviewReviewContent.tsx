import React, { useRef, useState, useEffect } from "react";
import styles from "./PreviewReviewContent.module.css";
import heartIcon from "../assets/image/heartIcon.svg";
import { tagMessages, tagImages } from "./Tag";

interface PreviewReviewContentProps {
  reviewInfo: {
    content: string; // 리뷰 내용
    keywords: string[]; // 태그 목록
    likesCount: number;
    updatedAt: Date;
  };
}

const PreviewReviewContent: React.FC<PreviewReviewContentProps> = ({
  reviewInfo: { content, keywords, likesCount, updatedAt },
}) => {
  return (
    <div className={styles.reviewContainer}>
      <p className={styles.reviewContent}>{content}</p>
      <div className={styles.tagContainer}>
        {keywords.map((keyword, index) => (
          <div key={index} className={styles.tag}>
            <img className={styles.tagImg} src={tagImages[keyword]} alt={keyword} />
            <p className={styles.tagText}>{tagMessages[keyword]}</p>
          </div>
        ))}
      </div>
      <div className={styles.dateLikeContainer}>
        <p className={styles.date}>{updatedAt.toLocaleDateString("ko-KR")} </p>
        <div className={styles.likeContainer}>
          <img className={styles.likeImg} src={heartIcon} alt="heart" />
          <p className={styles.likeNum}>
            {likesCount > 99 ? "99+" : likesCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewReviewContent;
