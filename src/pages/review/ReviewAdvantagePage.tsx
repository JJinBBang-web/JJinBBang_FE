import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  JjinFilterState,
  FilterCategory,
  FilterItem,
} from '../../recoil/util/filterRecoilState';
// 기숙사 필터 import 추가
import { DormFilterState } from '../../recoil/util/dormFilterState';
import { reviewState } from '../../recoil/review/reviewAtoms';
import CancelModal from '../../components/review/CancelModal';
import { useCancelModal } from '../../util/useCancelModal';
import styles from '../../styles/review/ReviewAdvantage.module.css';
import closeIcon from '../../assets/image/iconClose.svg';
import backArrowIcon from '../../assets/image/backArrowIcon.svg';

interface LocationState {
  photos?: string[];
  from?: string;
  advantages?: string[];
}

const ReviewAdvantagePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { photos, from, advantages } = (location.state as LocationState) || {};
  // 두 가지 필터 모두 가져오기
  const filters = useRecoilValue<FilterCategory[]>(JjinFilterState);
  const dormFilters = useRecoilValue<FilterCategory[]>(DormFilterState);
  const [review, setReview] = useRecoilState(reviewState);

  // 기숙사 유형인지 체크
  const isDormitory = review.housingType === '기숙사';

  // 건물 유형에 따라 필터 선택
  const currentFilters = isDormitory ? dormFilters : filters;

  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    advantages || review.pros || []
  );
  const maxSelections = 5;
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    showCancelModal,
    handleCloseButtonClick,
    handleCancelModalClose,
    handleConfirmCancel,
  } = useCancelModal();

  useEffect(() => {
    // 수정 모드일 경우 기존 상태 복원
    if (from === 'confirm') {
      setSelectedFilters(review.pros || []);
    }
  }, [from, review]);

  const handleFilterClick = (label: string) => {
    setSelectedFilters((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : prev.length < maxSelections
        ? [...prev, label]
        : prev
    );
  };

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    const updatedReview = {
      ...review,
      pros: selectedFilters,
    };

    setReview(updatedReview);
    localStorage.setItem('reviewState', JSON.stringify(updatedReview));

    if (from === 'confirm') {
      navigate('/review/confirm', {
        state: {
          ...location.state,
          advantages: selectedFilters,
        },
      });
    } else {
      navigate('/review/filter-disad', {
        state: {
          ...location.state,
          advantages: selectedFilters,
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
            onClick={handleCloseButtonClick}
          >
            <img src={closeIcon} alt="close" />
          </button>
          <h1>이 찐빵의 장점은 무엇인가요?</h1>
          <p className={styles.sub_title}>(최대 {maxSelections}개 선택 가능)</p>
        </header>
        <div className={styles.content} ref={contentRef}>
          {currentFilters.map((category: FilterCategory) => (
            <div className={styles.jjin_filter_wrap} key={category.id}>
              <p className={styles.filter_title}>{category.category}</p>
              <div className={styles.jjin_filter}>
                {category.positiveFilters.map(
                  (item: FilterItem, index: number) => (
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
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className={styles.scrollTopButton} onClick={scrollToTop}>
        <img src={backArrowIcon} alt="위로 가기" />
      </button>
      <footer className={styles.footer}>
        <button className={styles.prevButton} onClick={handleBack}>
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

      {showCancelModal && (
        <CancelModal
          onClose={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
};

export default ReviewAdvantagePage;
