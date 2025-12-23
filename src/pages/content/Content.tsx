import React, { useEffect, useState } from "react";
import styles from "./Content.module.css"
import Header from "../../components/Header";
import CategoryTabs from "../../components/content/CategoryTabs";
import ContentCard from "../../components/content/ContentCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { KOR_TO_CATEGORY, CATEGORY_TO_KOR } from "../../util/mapping";
import { useReportList } from "../../hooks/useReportList";
import Spinner from '../../components/util/Spinner';
import { CATEGORY_DESCRIPTION, KorCategory } from "../../constants/reportCategoryDescription";
import { formatDate } from "../../util/formatDate";
import '../../styles/global.css'

const ContentPage: React.FC = () => {
    const navigation = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const initialCategory = (searchParams.get("category") as KorCategory) ?? "부동산";
    const [activeCategory, setActiveCategory] = useState<KorCategory>(initialCategory);

    const serverCategory = KOR_TO_CATEGORY[activeCategory];
    const { title, sub } = CATEGORY_DESCRIPTION[activeCategory];
    
    const { data, isLoading, isError } = useReportList({
      category: serverCategory,
      cursor: null,
      size: 20,
    });

    useEffect(() => {
      setSearchParams({ category: activeCategory }, { replace: true });
    }, [activeCategory, setSearchParams]);

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
        navigation(-1);
    };

    const reportList = data?.reportList ?? [];

    return (         
        <div className={styles.content} style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            <div className={styles.container}>
                <Header type="title" title="찐빵 리포트" onClick={handleBack}/>
                <div className={styles.section}>
                    <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
                    {isLoading && <div style={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      }}>
                                      <Spinner />
                                  </div>
                                            }
                    <div className={styles.categoryInfo}>
                        <p className={styles.infoTitle}>{title}</p>
                        <p className={styles.infoSub}>{sub}</p>
                    </div>
                    {isError && <div>로그인이 필요합니다.</div>}
                    {!isLoading && !isError && (
                      <div className={styles.contentWrap}>
                        {reportList.map(item => (
                          <ContentCard
                            key={item.id}
                            id={item.id}
                            img={item.coverImage}
                            category={CATEGORY_TO_KOR[item.category]}
                            title={item.title}
                            date={formatDate(item.createdAt)}
                            likes={item.likeCount}
                            views={item.viewCount}
                          />
                        ))}
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContentPage;