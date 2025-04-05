import styles from "./ImageSlider.module.css"
import imgIcon from "../../assets/image/imageIcon.svg"
import { Review } from "../../recoil/detail/ReviewInfoRecoliState";
import { Building } from "../../recoil/detail/BuildingRecoilState";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

interface Props {
    building : Building | null,
    review : Review | null
}

const ImageSlider:React.FC<Props> = ({building, review}) => {
    const images = building
    ? building.buildingImages.imageUrl
    : review?.reviewImages.imageUrl;

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (currentIndex < images?.length! - 1) {
            setCurrentIndex(currentIndex + 1);
            }
        },
        onSwipedRight: () => {
            if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            }
        },
        trackMouse: true, // 마우스 드래그도 가능하게
    });

    if (!images || images.length === 0) return null;

    const total = images.length;

    const getVisibleDots = (total: number, currentIndex: number) => {
        const maxDots = 10;
        const dots = [];
      
        if (total <= maxDots) {
          // total이 maxDots 이하일 경우 모든 dot을 표시
          for (let i = 0; i < total; i++) {
            dots.push({ index: i, scale: 1 });
          }
        } else {
          // 현재 index를 기준으로 보이는 범위 계산
          let start = Math.max(0, currentIndex - Math.floor(maxDots / 2));
          let end = Math.min(total - 1, start + maxDots - 1);
      
          // 범위 조정 (end가 maxDots보다 작을 때)
          if (end - start < maxDots - 1) {
            start = Math.max(0, end - (maxDots - 1));
          }
      
          for (let i = start; i <= end; i++) {
            let scale = 1;
      
            // 처음 범위 처리
            if (start === 0) {
              if (i >= end - 1) {
                // 마지막 두 개 dot 작아짐 (end-1과 end 포함)
                scale = Math.max((end-i) * 0.85, 0.65); // 최대 감소는 0.4
              }
            }
      
            // 마지막 범위 처리
            else if (end === total - 1) {
              if (i <= start + 1) {
                // 처음 두 개 dot 작아짐 (start와 start+1 포함)
                scale = Math.max((i - start) * 0.85, 0.65); // 최대 감소는 0.4
              }
            }
      
            // 중간 범위 처리
            else {
              if (
                i === start || 
                i === start + 1 || 
                i === end || 
                i === end - 1
              ) {
                // 맨 앞과 맨 뒤의 두 개씩 작아짐
                scale = 1 - Math.min(0.15 * (i === start || i === end ? 2 : 1), 0.35);
              }
            }
      
            dots.push({ index: i, scale });
          }
        }
      
        return dots;
      };
      
      
    

    const dots = getVisibleDots(total, currentIndex);
      

    return (
        <div className={styles.content}>
            <div className={styles.swipeWrapper} {...handlers}>
                <div
                    className={styles.slider}
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {images.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        className={styles.image}
                        alt={`slide-${i}`}
                        onDragStart={(e) => e.preventDefault()}
                    />
                    ))}
                </div>
                <div className={styles.imgCount} >
                    <img src={imgIcon} alt="imgIcon" style={{width:"18px", height:"18px"}}/>
                    {
                        building == null ? <p className={styles.count}>{review?.reviewImages.count}</p> : <p className={styles.count}>{building.buildingImages.count}</p>
                    }
            </div>
            </div>
            {/* Dots */}
            <div className={styles.dots}>
                <div className={styles.dotsContainer}>
                        <div
                            className={styles.dotsInner}
                            style={{
                                transition: 'transform 0.3s ease', // 부드러운 이동 애니메이션
                            }}
                        >
                        {dots.map(({ index, scale }) => (
                            <div
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                                style={{
                                transform: `scale(${scale})`,
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageSlider;