import React, { useEffect, useState } from "react";
import styles from "./ContentDetail.module.css"
import Header from "../../components/Header";
import sample from "../../assets/image/content/sample.png"
import ContentFooter from "../../components/content/ContentFooter";
import { useNavigate } from "react-router-dom";


const ContentDetail: React.FC = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.visualViewport?.height || window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        
        // 초기 로드 시 한 번 실행
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    return (         
        <div className={styles.content} style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            <div className={styles.container}>
                <Header onClick={handleBack}/>
                <div className={styles.section}>
                    <div className={styles.category}>카테고리</div>
                    <div className={styles.titleWrap}>
                        <p className={styles.title}>대학가 자취방 고민? 리뷰 보고 확인하자!! 🌟</p>
                        <p className={styles.date}>2025.11.10</p>
                    </div>
                    <div className={styles.contentWrap}>
                        <p className={styles.contentText}>
                            찐빵(Jjinbbang)은 대학생을 위한 ‘실거주 환경 리뷰'에 특화된 자취방 정보 공유 웹이에요.
                            부동산 앱의 정형화된 정보만으로는 알 수 없었던 방의 진짜 모습을 ‘찐 리뷰’를 통해 확인할 수 있었죠. 사용자가 직접 거주해 겪었던 방음, 채광, 수압, 동네 치안고 같은 생생한 경험을 공유하면, 다른 사용자들이 그 리뷰를 바탕으로 더 나은 자취방을 구할 수 있답니다.
                            단순한 매물 정보를 넘어, 내가 살게 될 집의 장단점을 미리 파악하고 ‘실패 없는 자취'를 시작할 수 있다는 점이 특징이에요.
                        </p>
                        <img className={styles.contentImg} src={sample}/>
                    </div>
                </div>
                <ContentFooter likes={3200} views={3200} />
            </div>
        </div>
    );
}

export default ContentDetail;