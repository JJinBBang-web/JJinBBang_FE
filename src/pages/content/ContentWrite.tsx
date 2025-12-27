import React, { useEffect, useState } from "react";
import styles from "./ContentWritePage.module.css"
import { useNavigate } from "react-router-dom";
import { KOR_TO_CATEGORY, CATEGORY_TO_KOR } from "../../util/mapping";
import Spinner from '../../components/util/Spinner';
import { CATEGORY_DESCRIPTION, KorCategory } from "../../constants/reportCategoryDescription";
import '../../styles/global.css'

const ContentWrtiePage: React.FC = () => {
    const navigation = useNavigate();
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
        <div className={styles.content}>

        </div>
    );
}

export default ContentWrtiePage;