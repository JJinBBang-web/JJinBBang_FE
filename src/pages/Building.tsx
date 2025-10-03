import { useEffect, useState } from "react";
import styles from "./Building.module.css"
import Header from "../components/Header";
import ImageSlider from "../components/detail/ImageSlider";
import BuildingInfo from "../components/detail/BuildingInfo";
import TopButton from "../components/util/TopButton";
import BuildingReviewList from "../components/detail/BuildingReviewList";
import { useRecoilState, useSetRecoilState } from "recoil";
import { BuildingInfoState } from "../recoil/detail/BuildingRecoilState";
import { useNavigate, useParams } from "react-router-dom";
import { useBuildingDetail } from "../hooks/useBuildingDetail";
import Modal from "../components/review/Modal";
import { hideNavState } from "../recoil/util/modalState";
import { isLoginState } from "../recoil/auth/isLoginState";
import iconClose from "../assets/image/iconClose.svg"
import verifiedCharacter from '../assets/image/verifiedSheetCharacter.svg';

const Building: React.FC = () => {
    const navigate = useNavigate();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [buildingInfo, setBuildingInfo] = useRecoilState(BuildingInfoState);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const setHideNav = useSetRecoilState(hideNavState);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(false);
    
    const { buildingId } = useParams(); // URL에서 buildingId 추출
    const isAgency = false; // 필요 시 로직으로 결정

    const { data, isLoading, isError } = useBuildingDetail(buildingId!, isAgency);

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

    useEffect(() => {
        if (!data) return;

        const basicInfo = data.generalBuildingInfo ?? data.agencyBuildingInfo ?? data.dormitoryBuildingInfo;

        // basicInfo가 undefined일 가능성도 있으므로 체크 필요
        if (!basicInfo) return;

        setBuildingInfo({
            basicInfo,
            buildingImages: data.reviewImages,
            keywords: data.keywords,
        });
    }, [data]);
    
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.visualViewport?.height || window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        
        // 초기 로드 시 한 번 실행
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCloseModal = () => {
        setHideNav(false);
    };

    const handleToAuth = () => {
        if (!isLoggedIn) {
            setHideNav(false);
            setIsModalOpen(false);
            navigate(`/mypage`);
        } else {
            setHideNav(false);
            setIsModalOpen(false);
            navigate(`/auth/student/verify`);
        }
    }

    if (isLoading) return <div>로딩 중...</div>;
    else if(!isLoggedIn || verificationStatus)
    return <>
        <Modal onClose={handleCloseModal} style={{ zIndex: 999 }}>
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
        </Modal>
        </>
    if (isError) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    
    const handleBack = () => {
        navigate(-1);
  };
    
    return (
        <div className={styles.content}
        style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            <div className={styles.container}>
                {/* 헤더 */}
                <Header onClick={handleBack}/>
                {/* 이미지슬라이더 */}
                <ImageSlider building={buildingInfo} review={null}/>
                {/* 건물 정보 및 키워드 */}
                <BuildingInfo building={buildingInfo}/>
                {/* 리뷰모음 */}
                <BuildingReviewList/>
            </div>
            <div className={styles.fixedWrap}>
                {/* 탑버튼 */}
                <TopButton/>
            </div>
        </div>
    )
}

export default Building;