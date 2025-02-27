import React, { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/review/ReviewContent.module.css';
import iconClose from '../../assets/image/iconClose.svg';

interface LocationState {
  photos?: string[];
  advantages?: string[];
  disadvantages?: string[];
}

// 텍스트 에어리어 자동 높이 조절 컴포넌트
const AutoHeightTextarea: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  maxLength: number;
}> = ({ value, onChange, placeholder, maxLength }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'inherit';

    // 스크롤 높이만큼 높이 설정 (최소 150px)
    const computedHeight = Math.max(150, textarea.scrollHeight);
    textarea.style.height = `${computedHeight}px`;
  };

  // 컴포넌트 마운트, 업데이트 시 높이 조절
  useLayoutEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={styles.contentTextarea}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      autoFocus
    />
  );
};

const ReviewContentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { photos, advantages, disadvantages } =
    (location.state as LocationState) || {};

  const [content, setContent] = useState('');
  const maxLength = 1000;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 최대 글자수 내에서만 변경 허용
    if (e.target.value.length <= maxLength) {
      setContent(e.target.value);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    if (content.trim().length === 0) {
      alert('내용을 입력해주세요.');
      return;
    }

    navigate('/review/confirm', {
      state: {
        photos,
        advantages,
        disadvantages,
        content,
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleGoBack} className={styles.closeButton}>
          <img src={iconClose} alt="닫기" />
        </button>
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.title_area}>
          <p className={styles.main_title}>
            마지막으로 이 찐빵에 대해
            <br /> 좀 더 자세하게 알려줄 수 있나요?
          </p>
        </div>

        <div className={styles.textareaContainer}>
          <AutoHeightTextarea
            value={content}
            onChange={handleContentChange}
            placeholder="찐거주 후기를 위해 특징과 장단점을 적어주세요! 자세한 이야기는 짠빵 유저들에게 큰 도움이 돼요!&#13;&#10;ex) 학교까지의 거리, 집주인과의 문제"
            maxLength={maxLength}
          />
          <div className={styles.charCount}>
            <span>{content.length}</span>
            <span>/{maxLength}</span>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={() => navigate(-1)}>
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
