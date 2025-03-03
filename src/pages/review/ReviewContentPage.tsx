import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { reviewState } from '../../recoil/review/reviewAtoms';
import styles from '../../styles/review/ReviewContent.module.css';
import closeIcon from '../../assets/image/iconClose.svg';

interface LocationState {
  photos?: string[];
  advantages?: string[];
  disadvantages?: string[];
  from?: string;
}

const AutoHeightTextarea: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  maxLength: number;
}> = ({ value, onChange, placeholder, maxLength }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formattedPlaceholder =
    '찐거주 후기를 위해 특징과 장단점을 적어주세요! 자세한 이야기는 찐빵 유저들에게 큰 도움이 돼요!\n\nex) 학교까지의 거리, 집주인과의 문제';

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'inherit';
    const computedHeight = Math.max(150, textarea.scrollHeight);
    textarea.style.height = `${computedHeight}px`;
  };

  useLayoutEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={styles.contentTextarea}
      value={value}
      onChange={onChange}
      placeholder={formattedPlaceholder}
      maxLength={maxLength}
      autoFocus
    />
  );
};

const ReviewContentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { photos, advantages, disadvantages, from } =
    (location.state as LocationState) || {};

  const [review, setReview] = useRecoilState(reviewState);
  const [content, setContent] = useState(review.description || '');

  useEffect(() => {
    if (from === 'confirm') {
      setContent(review.description || '');
    }
  }, [from, review]);

  const maxLength = 1000;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setContent(e.target.value);
    }
  };

  const handleNext = () => {
    if (content.trim().length === 0) {
      alert('내용을 입력해주세요.');
      return;
    }

    const updatedReview = {
      ...review,
      description: content,
    };

    setReview(updatedReview);
    localStorage.setItem('reviewState', JSON.stringify(updatedReview));

    if (from === 'confirm') {
      navigate('/review/confirm', {
        state: {
          ...location.state,
          content,
        },
      });
    } else {
      navigate('/review/confirm', {
        state: {
          photos,
          advantages,
          disadvantages,
          content,
        },
      });
    }
  };

  const handleBack = () => {
    if (from === 'confirm') {
      navigate('/review/confirm');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="content">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => navigate('/mypage')}
          >
            <img src={closeIcon} alt="close" />
          </button>
        </header>
        <h1 className={styles.title}>
          마지막으로 이 찐빵에 대해
          <br></br>좀 더 자세하게 알려줄 수 있나요?
        </h1>
        <div className={styles.textareaContainer}>
          <AutoHeightTextarea
            value={content}
            onChange={handleContentChange}
            placeholder=""
            maxLength={maxLength}
          />
          <div className={styles.charCount}>
            <span>{content.length}</span>
            <span>/{maxLength}</span>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={handleBack}>
          이전
        </button>
        <button
          className={`${styles.nextButton} ${
            content.trim().length > 0 ? styles.enabled : ''
          }`}
          onClick={handleNext}
          disabled={content.trim().length === 0}
        >
          다음
        </button>
      </footer>
    </div>
  );
};

export default ReviewContentPage;
