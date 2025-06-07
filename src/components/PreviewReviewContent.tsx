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
const MAX_WIDTH = 292; // 최대 너비
const PreviewReviewContent: React.FC<PreviewReviewContentProps> = ({
  reviewInfo: { content, keywords, likesCount, updatedAt },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleKeywords, setVisibleKeywords] = useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = useState(0);

  useEffect(() => {
    let usedWidth = 0;
    const tempVisible: string[] = [];
    let tempHidden = 0;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx!.font = "400 13.545px Inter";

    for (let i = 0; i < keywords.length; i++) {
      const letterSpacing = -0.581;
      const text = tagMessages[keywords[i]] || keywords[i];
      const baseWidth = ctx!.measureText(text).width;

      // 글자 수만큼 letter-spacing 적용 (마지막 글자는 적용 안됨)
      const spacingAdjustment = (text.length - 1) * letterSpacing;
      const tagWidth = baseWidth + spacingAdjustment + 28;

      
      if (usedWidth + tagWidth > MAX_WIDTH) {
        tempHidden = keywords.length - i;
        break;
      }

      usedWidth += tagWidth;

      tempVisible.push(keywords[i]);
    }
    
    if (tempHidden !== 0) {
      const letterSpacing = -0.581;
      const text = "+" + tempHidden.toString();
      const baseWidth = ctx!.measureText(text).width;
      const spacingAdjustment = (text.length - 1) * letterSpacing;

      const tagWidth = baseWidth + spacingAdjustment + 9;
      
      console.log("+" + tempHidden.toString(), tagWidth);
      if (usedWidth > MAX_WIDTH - tagWidth) {
        tempVisible.pop();
        tempHidden -= 1;
      }
    }


    setVisibleKeywords(tempVisible);
    setHiddenCount(tempHidden);
  }, [keywords]);

  return (
    <div className={styles.reviewContainer}>
      <p className={styles.reviewContent}>{content}</p>
      <div className={styles.tagContainer}>
        {visibleKeywords.map((keyword, index) => (
          <div key={index} className={styles.tag}>
            <img
              className={styles.tagImg}
              src={tagImages[keyword]}
              alt={keyword}
            />
            <p className={styles.tagText}>{tagMessages[keyword]}</p>
          </div>
        ))}
        {hiddenCount > 0 && (
          <div className={styles.tag}>
            <p className={styles.tagText}>+{hiddenCount}</p>
          </div>
        )}
      </div>
      <div className={styles.dateLikeContainer}>
        <p className={styles.date}>{updatedAt.toLocaleDateString("ko-KR")}</p>
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
