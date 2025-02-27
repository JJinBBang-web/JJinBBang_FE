import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  JjinFilterState,
  FilterCategory,
  FilterItem,
} from '../../recoil/util/filterRecoilState';
import styles from '../../styles/review/ReviewAdvantage.module.css';
import iconClose from '../../assets/image/iconClose.svg';

// 위치 상태 인터페이스 정의
interface LocationState {
  photos?: string[]; // 업로드한 사진 URL 배열
}

const ReviewAdvantagePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { photos } = (location.state as LocationState) || {};
  const filters = useRecoilValue<FilterCategory[]>(JjinFilterState);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const maxSelections = 5;

  // 필터 선택 토글 함수
  const handleFilterClick = (label: string) => {
    if (selectedFilters.includes(label)) {
      setSelectedFilters(
        selectedFilters.filter((item: string) => item !== label)
      );
    } else if (selectedFilters.length < maxSelections) {
      setSelectedFilters([...selectedFilters, label]);
    }
  };

  // 뒤로가기 함수
  const handleGoBack = () => {
    navigate(-1);
  };

  // 다음 단계로 이동하는 함수
  const handleNext = () => {
    // 다음 단계로 이동하면서 선택된 장점 정보 전달
    navigate('/review/disadvantage', {
      state: {
        photos,
        advantages: selectedFilters,
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
      {/* 업로드한 사진 미리보기
       {photos && photos.length > 0 && (
         <div className={styles.photo_preview}>
           <img
             src={photos[0]}
             alt="업로드한 사진"
             className={styles.preview_image}
           />
         </div>
       )} */}
      <div className={styles.content}>
        <div className={styles.title_area}>
          <h1 className={styles.main_title}>이 찐빵의 장점은 무엇인가요?</h1>
          <p className={styles.sub_title}>(최대 {maxSelections}개 선택 가능)</p>
        </div>
        {filters.map((category: FilterCategory) => (
          <div className={styles.jjin_filter_wrap} key={category.id}>
            <p className={styles.title}>{category.category}</p>
            <div className={styles.jjin_filter}>
              {category.filter.map((item: FilterItem, index: number) => (
                <button
                  key={index}
                  className={`${styles.filter_btn} ${
                    selectedFilters.includes(item.label) ? styles.selected : ''
                  }`}
                  onClick={() => handleFilterClick(item.label)}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={styles.filter_icon}
                  />
                  <p className={styles.filter_text}>{item.label}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={() => navigate(-1)}>
          이전
        </button>
        <button
          className={`${styles.nextButton} ${
            selectedFilters.length > 0 ? styles.enabled : ''
          }`}
          onClick={handleNext}
          disabled={selectedFilters.length === 0}
        >
          다음
        </button>
      </footer>
    </div>
  );
};

export default ReviewAdvantagePage;
