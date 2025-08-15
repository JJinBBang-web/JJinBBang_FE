import React, { useRef, useState, useEffect } from 'react';
import styles from './PreviewReviewContent.module.css';
import heartIcon from '../assets/image/heartIcon.svg';
import { tagMessages, tagImages } from './Tag';

interface PreviewReviewContentProps {
  reviewInfo: {
    content: string; // 리뷰 내용
    keyword: string[]; // 태그 목록
    likeCount: number;
    updateAt: string;
  };
}
const MAX_WIDTH = 292; // 최대 너비
const PreviewReviewContent: React.FC<PreviewReviewContentProps> = ({
  reviewInfo: { content, keyword, likeCount, updateAt },
}) => {
  const formatDate = (dateValue: any) => {
    if (!dateValue) return '';

    // 문자열인 경우 Date 객체로 변환
    const date =
      typeof dateValue === 'string' ? new Date(dateValue) : dateValue;

    // Invalid Date 체크
    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('ko-KR');
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleKeywords, setVisibleKeywords] = useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = useState(0);
  const date = new Date(updateAt); // 날짜/시간 문자열을 Date 객체로 파싱

  const year = date.getFullYear();

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const dateTimeString = `${year}.${month}.${day}`;
  

  useEffect(() => {
    let usedWidth = 0;
    const tempVisible: string[] = [];
    let tempHidden = 0;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.font = '400 13.545px Inter';

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
      <p className={styles.reviewContent}>{content}</p>
      <div className={styles.tagContainer}>
        {keywords.map((keyword, index) => (
          <div key={index} className={styles.tag}>
            <img
              className={styles.tagImg}
              src={tagImages[keyword]}
              alt={keyword}
            />
            <p className={styles.tagText}>{tagMessages[keyword]}</p>
          </div>
        ))}
      </div>
      <div className={styles.dateLikeContainer}>
        <p className={styles.date}>{dateTimeString}</p>
        <div className={styles.likeContainer}>
          <img className={styles.likeImg} src={heartIcon} alt="heart" />
          <p className={styles.likeNum}>
            {likesCount > 99 ? '99+' : likesCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewReviewContent;
