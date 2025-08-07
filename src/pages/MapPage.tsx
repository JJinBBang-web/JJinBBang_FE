import React, { useEffect, useState, useRef, useMemo } from 'react';
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
import { MarkerFilter, MarkerRequest, NearByRequest, SearchRequest } from '../types/entity/map/MapInterface';
import { useMapMarkers } from '../hooks/useMapMarker';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState, housingTypeState, searchKeywordState } from '../recoil/map/mapRecoilState';
import { universityLabelState } from '../recoil/map/universityRecoilState';
import { useNearBy } from '../hooks/useNearBy';
import { ReviewPreview } from '../recoil/detail/PreviewReviewRecoilState';
import { useSearch } from '../hooks/useSearch';
import BuildingPreviewReview from '../components/detail/BuildingPreviewReview';
import PreviewBuildingReview from '../components/detail/PreviewBuildingReview';
import { useNavigate } from 'react-router-dom';

const MapPage = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(true);
    const [mapBounds, setMapBounds] = useState<MarkerRequest['bounds'] | null>(null);
    const [selectedSort, setSelectedSort] = useState<"RCMND" | "LATEST" | "LIKES" | "STARS">("RCMND");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const isInitialized = useRef(false);

    const formatDepositValue = (value: number) => value * 100;  // 단순히 ×100

    const formatMonthlyRentValue = (value: number) => {
        if (value === 50) return null;  // 제한 없음 처리
        if (value <= 40) return value * 5;
        return 200 + (value - 40) * 10;
    };

    // filter Recoil
    const buildType = useRecoilValue(housingTypeState);
    const filter = useRecoilValue(filterState);
    const viewType = filter.reviewType === "후기별" ? "REVIEW" : "BUILDING";
    const contractType = filter.contractType as "MONTHLY_RENT" | "DEPOSIT_RENT" | null;
    const depositMax = 
        filter.depositMax 
        ? filter.depositMax === 50 ? null : formatDepositValue(filter.depositMax) 
        : null;
    const depositMin = filter.depositMin ? formatDepositValue(filter.depositMin) : null;
    const monthlyRentMin = filter.monthlyRentMin ? formatMonthlyRentValue(filter.monthlyRentMin)! : null;
    const monthlyRentMax = 
        filter.monthlyRentMax 
        ? filter.monthlyRentMax === 70 ? null : formatMonthlyRentValue(filter.monthlyRentMax) 
        : null;

    const universityLabel = useRecoilValue(universityLabelState);

    const markerFilters = useMemo<MarkerFilter>(() => ({
        viewType: viewType,
        buildType: buildType.length === 0 ? ["ALL"] : [buildType],
        contractType: contractType,
        campus: universityLabel ? [universityLabel] : null,
        depositMin: depositMin,
        depositMax: depositMax,
        monthlyRentMin: monthlyRentMin,
        monthlyRentMax: monthlyRentMax,
        inMaintenanceCost: filter.inMaintenanceCost,
        reviewKeyword: filter.reviewKeyword,
        }), [
        viewType,
        buildType,
        contractType,
        universityLabel,
        depositMin,
        depositMax,
        monthlyRentMin,
        monthlyRentMax,
        filter.inMaintenanceCost,
        filter.reviewKeyword
        ]);


    // 검색 관련
    const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);
    const [searchParams, setSearchParams] = useState<SearchRequest>();
    const [mapCenter, setMapCenter] = useState({ lat: 35.153237, lng: 128.101090 });

    const {
        data: searchData,
        isLoading: isSearchLoading,
        isError: isSearchError
    } = useSearch(searchParams);

    const handleSearch = () => {
        if (!searchKeyword) return;

        setSearchParams({
            keyword : searchKeyword,
            num: 10,
            page: 1,
            filters: {
                ...markerFilters,
                viewType: "BUILDING",
            }, 
        });
    };

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

    // 검색 모달
    useEffect(() => {
        if (searchKeyword && searchData?.items && searchData.items.length > 0) {
            setIsModalOpen(true);
            setIsSheetVisible(false);
        }
    }, [searchData]);

    useEffect(() => {
        if (searchData?.items?.length) {
            // 각 리뷰에 있는 위도/경도를 모두 모은다
            const latLngs = searchData.items
            .map((item) => {
                const lat = item.boundInfo?.latitude;
                const lng = item.boundInfo?.longitude;
                return (lat && lng) ? { lat, lng } : null;
            })
            .filter((coord): coord is { lat: number, lng: number } => coord !== null);

            if (latLngs.length > 0) {
                const lats = latLngs.map(p => p.lat);
                const lngs = latLngs.map(p => p.lng);

                const neLat = Math.max(...lats);
                const neLng = Math.max(...lngs);
                const swLat = Math.min(...lats);
                const swLng = Math.min(...lngs);

                setMapBounds({ neLat, neLng, swLat, swLng });

                const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
                const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;

                setMapCenter({ lat: centerLat, lng: centerLng });
            }
        }
    }, [searchData]);


    const nearByParams: NearByRequest | undefined = mapBounds
    ? {
        num: 10,
        page: 1,
        type: viewType,           
        sortBy: selectedSort,        
        idList: markerData.map((m) => m.id),
        }
    : undefined;

    const {
        data: nearByData,
        isLoading: isNearByLoading,
        isError: isNearByError,
    } = useNearBy(nearByParams);

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

    // 토큰 여부 확인
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);
    }, []);

    // 학생 인증 확인

    return (
        <div className={styles.content}             
            style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            {isLoading ? <div>로딩중..</div> :
            <div className={styles.map}>
                <Map
                center={mapCenter}
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
                        minLevel={5}
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
                <SearchBar onSearch={handleSearch}/>
            </div>
            <FilterBar/>
            {isSheetVisible && <ReviewListHeader onOpenModal={handleOpenModal} />}
            {/* 토큰 없는 경우 && 인증 X 경우 ? 팝업 등장 (안에서 학교인증X ? 학생인증 : 회/로 ) */}
            {!!nearByData?.items?.length ?
                (isModalOpen && <Modal onClose={handleCloseModal} style={{zIndex: 888}}>
                        <div className={styles.wrap}>
                            <div className={styles.sheet_header}>
                                <div className={styles.header_divider}></div>
                            </div>
                            <div className={styles.sheet_title_wrap}>
                                <div className={styles.sheet_info_wrap}>
                                    <p className={styles.sheet_title}>{viewType === "REVIEW" ? "내 주변 찐빵" : "검색된 건물"} (<span>{nearByData.itemNum}</span>)</p>
                                </div>
                                <img src={iconClose} width="24px" onClick={handleCloseModal}/>
                            </div>
                            <div className={styles.contentWrap}>
                                <div className={styles.filterWrap}>
                                    {[
                                        { label: "추천순", value: "RCMND" },
                                        { label: "최신순", value: "LATEST" },
                                        { label: "좋아요순", value: "LIKES" },
                                        { label: "별점순", value: "STARS" },
                                    ].map((sortOption) => (
                                        <p
                                        key={sortOption.value}
                                        className={
                                            selectedSort === sortOption.value
                                            ? styles.selectedText
                                            : undefined
                                        }
                                        onClick={() => setSelectedSort(sortOption.value as typeof selectedSort)}
                                        >
                                        <span>•</span>{sortOption.label}
                                        </p>
                                    ))}
                                </div>
                                {(nearByData?.items ?? []).map((review) => (
                                    <div key={review.agencyBuildingInfo?.id ?? review.dormitoryBuildingInfo?.id ?? review.generalBuildingInfo?.id}>
                                        <div className={styles.line} />
                                        {viewType === "REVIEW" ? <PreviewReview review={review} /> : <PreviewBuildingReview review={review} />}
                                    </div>
                                    ))}
                            </div>               
                        </div>
                    </Modal>)
                    : isModalOpen && (
                        <Modal onClose={handleCloseModal} style={{zIndex: 888}}>
                        <div className={styles.wrap}>
                            <div className={styles.sheet_header}>
                                <div className={styles.header_divider}></div>
                            </div>
                            <div className={styles.sheet_title_wrap}>
                                <div className={styles.sheet_info_wrap}>
                                    <p className={styles.sheet_title}>검색된 찐빵 (<span>{searchData?.itemNum}</span>)</p>
                                </div>
                                <img src={iconClose} width="24px" onClick={handleCloseModal}/>
                            </div>
                            <div className={styles.contentWrap}>
                                <div className={styles.filterWrap}>
                                    {[
                                        { label: "추천순", value: "RCMND" },
                                        { label: "최신순", value: "LATEST" },
                                        { label: "좋아요순", value: "LIKES" },
                                        { label: "별점순", value: "STARS" },
                                    ].map((sortOption) => (
                                        <p
                                        key={sortOption.value}
                                        className={
                                            selectedSort === sortOption.value
                                            ? styles.selectedText
                                            : undefined
                                        }
                                        onClick={() => setSelectedSort(sortOption.value as typeof selectedSort)}
                                        >
                                        <span>•</span>{sortOption.label}
                                        </p>
                                    ))}
                                </div>
                                {(searchData?.items ?? []).map((review) => (
                                    <div key={review.generalBuildingInfo?.id}>
                                        <div className={styles.line} />
                                        <PreviewBuildingReview review={review} />
                                    </div>
                                    ))}
                            </div>               
                        </div>
                    </Modal>
                    )
                }
            { !isLoggedIn && isModalOpen && <Modal onClose={handleCloseModal} >
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
            }
        </div>
    )
}

export default MapPage;