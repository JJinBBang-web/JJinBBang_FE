import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  JjinFilterState,
  FilterCategory,
  FilterItem,
} from '../../recoil/util/filterRecoilState';
import styles from '../../styles/review/ReviewAdvantage.module.css';
import closeIcon from '../../assets/image/iconClose.svg';

interface LocationState {
  photos?: string[];
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

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    // 다음 단계로 이동하면서 선택된 장점 정보 전달
    navigate('/review/filter-disad', {
      state: {
        photos,
        advantages: selectedFilters,
      },
    });
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

        <h1 className={styles.title}>이 찐빵의 장점은 무엇인가요?</h1>
        <p className={styles.sub_title}>(최대 {maxSelections}개 선택 가능)</p>

        <div className={styles.content}>
          {filters.map((category: FilterCategory) => (
            <div className={styles.jjin_filter_wrap} key={category.id}>
              <p className={styles.filter_title}>{category.category}</p>
              <div className={styles.jjin_filter}>
                {category.filter.map((item: FilterItem, index: number) => (
                  <button
                    key={index}
                    className={`${styles.filter_btn} ${
                      selectedFilters.includes(item.label)
                        ? styles.selected
                        : ''
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
    </div>
  );
};

export default ReviewAdvantagePage;
