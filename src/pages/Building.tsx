import { useEffect, useState } from "react";
import styles from "./Building.module.css"
import Header from "../components/Header";
import ImageSlider from "../components/detail/ImageSlider";
import BuildingInfo from "../components/detail/BuildingInfo";
import TopButton from "../components/util/TopButton";
import BuildingReviewList from "../components/detail/BuildingReviewList";
import { useRecoilState } from "recoil";
import { BuildingInfoState } from "../recoil/detail/BuildingRecoilState";
import { useNavigate, useParams } from "react-router-dom";
import { useBuildingDetail } from "../hooks/useBuildingDetail";

const Building: React.FC = () => {
    const navigate = useNavigate();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [buildingInfo, setBuildingInfo] = useRecoilState(BuildingInfoState);
    
    const { buildingId } = useParams(); // URL에서 buildingId 추출
    const isAgency = false; // 필요 시 로직으로 결정

    const { data, isLoading, isError } = useBuildingDetail(buildingId!, isAgency);

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

    if (isLoading) return <div>로딩 중...</div>;
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
                <hr/>
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