import React, { useEffect, useState } from "react";
import styles from "./Content.module.css"
import Header from "../../components/Header";
import CategoryTabs from "../../components/content/CategoryTabs";
import ContentCard from "../../components/content/ContentCard";
import { useNavigate } from "react-router-dom";
import { KOR_TO_CATEGORY, CATEGORY_TO_KOR } from "../../util/mapping";
import { useReportList } from "../../hooks/useReportList";
import Spinner from '../../components/util/Spinner';
import { CATEGORY_DESCRIPTION, KorCategory } from "../../constants/reportCategoryDescription";


const ContentPage: React.FC = () => {
    const navigation = useNavigate();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [activeCategory, setActiveCategory] = useState<KorCategory>("부동산");

    const serverCategory = KOR_TO_CATEGORY[activeCategory];
    const { title, sub } = CATEGORY_DESCRIPTION[activeCategory];
    
    const { data, isLoading, isError } = useReportList({
      category: serverCategory,
      cursor: null,
      size: 20,
    });

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
                    {isError && <div>오류 발생!</div>}

                    <div className={styles.categoryInfo}>
                        <p className={styles.infoTitle}>{title}</p>
                        <p className={styles.infoSub}>{sub}</p>
                    </div>
                    {!isLoading && !isError && (
                      <div className={styles.contentWrap}>
                        {reportList.map(item => (
                          <ContentCard
                            key={item.id}
                            id={item.id}
                            img={item.coverImage}
                            category={CATEGORY_TO_KOR[item.category]}
                            title={item.title}
                            date={item.createdAt}
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