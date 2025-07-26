import React, { useEffect, useState, useRef } from 'react';
import '../styles/global.css'
import HousingFilter from '../components/map/HousingFilter';
import SearchBar from '../components/map/SearchBar';
import styles from "./MapPage.module.css";
import FilterBar from '../components/map/FilterBar';
import ReviewListHeader from '../components/map/ReviewListHeader';
import Modal from '../components/review/Modal';
import iconClose from "../assets/image/iconClose.svg"
import campus_img_1 from "../assets/image/example_image1.png";
import PreviewReview from '../components/PreviewReview';
import verifiedCharacter from '../assets/image/verifiedSheetCharacter.svg';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import JBMarker from "../assets/image/JBMarker.svg";
import { MarkerFilter, MarkerRequest } from '../types/entity/map/MapInterface';
import { useMapMarkers } from '../hooks/useMapMarker';
import { useRecoilValue } from 'recoil';
import { filterState, housingTypeState } from '../recoil/map/mapRecoilState';
import { universityLabelState } from '../recoil/map/universityRecoilState';


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

const MapPage = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(true);
    const [mapBounds, setMapBounds] = useState<MarkerRequest['bounds'] | null>(null);

    const isInitialized = useRef(false);

    const formatDepositValue = (value: number) => value * 100;  // 단순히 ×100

    const formatMonthlyRentValue = (value: number) => {
        // 예시: 15 → 75만, 53 → 330만
        if (value === 50) return null;  // 제한 없음 처리
        if (value <= 40) return value * 5;
        return 200 + (value - 40) * 10;
    };

    // filter Recoil
    const buildType = useRecoilValue(housingTypeState);
    const filter = useRecoilValue(filterState);
    const viewType = filter.reviewType === "후기별" ? "REVIEW" : "BUILDING";
    const depositMax = 
        filter.depositMax 
        ? filter.depositMax === 50 ? null : formatDepositValue(filter.depositMax) 
        : null;
    const depositMin = filter.depositMin ? formatDepositValue(filter.depositMin) : 0;
    const monthlyRentMin = filter.monthlyRentMin ? formatMonthlyRentValue(filter.monthlyRentMin)! : 0;
    const monthlyRentMax = 
        filter.monthlyRentMax 
        ? filter.monthlyRentMax === 70 ? null : formatMonthlyRentValue(filter.monthlyRentMax) 
        : null;

    const universityLabel = useRecoilValue(universityLabelState);

    const markerFilters: MarkerFilter = {
        viewType: viewType, 
        buildType: buildType.length === 0 ? ["ALL"] : [buildType],
        contractType: null,
        campus: [universityLabel],
        depositMin: depositMin,
        depositMax: depositMax,
        monthlyRentMin: monthlyRentMin,
        monthlyRentMax: monthlyRentMax,
        inMaintenanceCost: filter.inMaintenanceCost,
        reviewKeyword: filter.reviewKeyword,
    };

    console.log(mapBounds);

    const {
        data: markerData = [],
        isLoading,
        isError,
    } = useMapMarkers(
    mapBounds
        ? {
            bounds: mapBounds,
            filters: markerFilters,
        }
        : undefined
    );

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
            {isLoading ? <div>로딩중..</div> :
            <div className={styles.map}>
                <Map
                center={{ lat: 35.153237, lng: 128.101090 }}
                style={{ width: '100%', height: '100%' }}
                level={5}
                draggable
                zoomable
                onCreate={(map) => {
                    if (isInitialized.current) return; // 최초 1회만 실행

                    const bounds = map.getBounds();
                    const ne = bounds.getNorthEast();
                    const sw = bounds.getSouthWest();

                    const extractedBounds = {
                        neLat: ne.getLat(),
                        neLng: ne.getLng(),
                        swLat: sw.getLat(),
                        swLng: sw.getLng(),
                    };

                    console.log("🧭 초기 지도 bounds:", extractedBounds);
                    setMapBounds(extractedBounds);
                    isInitialized.current = true;
                }}
                onBoundsChanged={(map) => {
                    const bounds = map.getBounds();
                    const ne = bounds.getNorthEast();
                    const sw = bounds.getSouthWest();

                    const extractedBounds = {
                        neLat: ne.getLat(),
                        neLng: ne.getLng(),
                        swLat: sw.getLat(),
                        swLng: sw.getLng(),
                    };

                    console.log("🧭 실시간 bounds:", extractedBounds);
                }}
                >
                    <MarkerClusterer
                        averageCenter={true}
                        minLevel={4}
                        styles={[
                            {
                            width: "44px",
                            height: "44px",
                            borderRadius:"50%",
                            border:".95px solid var(--white)",
                            background: "var(--primary-color80)",
                            color: "var(--white)",
                            textAlign: "center",
                            letterSpacing:"-0.6px",
                            lineHeight:"150%",
                            fontFamily: "Spoqa Han Sans Neo",
                            fontSize: "16px",
                            fontWeight: "500",
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center",
                            },
                        ]}
                    >
                        {markerData.map((marker) => (
                            <MapMarker
                            key={marker.id}
                            position={{ lat: marker.latitude, lng: marker.longitude }}
                            image={{
                                src: JBMarker, // 마커 이미지 경로
                                size: {
                                width: 40,
                                height: 40,
                                },
                            }}
                            />
                        ))}
                    </MarkerClusterer>
                </Map>
            </div>
            }
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

export default MapPage;