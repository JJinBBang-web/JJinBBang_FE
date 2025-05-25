import React, { useRef, useState, useEffect } from "react";
import styles from "./CampusSlide.module.css";
import campus_arrow from "../assets/image/campusArrow.svg";
import select_dot from "../assets/image/selectDot.svg";
import not_select_dot from "../assets/image/notSelectDot.svg";

const SLIDE_WIDTH = 173;

interface CampusItem {
  img: string;
  univ: string;
  campus: string;
  scrollLeft?: number; // ✅ 선택적(optional) 속성으로 변경
}


const Campus: React.FC<CampusItem> = ({ img, univ, campus,scrollLeft }) => {

  return (
    <div
      className={styles.campus}
      onClick={() => {
        
        if (typeof scrollLeft === "number" && scrollLeft % SLIDE_WIDTH === 0) {
          
          window.location.href = "https://www.naver.com"; // 현재 창에서 이동
        }
      }}
    >
      <img
        src={img}
        alt={`${univ} ${campus}`}
        draggable="false"
        className={styles.campus_image}
      />
      <p className={styles.univ_name}>{univ}</p>
      <div className={styles.campus_name_container}>
        <p className={styles.campus_name}>{campus}</p>
        <img src={campus_arrow} alt="campus_arrow" />
      </div>
    </div>
  );
};

interface CampusSlideProps {
  campusList: CampusItem[];
}

const CampusSlide: React.FC<CampusSlideProps> = ({ campusList }) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isSnapping, setIsSnapping] = useState(false); // 스냅 동작 중인지 확인하는 상태 추가

  const THRESHOLD = SLIDE_WIDTH / 16; // 임계값을 더 크게 설정
    const listToMap =
      campusList.length > 1 ? campusList.slice(0, -1) : campusList;


  const getClientX = (e: React.MouseEvent | React.TouchEvent): number => {
    if ("touches" in e) {
      return e.touches[0].pageX;
    }
    return (e as React.MouseEvent).pageX;
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    if (slideRef.current) {
      setStartX(getClientX(e));
      setScrollLeft(slideRef.current.scrollLeft);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    if (slideRef.current) {
      const x = getClientX(e);
      const walk = startX - x;
      slideRef.current.scrollLeft = (scrollLeft as number) + walk;
      setScrollLeft(slideRef.current.scrollLeft);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    snapToSlide();
  };

  const snapToSlide = React.useCallback(() => {
    if (!slideRef.current) return;

    // 현재 스크롤 위치와 인덱스를 직접 계산
    const currentScrollLeft = slideRef.current.scrollLeft;
    const calculatedIndex = Math.round(currentScrollLeft / SLIDE_WIDTH);
    const diff = currentScrollLeft - calculatedIndex * SLIDE_WIDTH;

    let newIndex = calculatedIndex;
    if (calculatedIndex === currentIndex) {
      if (diff > THRESHOLD) {
        newIndex = calculatedIndex + 1;
      } else if (diff < -THRESHOLD) {
        newIndex = calculatedIndex - 1;
      }
    }

    newIndex = Math.max(0, Math.min(newIndex, campusList.length - 2));
    slideRef.current.scrollTo({
      left: newIndex * SLIDE_WIDTH,
      behavior: "smooth",
    });
    setScrollLeft(slideRef.current.scrollLeft);
    setCurrentIndex(newIndex);
  }, [THRESHOLD, campusList.length, currentIndex]);

  const handleScroll = React.useCallback(() => {
    if (slideRef.current && !isSnapping) {
      const currentScrollLeft = slideRef.current.scrollLeft;
      setScrollLeft(currentScrollLeft);

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        setIsSnapping(true); // 스냅 시작
        snapToSlide();
        setTimeout(() => {
          setIsSnapping(false); // 스냅 완료
        }, 300); // smooth 스크롤 완료 시간 고려
      }, 50);
    }
  }, [isSnapping, snapToSlide]);

  useEffect(() => {
    if (isDragging) return;

    const currentSlideRef = slideRef.current;
    if (currentSlideRef) {
      currentSlideRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentSlideRef) {
        currentSlideRef.removeEventListener("scroll", handleScroll);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll, isDragging]);

  return (
    <div className={styles.campus_slide}>
      <div
        className={styles.campus_inner_slide}
        ref={slideRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
      >
        {campusList.map((item, index) => (
          <Campus
            key={index}
            img={item.img}
            univ={item.univ}
            campus={item.campus}
            scrollLeft={scrollLeft}
          />
        ))}
      </div>
      <div className={styles.dot_container}>
        {listToMap.map((item, index) => (
          <img
            key={index}
            src={index === currentIndex ? select_dot : not_select_dot}
            alt={index === currentIndex ? "select_dot" : "not_select_dot"}
          />
        ))}
      </div>
    </div>
  );
};

export default CampusSlide;
