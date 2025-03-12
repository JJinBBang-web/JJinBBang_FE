import { useEffect, useState } from 'react';
import styles from './Review.module.css'
import Header from '../components/Header';
import ImageSlider from '../components/detail/ImageSlider';
import TopButton from '../components/util/TopButton';
import ReviewInfo from '../components/detail/ReviewInfo';
import ReveiwContractInfo from '../components/detail/ReviewContractInfo';
import ReviewMapInfo from '../components/detail/ReviewMapInfo';

const Review: React.FC = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
        
        useEffect(() => {
            const handleResize = () => {
                setWindowHeight(window.visualViewport?.height || window.innerHeight);
            };
    
            window.addEventListener('resize', handleResize);
            
            // 초기 로드 시 한 번 실행
            handleResize();
    
            return () => window.removeEventListener('resize', handleResize);
        })
        
    return (
        <div className={styles.content}
        style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            <div className={styles.container}>
                {/* 헤더 */}
                <Header/>
                {/* 이미지슬라이더 */}
                <ImageSlider/>
                {/* 리뷰 정보 및 키워드 */}
                <ReviewInfo/>
                <hr className={styles.divider}/>
                {/* 계약형태 */}
                <ReveiwContractInfo/>
                <hr className={styles.divider}/>
                {/* 단지정보 */}
                <ReviewMapInfo/>
            </div>
            <TopButton/>
        </div>
    )
}

export default Review;