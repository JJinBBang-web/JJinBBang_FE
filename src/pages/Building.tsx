import { useEffect, useState } from "react";
import styles from "./Building.module.css"
import Header from "../components/Header";
import ImageSlider from "../components/detail/ImageSlider";
import BuildingInfo from "../components/detail/BuildingInfo";
import TopButton from "../components/util/TopButton";

const Building: React.FC = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.visualViewport?.height || window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        
        // 초기 로드 시 한 번 실행
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return (
        <div className={styles.content}
        style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            <div className={styles.container}>
                {/* 헤더 */}
                <Header/>
                {/* 이미지슬라이더 */}
                <ImageSlider/>
                {/* 건물 정보 및 키워드 */}
                <BuildingInfo/>
                <hr/>
                {/* 리뷰모음 */}
            </div>
            {/* 탑버튼 */}
            <TopButton/>
        </div>
    )
}

export default Building;