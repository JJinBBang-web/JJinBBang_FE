import React, { useEffect, useState, useMemo } from 'react';
import '../styles/global.css'
import HousingFilter from '../components/map/HousingFilter';
import SearchBar from '../components/map/SearchBar';
import styles from "./Map.module.css";
import FilterBar from '../components/map/FilterBar';
import ReviewListHeader from '../components/map/ReviewListHeader';
import Modal from '../components/review/Modal';
import iconClose from "../assets/image/iconClose.svg"
import campus_img_1 from "../assets/image/example_image1.png";
import PreviewReview from '../components/PreviewReview';
import verifiedCharacter from '../assets/image/verifiedSheetCharacter.svg';


const mockup = {
    num : 10,
    page : 1,
    itemNum : 10,
    items: [
      {
        dormitoryBasicInfo: {
          id: 1,
          name: "지희관",
          university: "경상국립대",
          type: "기숙사",
          floor: "저", // 옥탑방은 0, 반지하는 -1
          space: 26.44,
          capacity: 2,
          dormFee: 10,
          rating: 3,
          liked: true, // false
        },
        reviewInfo: {
          content: "집이 너무 깔끔하고...",
          keywords: ["PO_BD_ST_01", "PO_BD_MT_03", "NE_BD_LO_07"],
          likesCount: 120,
          updatedAt: new Date("2025-02-23T04:06:00.000+09:00"), // yyyy-MM-dd'T'HH:mm:ss.SSSXXX 형식
        },
        image: campus_img_1,
      },
      {
        basicInfo: {
          reviewId: 2,
          name: "한솔원룸",
          type: "투룸",
          contractType: "전세",
          deposit: 2000,
          monthlyRent: 0,
          floor: "고",
          space: 35.5,
          maintenanceCost: 5,
          rating: 4,
          liked: false,
        },
        reviewInfo: {
          content: "주변이 조용하고 살기 좋아요.",
          keywords: ["PO_BD_ST_01", "PO_BD_MT_03", "NE_BD_LO_07"],
          likesCount: 18,
          updatedAt: new Date("2025-02-23T04:06:00.000+09:00"),
        },
        image: campus_img_1,
      },
      {
        basicInfo: {
          reviewId: 3,
          name: "강남하우스",
          type: "오피스텔",
          contractType: "월세",
          deposit: 1000,
          monthlyRent: 70,
          floor: "중",
          space: 42.7,
          maintenanceCost: 15,
          rating: 5,
          liked: true,
        },
        reviewInfo: {
          content: "채광이 좋고 전망이 멋져요.",
          keywords: ["PO_BD_ST_01", "PO_BD_MT_03", "NE_BD_LO_07"],
          likesCount: 12,
          updatedAt: new Date("2025-02-23T04:06:00.000+09:00"),
        },
        image: campus_img_1,
      },
    ] as any[],
}

const Map = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(true);

    const handleOpenModal = () => {
        setIsSheetVisible(false);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsSheetVisible(true);
    };


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
            <div className={`${styles.container} ${styles.header_bar}`}>
                <HousingFilter/>
                <SearchBar/>
            </div>
            <FilterBar/>
            {isSheetVisible && <ReviewListHeader onOpenModal={handleOpenModal} />}
            {mockup.items.length > 0 ?
                (isModalOpen && <Modal onClose={handleCloseModal} style={{zIndex: 888}}>
                        <div className={styles.wrap}>
                            <div className={styles.sheet_header}>
                                <div className={styles.header_divider}></div>
                            </div>
                            <div className={styles.sheet_title_wrap}>
                                <div className={styles.sheet_info_wrap}>
                                    <p className={styles.sheet_title}>내 주변 찐빵 (<span>{mockup.itemNum}</span>)</p>
                                </div>
                                <img src={iconClose} width="24px" onClick={handleCloseModal}/>
                            </div>
                            <div className={styles.contentWrap}>
                                <div className={styles.filterWrap}>
                                    <>
                                        <p className={styles.selectedText}>
                                            <span>•</span>추천순
                                        </p>
                                        <p>
                                            <span>•</span>최신순
                                        </p>
                                        <p>
                                            <span>•</span>좋아요순
                                        </p>
                                        <p>
                                            <span>•</span>별점순
                                        </p>
                                    </>
                                </div>
                                {mockup.items.map((review) => (
                                    <div key={review.basicInfo?.reviewId ?? review.dormitoryBasicInfo?.id}>
                                        <div className={styles.line} />
                                        <PreviewReview review={review} />
                                    </div>
                                    ))}
                            </div>               
                        </div>
                    </Modal>
                )
            : 
            ( isModalOpen && <Modal onClose={handleCloseModal} >
                <div className={styles.wrap2}>
                    <div className={styles.sheet_header}>
                        <div className={styles.header_divider}></div>
                    </div>
                    <div className={styles.sheet_title_wrap}>
                        <div className={styles.sheet_info_wrap}>
                            <p className={styles.sheet_title}></p>
                        </div>
                        <img src={iconClose} width="24px" onClick={handleCloseModal}/>
                    </div>
                    <div className={styles.sheetWrap}>
                        <img src={verifiedCharacter}/>
                        <p className={styles.sheetText}>학교 인증 후<br/>찐빵의 찐거주 후기들을<br/>무료 열람해보세요!</p>
                    </div>
                    <div className={styles.btnWrap}>
                            <button className={styles.confirmBtn} onClick={()=>{}}>학교 인증하기</button>
                    </div>      
                </div>
            </Modal>
            )
        }
            
        </div>
    )
}

export default Map;