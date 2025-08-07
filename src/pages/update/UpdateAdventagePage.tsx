import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./UpdateAdventagePage.module.css";
import backArrowIcon from "../../assets/image/backArrowIcon.svg";
import { useRecoilState, useRecoilValue } from "recoil";
import { updateReviewState } from "../../recoil/review/updateReviewAtoms";
import { FilterCategory, FilterItem, JjinAgencyFilterState, JjinFilterState } from "../../recoil/util/filterRecoilState";
import { DormFilterState } from "../../recoil/util/dormFilterState";
import { useRef, useState } from "react";
import { koreanToType } from "../../util/mapping";

const UpdateAdventagePage:React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state || {};
    const { housingType, advantages, from } = locationState;
    const [review,setReview] = useRecoilState(updateReviewState);

    const filters = useRecoilValue<FilterCategory[]>(
        housingType === "AGENCY" ? JjinAgencyFilterState : JjinFilterState
      );
    const dormFilters = useRecoilValue<FilterCategory[]>(DormFilterState);
    
    const isDormitory = housingType === 'DORMITORY';
    const currentFilters = isDormitory ? dormFilters : filters;
    const maxSelections = 5;
    const contentRef = useRef<HTMLDivElement>(null);

    
    const { reviewId } = useParams();

    const [selectedFilters, setSelectedFilters] = useState<string[]>(() => {
        const rawKeys = Array.isArray(advantages) ? advantages : review?.pros || [];

        const allFilters = [...dormFilters, ...filters];
        const allItems = allFilters.flatMap(f => [...f.positiveFilters, ...f.negativeFilters]);

        const labelsFromKeys = rawKeys.map(key => {
            const item = allItems.find(item => item.key === key);
            return item?.label;
        }).filter((label): label is string => !!label); // 필터: undefined 제거

        return labelsFromKeys;
    });

    console.log(advantages);

    const handleBack = () => {
        // 수정 모드일 경우
        if (locationState.from === "update") {
        navigate(`/review/${reviewId}/update`, {
            state: {
            ...location.state,
            },
        });
        }
    };

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
        if (!review) return;

        // 모든 필터 아이템 모으기
        const allFilters = [...dormFilters, ...filters];
        const allItems = allFilters.flatMap(f => [...f.positiveFilters, ...f.negativeFilters]);

        // selectedFilters = label 배열 → key 배열로 변환
        const keysToSave = selectedFilters
            .map(label => allItems.find(item => item.label === label)?.key)
            .filter((key): key is string => !!key); // undefined 제거

        const updatedReview = {
            ...review,
            pros: keysToSave,
        };

        setReview(updatedReview);
        localStorage.setItem('updateReviewState', JSON.stringify(updatedReview));

        if (from === 'update') {
            navigate(`/review/${reviewId}/update`, {
            state: {
                ...location.state,
                advantages: keysToSave, // 상태도 key 배열로 넘겨줘야 나중에 다시 사용할 수 있음
            },
            });
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
            onClick={handleBack}
          >
            <img src={backArrowIcon} alt="close" />
          </button>
          <h1>
            {housingType === '공인중개사'
              ? '이 공인중개사의 장점은 무엇인가요?'
              : '이 찐빵의 장점은 무엇인가요?'}
          </h1>
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
          확인
        </button>
      </footer>
    </div>
  );
};

export default UpdateAdventagePage;