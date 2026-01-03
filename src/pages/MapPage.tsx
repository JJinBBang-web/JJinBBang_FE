import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import '../styles/global.css'
import HousingFilter from '../components/map/HousingFilter';
import SearchBar from '../components/map/SearchBar';
import styles from "./MapPage.module.css";
import FilterBar from '../components/map/FilterBar';
import ReviewListHeader from '../components/map/ReviewListHeader';
import Modal from '../components/review/Modal';
import iconClose from "../assets/image/iconClose.svg"
import PreviewReview from '../components/PreviewReview';
import verifiedCharacter from '../assets/image/verifiedSheetCharacter.svg';
import { Map as KakaoMap } from 'react-kakao-maps-sdk';
import JBMarker from "../assets/image/JBMarker.svg";
import BDMarker from "../assets/image/BDMarker.svg";
import { MarkerFilter, MarkerRequest, NearByRequest, SearchRequest } from '../types/entity/map/MapInterface';
import { useMapMarkers } from '../hooks/useMapMarker';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { depositRangeState, filterState, housingTypeState, maintenanceCostState, monthlyRentRangeState, searchKeywordState, selectedContractState, selectedJjinFilterState } from '../recoil/map/mapRecoilState';
import { useNearBy } from '../hooks/useNearBy';
import { useSearch } from '../hooks/useSearch';
import PreviewBuildingReview from '../components/detail/PreviewBuildingReview';
import { campusCenterState } from '../recoil/map/universityRecoilState';
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { hideNavState } from '../recoil/util/modalState';
import { isSheetOpenState } from '../recoil/util/utilRecoilState';
import emptyCharacterIcon from '../assets/image/emptyCharacterIcon.svg';
import Spinner from '../components/util/Spinner';
import MetaTag from '../util/SEOMetaTag';
import useExplorationTracking, { trackExplorationStep } from '../hooks/useExplorationTracking';

type MarkerItem = { id: number; latitude: number; longitude: number; type: 'ROOM'|'HOUSE'|'OFFICETEL'|'APARTMENT'|'BOARDING_HOUSE'|'DORMITORY'|'AGENCY' };

const splitIds = (arr: MarkerItem[]) => {
  const buildingIds:number[] = [];
  const agencyIds:number[] = [];
  for (const m of arr) {
    if (m.type === 'AGENCY') agencyIds.push(m.id);
    else buildingIds.push(m.id);
  }
  return { buildingIds, agencyIds };
};

const FILTER_ATOMS = [
  filterState,
  housingTypeState,
  searchKeywordState,
  selectedContractState,
  maintenanceCostState,
  depositRangeState,
  monthlyRentRangeState,
  selectedJjinFilterState,
];

const MapPage = () => {

    const resetAllFilters = useRecoilCallback(({ reset }) => () => {
        FILTER_ATOMS.forEach(reset);
    }, []);
    const didResetRef = useRef(false);

    const navigate = useNavigate();
    const location = useLocation();

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(true);
    const [mapBounds, setMapBounds] = useState<MarkerRequest['bounds'] | null>(null);
    const [selectedSort, setSelectedSort] = useState<"RCMND" | "LATEST" | "LIKES" | "STARS">("RCMND");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [markerDetailParams, setMarkerDetailParams] = useState<NearByRequest | undefined>(undefined);
    const campusCenter = useRecoilValue(campusCenterState);
    const setCampusCenter = useSetRecoilState(campusCenterState);
    const mapRef = useRef<kakao.maps.Map | null>(null);
    const [modalContent, setModalContent] = useState<'search' | 'nearby' | 'login' | null>(null);
    const setHideNav = useSetRecoilState(hideNavState);
    const [verificationStatus, setVerificationStatus] = useState(false);

    // 맵페이지
    const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
    const kakaoMarkersRef = useRef<kakao.maps.Marker[]>([]);
    const clusterOverlaysRef = useRef<kakao.maps.CustomOverlay[]>([]);

    // 페이지네이션 관련 상태
    const [searchCurrentPage, setSearchCurrentPage] = useState(1);
    const [nearByCurrentPage, setNearByCurrentPage] = useState(1);
    const [searchAllItems, setSearchAllItems] = useState<any[]>([]);
    const [nearByAllItems, setNearByAllItems] = useState<any[]>([]);
    const [hasMoreSearch, setHasMoreSearch] = useState(true);
    const [hasMoreNearBy, setHasMoreNearBy] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // 검색 모드 관리
    const [isSearchMode, setIsSearchMode] = useState(false);

    // 스크롤 컨테이너 ref
    const searchScrollRef = useRef<HTMLDivElement>(null);
    const nearByScrollRef = useRef<HTMLDivElement>(null);

    // 바텀시트 상태 관리 추가
    const [bottomSheet, setBottomSheet] = useRecoilState(isSheetOpenState);


    // 라우트 변경 시 모달 상태 초기화 (추가 안전장치)
    useEffect(() => {
        setBottomSheet({ isOpenModal: false, type: null });
    }, [location.pathname, setBottomSheet]);

    // 컴포넌트 언마운트 시 모달 상태 초기화
    useEffect(() => {
        return () => {
            // MapPage를 떠날 때 모든 모달 상태 초기화
            setBottomSheet({ isOpenModal: false, type: null });
        };
    }, [setBottomSheet]);

    // 브라우저 뒤로가기 감지 및 모달 닫기
    useEffect(() => {
        const handlePopState = () => {
            if (bottomSheet.isOpenModal) {
                setBottomSheet({ isOpenModal: false, type: null });
                window.history.pushState(null, '', window.location.href);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [bottomSheet.isOpenModal, setBottomSheet]);

    const isInitialized = useRef(false);

    const formatDepositValue = (value: number) => value * 100;  // 단순히 ×100
    const formatMonthlyRentValue = (value: number) => {
        if (value === 50) return null;  // 제한 없음 처리
        if (value <= 40) return value * 5;
        return 200 + (value - 40) * 10;
    };
    
    useEffect(() => {
        const lat = location.state?.latitude;
        const lng = location.state?.longitude;

        if (lat && lng) {
            setCampusCenter({ lat, lng });
        }
    }, [location.state]);



    // filter Recoil
    const [buildType, setBuildType] = useRecoilState(housingTypeState);
    const [filter, setFilter] = useRecoilState(filterState);
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

    useEffect(() => {
        const fromHome = location.state?.from === 'home';
        const hasCampusJump = !!location.state?.latitude && !!location.state?.longitude;

        if ((fromHome || hasCampusJump) && !didResetRef.current) {
            // ✅ 한 방에 초기화
            resetAllFilters();

            // 로컬 상태도 필요하면 같이 초기화
            setSelectedSort('RCMND');
            setSearchCurrentPage(1);
            setNearByCurrentPage(1);
            setHasMoreSearch(true);
            setHasMoreNearBy(true);
            setSearchAllItems([]);
            setNearByAllItems([]);

            didResetRef.current = true;
        }
    }, [location.state, setFilter]);

    const markerFilters = useMemo<MarkerFilter>(() => ({
        viewType: viewType,
        buildType: buildType.length === 0 ? ["ALL"] : [buildType],
        contractType: contractType,
        campus: filter.university ? [filter.university] : null,
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
        filter.university,
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

    const {
        data: markerData = [],
        isLoading,
        isFetching: isMarkersFetching,
        isError,
    } = useMapMarkers(
        mapBounds
            ? {
                bounds: mapBounds,
                filters: markerFilters,
            }
            : undefined
    );
    // 마커 하나 선택시
    const {
        data: markerDetailData,
        isLoading: isMarkerDetailLoading,
    } = useNearBy(markerDetailParams);

    const { buildingIds: nearByBuildingIds, agencyIds: nearByAgencyIds } = splitIds(markerData as MarkerItem[]);

    const nearByParams: NearByRequest | undefined = mapBounds && (nearByBuildingIds.length > 0 || nearByAgencyIds.length > 0)
    ? {
        num: 10,
        page: nearByCurrentPage,
        type: viewType,
        sortBy: selectedSort,
        // REVIEW 타입: 모든 ID를 idList에 담음
        // BUILDING 타입: 일반 건물은 idList, 공인중개사는 agencyIdList로 분리
        idList: viewType === "REVIEW" ? [...nearByBuildingIds, ...nearByAgencyIds] : nearByBuildingIds,
        agencyIdList: viewType === "BUILDING" ? nearByAgencyIds : undefined
        }
    : undefined;

    const { data: nearByData } = useNearBy(nearByParams);

    const markerDataForRender = useMemo(() => {
        if (isMarkersFetching) return [];
        return markerData;
    }, [isMarkersFetching, markerData]);

    // 검색 핸들러
    const handleSearch = () => {
      if (!searchKeyword) return;
      
        trackExplorationStep('3.2_map_view_search');
        
        setSearchCurrentPage(1);
        setHasMoreSearch(true);
        setIsSearchMode(true);

        setSearchParams({
            keyword: searchKeyword,
            num: 10,
            page: 1,
            sortBy: selectedSort,
            filters: { ...markerFilters, viewType }
        });

        setModalContent('search');
        setIsModalOpen(true);
        setIsSheetVisible(false);
    };

  const handleOpenModal = () => {
        trackExplorationStep('3.5_map_view_modal');
        if (!isLoggedIn || verificationStatus) {
            setModalContent('login');
            setIsModalOpen(true);
            setHideNav(true);
            return;
        }

        setNearByCurrentPage(1);
        setHasMoreNearBy(true);

        setIsSheetVisible(false);
        setModalContent('nearby');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsSheetVisible(true);
        setModalContent(null);
        setHideNav(false);

        setSearchCurrentPage(1);
        setNearByCurrentPage(1);
        setHasMoreSearch(true);
        setHasMoreNearBy(true);
    };

    // 검색 결과 → 마커 배열 변환
    const searchMarkers = useMemo(() => {
        if (!searchData?.items?.length) return [];
        
        return searchData.items
            .map((item) => {
            const id =
                item.agencyBuildingInfo?.id ??
                item.dormitoryBuildingInfo?.id ??
                item.generalBuildingInfo?.id;

            const lat = item.boundInfo?.latitude;
            const lng = item.boundInfo?.longitude;

            if (!id || lat == null || lng == null) return null;

            // 타입은 preview에서 쓰는 구분을 그대로 맞춰주면 좋아요
            const type = item.agencyBuildingInfo
                ? "AGENCY"
                : item.dormitoryBuildingInfo
                ? "DORMITORY"
                : "GENERAL";

            return { id, latitude: lat, longitude: lng, type };
            })
            .filter((m): m is { id: number; latitude: number; longitude: number; type: string } => !!m);
    }, [searchData]);

    // 건물 타입에 따른 마커 필터링
    const filteredMarkerDataForRender = useMemo(() => {
        if (!markerDataForRender || markerDataForRender.length === 0) return [];

        // buildType이 빈 문자열이거나 "ALL"이면 모든 마커 표시
        if (!buildType || buildType === "ALL") return markerDataForRender;

        // buildType에 따라 필터링
        return markerDataForRender.filter((marker) => {
            const markerType = (marker as any).type;

            if (buildType === "공인중개사") {
                return markerType === "AGENCY";
            } else if (buildType === "기숙사") {
                return markerType === "DORMITORY";
            } else if (buildType === "원룸" || buildType === "투룸+" || buildType === "오피스텔") {
                return markerType === "GENERAL";
            }

            return true;
        });
    }, [markerDataForRender, buildType]);

    const markersToRender = modalContent === 'search' ? searchMarkers : filteredMarkerDataForRender;

    // 검색 데이터가 업데이트될 때 누적 처리
    useEffect(() => {
        
        if (searchData?.items?.length) {
            if (searchCurrentPage === 1) {
                // 첫 페이지는 덮어쓰기 (정렬 변경 시에도 여기서 처리)
                setSearchAllItems(searchData.items);
            } else {
                // 이후 페이지는 추가
                setSearchAllItems(prev => [...prev, ...searchData.items]);
            }

            // 더 이상 데이터가 없는지 확인
            const totalPages = Math.ceil((searchData.itemNum || 0) / 10);
            setHasMoreSearch(searchCurrentPage < totalPages);
            setIsLoadingMore(false);

            // 검색 결과로 지도 bounds 업데이트 (첫 페이지만)
            if (searchCurrentPage === 1) {
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
        } else if (searchData) {
            if (searchCurrentPage === 1) {
                setSearchAllItems([]);
            }
            setHasMoreSearch(false);
            setIsLoadingMore(false);
        }
    }, [searchData, searchCurrentPage]);

    
    useEffect(() => {
        if (campusCenter && mapRef.current) {
            const offset = 0.01;

            // 지도 중심 이동
            mapRef.current.panTo(new kakao.maps.LatLng(campusCenter.lat, campusCenter.lng));

            // bounds 업데이트
            setMapBounds({
                neLat: campusCenter.lat + offset,
                neLng: campusCenter.lng + offset,
                swLat: campusCenter.lat - offset,
                swLng: campusCenter.lng - offset,
            });

            // center 상태도 동기화 (선택사항)
            setMapCenter({ lat: campusCenter.lat, lng: campusCenter.lng });
        }
    }, [campusCenter]);


    // nearBy 데이터가 업데이트될 때 누적 처리
    useEffect(() => {
        
        if (nearByData?.items?.length) {
            if (nearByCurrentPage === 1) {
                setNearByAllItems(nearByData.items);
            } else {
                setNearByAllItems(prev => [...prev, ...nearByData.items]);
            }

            const totalPages = Math.ceil((nearByData.itemNum || 0) / 10);
            setHasMoreNearBy(nearByCurrentPage < totalPages);
            setIsLoadingMore(false);
        } else if (nearByData && nearByData.items?.length === 0 && nearByCurrentPage === 1) {
            setNearByAllItems([]);
            setHasMoreNearBy(false);
            setIsLoadingMore(false); 
        } 
    }, [nearByData, nearByCurrentPage]);


    const handleMarkerClick = (markerId: number) => {
        if(!isLoggedIn || verificationStatus) {
            setModalContent('login');
            setIsModalOpen(true);
            setHideNav(true);
            return;
        }

        // 클릭한 마커 찾기
        const clickedMarker = markersToRender?.find((m) => m.id === markerId);
        if (!clickedMarker) return;

        // 같은 위치의 마커 모두 찾기
        const sameLocationMarkers = markersToRender?.filter(
            (m) => m.latitude === clickedMarker.latitude && m.longitude === clickedMarker.longitude
        );

        const { buildingIds, agencyIds } = splitIds(sameLocationMarkers as MarkerItem[]);

        if (buildingIds.length === 0 && agencyIds.length === 0) {
            // 마커가 없는 경우에만 return
            return;
        }

        const params: NearByRequest = {
            num: buildingIds.length + agencyIds.length,  // 모두 가져오기
            page: 1,
            type: viewType,
            sortBy: selectedSort,
            // REVIEW 타입: 모든 ID를 idList에 담음
            // BUILDING 타입: 일반 건물은 idList, 공인중개사는 agencyIdList로 분리
            idList: viewType === "REVIEW" ? [...buildingIds, ...agencyIds] : buildingIds,
            agencyIdList: viewType === "BUILDING" ? agencyIds : undefined,
        };

        setMarkerDetailParams(params);
    };

    // 무한 스크롤 핸들러
    const handleScroll = useCallback((scrollRef: React.RefObject<HTMLDivElement | null>, isSearch: boolean) => {
        const element = scrollRef.current;
        if (!element) return;

        const { scrollTop, scrollHeight, clientHeight } = element;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px 여유

        if (isNearBottom && !isLoadingMore) {
            if (isSearch && hasMoreSearch) {
                setIsLoadingMore(true);
                const nextPage = searchCurrentPage + 1;
                setSearchCurrentPage(nextPage);
                
                setSearchParams(prev => ({
                    ...(prev ?? {}),
                    page: nextPage,
                    keyword: searchKeyword,
                    num: 10,
                    sortBy: selectedSort,
                    filters: {
                        ...markerFilters,
                        viewType,
                    },
                } as any));
            } else if (!isSearch && hasMoreNearBy) {
                setIsLoadingMore(true);
                setNearByCurrentPage(prev => prev + 1);
            }
        }
    }, [isLoadingMore, hasMoreSearch, hasMoreNearBy, searchCurrentPage, nearByCurrentPage, 
        searchKeyword, selectedSort, markerFilters, viewType]);

    // 스크롤 이벤트 리스너 등록
    useEffect(() => {
        const searchElement = searchScrollRef.current;
        const nearByElement = nearByScrollRef.current;

        const handleSearchScroll = () => handleScroll(searchScrollRef, true);
        const handleNearByScroll = () => handleScroll(nearByScrollRef, false);

        if (modalContent === 'search' && searchElement) {
            searchElement.addEventListener('scroll', handleSearchScroll);
            return () => searchElement.removeEventListener('scroll', handleSearchScroll);
        }
        
        if (modalContent === 'nearby' && nearByElement) {
            nearByElement.addEventListener('scroll', handleNearByScroll);
            return () => nearByElement.removeEventListener('scroll', handleNearByScroll);
        }
    }, [modalContent, handleScroll]);

    // 정렬 변경 시 페이지네이션 초기화
    const handleSortChange = (newSort: typeof selectedSort) => {
        setSelectedSort(newSort);

        if (modalContent === 'search') {
            setSearchCurrentPage(1);
            setHasMoreSearch(true);

            setSearchParams({
                keyword: searchKeyword,
                num: 10,
                page: 1,
                sortBy: newSort,
                filters: { ...markerFilters, viewType }
            });
        } else if (modalContent === 'nearby') {
            setNearByCurrentPage(1);
            setHasMoreNearBy(true);
        }
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
        const token = sessionStorage.getItem("accessToken");
        setIsLoggedIn(!!token);
    }, []);

    // 미인증 여부 확인
    useEffect(() => {
        const verification = sessionStorage.getItem("verificationStatus");
        setVerificationStatus(verification === 'unverified');
    }, []);

    // login & 인증 여부에 따라 다르게 이동
    const handleToAuth = () => {
        if (!isLoggedIn) {
            setHideNav(false);
            setIsModalOpen(false);
            setModalContent(null);
            navigate(`/mypage`);
        } else {
            setHideNav(false);
            setIsModalOpen(false);
            setModalContent(null);
            navigate(`/auth/student/verify`);
        }
    }

    const handleClearSearch = () => {
        setSearchKeyword(''); // 키워드 클리어
        setIsSearchMode(false); // 검색 모드 해제
        setSearchAllItems([]); // 검색 결과 클리어
        setSearchParams(undefined); // 검색 파라미터 클리어
        
        if (mapRef.current) {
        // 초기 중심점과 레벨 설정
        const initialCenter = campusCenter || { lat: 35.153237, lng: 128.101090 };
        const initialLevel = 5; // 또는 더 넓게 보려면 6, 7
        
        mapRef.current.setCenter(new kakao.maps.LatLng(initialCenter.lat, initialCenter.lng));
        mapRef.current.setLevel(initialLevel);
        
        // 더 큰 offset으로 bounds 설정
        const offset = 0.02; // 기존 0.01에서 더 큰 값으로
        setMapBounds({
            neLat: initialCenter.lat + offset,
            neLng: initialCenter.lng + offset,
            swLat: initialCenter.lat - offset,
            swLng: initialCenter.lng - offset,
        });
        setMapCenter(initialCenter);
    }

    };

    const clustererKey = useMemo(() => {
        const b = mapBounds
            ? `${mapBounds.neLat},${mapBounds.neLng},${mapBounds.swLat},${mapBounds.swLng}`
            : 'no-bounds';
        const f = JSON.stringify(markerFilters);
        return `${modalContent}-${viewType}-${b}-${f}`;
    }, [modalContent, viewType, mapBounds, markerFilters]);


    return (
        <>
        <MetaTag
            title="찐빵 | 자취 후기 지도 보기"
            description="대학가 근처 자취방, 기숙사 후기 위치를 한눈에 볼 수 있다!"
            keywords="찐빵, 원룸, 자취방, 기숙사, 리뷰, 대학가, 부동산, 지도, 자취, 후기, 추천"
            imgsrc="https://jjinbbang.kr/seo/thumbnail.png"
            url="https://jjinbbang.kr/map"
        />
        <div className={styles.content}             
            style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            <div className={styles.map}>
                <KakaoMap
                center={mapCenter}
                style={{ width: '100%', height: '100%' }}
                level={5}
                draggable
                zoomable
                onCreate={(map) => {
                    mapRef.current = map;

                    if (!clustererRef.current) {
                    const clusterer = new kakao.maps.MarkerClusterer({
                        map,
                        averageCenter: true,
                        minLevel: 3,
                        styles: [
                            {
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            border: "0.95px solid #ffffff",
                            background: "rgba(244, 105, 64, 0.8)",
                            color: "#ffffff",
                            textAlign: "center",
                            lineHeight: "44px", // ✅ 여기 중요 (flex 대신 lineHeight가 안정적)
                            fontFamily: "Spoqa Han Sans Neo",
                            fontSize: "16px",
                            fontWeight: "500",
                            },
                      ],
                        
                        });

                    // 클러스터 클릭 이벤트 추가
                    kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster: any) {
                      trackExplorationStep("3.7_map_view_cluster");
                    });

                    clustererRef.current = clusterer;
                    }

                    if (isInitialized.current) return;

                    const bounds = map.getBounds();
                    const ne = bounds.getNorthEast();
                    const sw = bounds.getSouthWest();

                    const extractedBounds = {
                        neLat: ne.getLat(),
                        neLng: ne.getLng(),
                        swLat: sw.getLat(),
                        swLng: sw.getLng(),
                    };

                    setMapBounds(extractedBounds);

                    // 🔥 campusCenter가 있다면 초기 위치로 이동!
                    if (campusCenter) {
                        map.panTo(new kakao.maps.LatLng(campusCenter.lat, campusCenter.lng));

                        const offset = 0.01;
                        setMapBounds({
                        neLat: campusCenter.lat + offset,
                        neLng: campusCenter.lng + offset,
                        swLat: campusCenter.lat - offset,
                        swLng: campusCenter.lng - offset,
                        });
                        setMapCenter(campusCenter);
                    }
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

                    setMapBounds(extractedBounds);

                }}
                >
                    {isLoading ? (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            }}>
                            <Spinner />
                        </div>)
                    : null }
                </KakaoMap>
            </div>
            <div className={`${styles.container} ${styles.header_bar}`}>
                <HousingFilter/>
                <SearchBar onSearch={handleSearch} isSearchMode={isSearchMode} onClearSearch={handleClearSearch}/>
            </div>
            <FilterBar/>
            {isSheetVisible && <ReviewListHeader onOpenModal={handleOpenModal} />}
            {/* 토큰 없는 경우 && 인증 X 경우 ? 팝업 등장 (안에서 학교인증X ? 학생인증 : 회/로 ) */}
            {isModalOpen && modalContent && (
            <Modal onClose={handleCloseModal} style={{ zIndex: 999 }} >
                {modalContent == 'search' && (
                    <div className={styles.wrap}>
                        <div className={styles.sheet_header}>
                            <div className={styles.header_divider}></div>
                        </div>
                        <div className={styles.sheet_title_wrap}>
                            <div className={styles.sheet_info_wrap}>
                                <p className={styles.sheet_title}>검색된 찐빵 (<span>{searchData?.itemNum ?? 0}</span>)</p>
                            </div>
                            <img src={iconClose} width="24px" onClick={handleCloseModal}/>
                        </div>
                        <div className={styles.contentWrap} ref={searchScrollRef} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
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
                                    onClick={() => handleSortChange(sortOption.value as typeof selectedSort)}
                                    >
                                    <span>•</span>{sortOption.label}
                                    </p>
                                ))}
                            </div>
                            {searchAllItems.length === 0 && !isLoadingMore && !searchData ? (
                                <div className={styles.emptyWrap}>
                                    <div className={styles.line} />
                                    <img src={emptyCharacterIcon} alt={"찐빵없음"} className={styles.emptyImg}/>
                                    <p className={styles.emptyText}>앗! 이 주변엔 아직 찐빵이 없어요<br/>지도를 이동해서 다른 지역을 살펴보세요!</p>
                                </div>
                            )
                            :
                            (searchAllItems.map((review, index) => (
                                <div className='++!' key={`${review.generalBuildingInfo?.id}-${index}`}>
                                    <div className={styles.PreviewReview} />
                                    {review.agencyBuildingInfo || viewType === "BUILDING" ? 
                                        <PreviewBuildingReview review={review} trackStep="3.10_map_PreviewBuildingReview" /> : 
                                        <PreviewReview review={review} trackStep="3.9_map_PreviewReview" />
                                    }
                                </div>
                                ))
                            )}
                            {isLoadingMore && (
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    <Spinner />
                                </div>
                            )}
                            {/* {!hasMoreSearch && searchAllItems.length > 0 && (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    모든 결과를 불러왔습니다.
                                </div>
                            )} */}
                        </div>               
                    </div>
                )}
                
                {modalContent === 'nearby' && (
                    <div className={styles.wrap}>
                        <div className={styles.sheet_header}>
                            <div className={styles.header_divider}></div>
                        </div>
                        <div className={styles.sheet_title_wrap}>
                            <div className={styles.sheet_info_wrap}>
                                <p className={styles.sheet_title}>{viewType === "REVIEW" ? "내 주변 찐빵" : "검색된 건물"} (<span>{nearByData?.itemNum}</span>)</p>
                            </div>
                            <img src={iconClose} width="24px" onClick={handleCloseModal}/>
                        </div>
                        <div className={styles.contentWrap} ref={nearByScrollRef} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
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
                                    onClick={() => handleSortChange(sortOption.value as typeof selectedSort)}
                                    >
                                    <span>•</span>{sortOption.label}
                                    </p>
                                ))}
                            </div>
                            {nearByAllItems.length === 0 && !isLoadingMore && !nearByData ? (
                                <div className={styles.emptyWrap}>
                                    <div className={styles.line} />
                                    <img src={emptyCharacterIcon} alt={"찐빵없음"} className={styles.emptyImg}/>
                                    <p className={styles.emptyText}>앗! 이 주변엔 아직 찐빵이 없어요<br/>지도를 이동해서 다른 지역을 살펴보세요!</p>
                                </div>
                            )
                            :
                            (nearByAllItems.map((review, index) => (
                                <div key={`${review.agencyBuildingInfo?.id ?? review.dormitoryBuildingInfo?.id ?? review.generalBuildingInfo?.id}-${index}`}>
                                    <div className={styles.line} />
                                    {review.agencyBuildingInfo || viewType === "BUILDING" ? 
                                        <PreviewBuildingReview review={review} trackStep="3.10_map_PreviewBuildingReview" /> : 
                                        <PreviewReview review={review} trackStep="3.9_map_PreviewReview" />
                                    }
                                </div>
                                ))
                            )}
                            {isLoadingMore && (
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                     <Spinner />
                                </div>
                            )}
                            {/* {!hasMoreNearBy && nearByAllItems.length > 0 && (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    모든 결과를 불러왔습니다.
                                </div>
                            )} */}
                        </div>               
                    </div>
                )}

                {modalContent == 'login' && (
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
                            <button className={styles.confirmBtn} onClick={handleToAuth}>학교 인증하기</button>
                        </div>      
                    </div>
                )}
            </Modal>
            )}

            {markerDetailData?.items?.length && (
                <Modal onClose={() => setMarkerDetailParams(undefined)} style={{ zIndex: 999 }}>
                    <div className={styles.wrap}>
                        <div className={styles.sheet_header}>
                            <div className={styles.header_divider}></div>
                        </div>
                        <div className={
                                markerDetailData.items.length === 1
                                    ? styles.contentMarker
                                    : styles.contentWrap
                            }>
                            {markerDetailData.items.map((item, idx) => 
                                viewType === "REVIEW" ? (
                                <PreviewReview key={idx} review={item} trackStep="3.9_map_PreviewReview" />
                                ) : (
                                <PreviewBuildingReview review={item} trackStep="3.10_map_PreviewBuildingReview" />
                                )
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
        </>
    )
}

export default MapPage;