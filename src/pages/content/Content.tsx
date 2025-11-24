import React, { useEffect, useState } from "react";
import styles from "./Content.module.css"
import Header from "../../components/Header";
import CategoryTabs from "../../components/content/CategoryTabs";
import ContentCard from "../../components/content/ContentCard";
import { useNavigate } from "react-router-dom";


const contentsByCategory = {
  부동산: {
    title: "자취방 A to Z",
    sub: "자취방이 처음이라면? 필수 확인 목록들!",
    list: [
      {
        id: 1,
        category: "부동산",
        title: "임대차 계약서 쓸 때 절대 놓치면 안 되는 5가지",
        date: "2025.11.10",
        likes: 1200,
        views: 3500,
      },
      {
        id: 1,
        category: "부동산",
        title: "임대차 계약서 쓸 때 절대 놓치면 안 되는 5가지",
        date: "2025.11.10",
        likes: 1200,
        views: 3500,
      },
      {
        id: 6,
        category: "부동산",
        title: "임대차 계약서 쓸 때 절대 놓치면 안 되는 5가지",
        date: "2025.11.10",
        likes: 1200,
        views: 3500,
      },
      {
        id: 7,
        category: "부동산",
        title: "임대차 계약서 쓸 때 절대 놓치면 안 되는 5가지",
        date: "2025.11.10",
        likes: 1200,
        views: 3500,
      },
      {
        id: 8,
        category: "부동산",
        title: "임대차 계약서 쓸 때 절대 놓치면 안 되는 5가지",
        date: "2025.11.10",
        likes: 1200,
        views: 3500,
      },
      {
        id: 5,
        category: "부동산",
        title: "임대차 계약서 쓸 때 절대 놓치면 안 되는 5가지",
        date: "2025.11.10",
        likes: 1200,
        views: 3500,
      },
    ],
  },
  자취꿀팁: {
    title: "자취 꿀팁 모음",
    sub: "초보 자취러를 위한 현실 꿀팁!",
    list: [
      {
        id: 2,
        category: "자취꿀팁",
        title: "전기세 아끼는 법 7가지",
        date: "2025.10.03",
        likes: 900,
        views: 2200,
      },
    ],
  },
  대학생활: {
    title: "대학생활 잘하는 법",
    sub: "꿀같은 캠퍼스 라이프 만들기!",
    list: [
      {
        id: 3,
        category: "대학생활",
        title: "새내기 꿀팁 10선",
        date: "2025.03.20",
        likes: 500,
        views: 1500,
      },
    ],
  },
  이사관련: {
    title: "이사 준비 체크리스트",
    sub: "이사 전 꼭 해야 할 것들!",
    list: [
      {
        id: 4,
        category: "이사관련",
        title: "이사할 때 반드시 확인할 것들",
        date: "2025.01.01",
        likes: 600,
        views: 1700,
      },
    ],
  },
};


const ContentPage: React.FC = () => {
    const navigation = useNavigate();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [activeCategory, setActiveCategory] = useState<keyof typeof contentsByCategory>("부동산");

    const current = contentsByCategory[activeCategory];

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

    return (         
        <div className={styles.content} style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            <div className={styles.container}>
                <Header type="title" title="찐빵 리포트" onClick={handleBack}/>
                <div className={styles.section}>
                    <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
                    <div className={styles.categoryInfo}>
                        <p className={styles.infoTitle}>{current.title}</p>
                        <p className={styles.infoSub}>{current.sub}</p>
                    </div>
                    <div className={styles.contentWrap}>
                        {current.list.map((item) => (
                            <ContentCard key={item.id} {...item}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentPage;