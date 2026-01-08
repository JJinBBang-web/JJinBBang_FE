import React, { useState, useEffect } from 'react';
import styles from './PreviewReviewContent.module.css';
import heartIcon from '../../assets/image/heartIcon.svg';
import { tagMessages, tagImages } from '../../constants/Tag';

interface PreviewReviewContentProps {
  reviewInfo: {
    content: string; // 리뷰 내용
    keyword: string[]; // 태그 목록
    likeCount: number;
    updateAt: string;
  };
}
const MAX_WIDTH = 292; // 최대 너비

// 리뷰 텍스트 자르기 함수
const truncateReviewText = (text: string): string => {
  if (!text) return 'Please write a review';
  
  const maxChars = 50;
  
  if (text.length > maxChars) {
    return text.slice(0, maxChars) + '...';
  }
  
  return text;
};

const PreviewReviewContent: React.FC<PreviewReviewContentProps> = ({
  reviewInfo: { content, keyword, likeCount, updateAt },
}) => {
  const [visibleKeywords, setVisibleKeywords] = useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = useState(0);
  const date = new Date(updateAt); // 날짜/시간 문자열을 Date 객체로 파싱

  const year = date.getFullYear();

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const dateTimeString = `${year}.${month}.${day}`;

  useEffect(() => {
    let usedWidth = 0;
    const tempVisible: string[] = [];
    let tempHidden = 0;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.font = '400 13.545px Inter';

    if (keyword) {
      for (let i = 0; i < keyword.length; i++) {
        const letterSpacing = -0.581;
        const text = tagMessages[keyword[i]] || keyword[i];
        const baseWidth = ctx!.measureText(text).width;

        // 글자 수만큼 letter-spacing 적용 (마지막 글자는 적용 안됨)
        const spacingAdjustment = (text.length - 1) * letterSpacing;
        const tagWidth = baseWidth + spacingAdjustment + 28;

        if (usedWidth + tagWidth > MAX_WIDTH) {
          tempHidden = keyword.length - i;
          break;
        }

        usedWidth += tagWidth;

        tempVisible.push(keyword[i]);
      }
    }

    if (tempHidden !== 0) {
      const letterSpacing = -0.581;
      const text = '+' + tempHidden.toString();
      const baseWidth = ctx!.measureText(text).width;
      const spacingAdjustment = (text.length - 1) * letterSpacing;

      const tagWidth = baseWidth + spacingAdjustment + 9;

      // console.log("+" + tempHidden.toString(), tagWidth);
      if (usedWidth > MAX_WIDTH - tagWidth) {
        tempVisible.pop();
        tempHidden -= 1;
      }
    }

    setVisibleKeywords(tempVisible);
    setHiddenCount(tempHidden);
  }, [keyword]);

  return (
    <div className={styles.reviewContainer}>
      <p className={styles.reviewContent}>{truncateReviewText(content)}</p>
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
        <p className={styles.date}>{dateTimeString}</p>
        <div className={styles.likeContainer}>
          <img className={styles.likeImg} src={heartIcon} alt="heart" />
          <p className={styles.likeNum}>{likeCount > 99 ? '99+' : likeCount}</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewReviewContent;
