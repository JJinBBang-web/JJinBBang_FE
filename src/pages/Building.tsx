import { useEffect, useState } from "react";
import styles from "./Building.module.css"
import Header from "../components/Header";
import ImageSlider from "../components/detail/ImageSlider";
import BuildingInfo from "../components/detail/BuildingInfo";
import TopButton from "../components/util/TopButton";
import BuildingReviewList from "../components/detail/BuildingReviewList";
import { useRecoilState } from "recoil";
import { BuildingInfoState } from "../recoil/detail/BuildingRecoilState";
import exampleImage1 from '../assets/image/example_image1.png';
import exampleImage2 from '../assets/image/example_image2.png';

// const mockData = {
//     basicInfo: {
//         liked: true,
//         id: 3,
//         type: ["아파트", "원룸"],
//         name: "진주가좌그린빌 주공아파트",
//         address: "경남 진주시 내동로348번길 10 [가좌동 573-10]",
//         rating: 3,
//         reviewCount: 25
//     },
//     buildingImages: {
//         count: 2,
//         imageUrl: [
//             exampleImage1,exampleImage2,exampleImage1,exampleImage1,exampleImage2,
//         ]
//     },
//     keywords: [ // 키워드 정보
//                 {
//                     "key": "PO_BD_LO_01",
//                     "count": 10
//                 },
//                 {
//                     "key": "PO_BD_LO_02",
//                     "count": 6
//                 },
//                 {
//                     "key": "PO_BD_MT_01",
//                     "count": 4
//                 },
//                 {
//                     "key": "PO_BD_MT_04",
//                     "count": 3
//                 },
//                 {
//                     "key": "PO_BD_ST_01",
//                     "count": 2
//                 },
//             ],
// }

const mockData = {
    basicInfo: {
        liked: true,
        id: 3,
        type: ["공인중개사"],
        name: "e편한공인중개사사무소",
        address: "경남 진주시 내동로348번길 10 [가좌동 573-10]",
        rating: 3,
        reviewCount: 25
    },
    buildingImages: {
        count: 2,
        imageUrl: [
            exampleImage1,exampleImage2,exampleImage1,exampleImage1,exampleImage2,
        ]
    },
    keywords: [ // 키워드 정보
                {
                    "key": "PO_AG_PD_01",
                    "count": 10
                },
                {
                    "key": "PO_AG_PD_02",
                    "count": 6
                },
                {
                    "key": "PO_AG_SO_01",
                    "count": 4
                },
                {
                    "key": "PO_AG_SO_02",
                    "count": 3
                },
                {
                    "key": "PO_AG_SO_05",
                    "count": 2
                },
            ],
}


// const mockData = {
//     basicInfo: {
//         liked: true,
//         id: 3,
//         type: ["기숙사"],
//         name: "지희관",
//         campus:"경상국립대 칠암캠퍼스",
//         address: "경남 진주시 내동로348번길 10 [가좌동 573-10]",
//         rating: 3,
//         reviewCount: 25
//     },
//     buildingImages: {
//         count: 2,
//         imageUrl: [
//             exampleImage1,exampleImage2,exampleImage1,exampleImage1,exampleImage2,
//         ]
//     },
//     keywords: [ // 키워드 정보
//                 {
//                     "key": "PO_DM_LO_01",
//                     "count": 10
//                 },
//                 {
//                     "key": "PO_MT_02",
//                     "count": 6
//                 },
//                 {
//                     "key": "PO_MT_03",
//                     "count": 4
//                 },
//                 {
//                     "key": "PO_MT_04",
//                     "count": 3
//                 },
//                 {
//                     "key": "PO_MT_05",
//                     "count": 2
//                 },
//             ],
// }

const Building: React.FC = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [buildingInfo, setBuildingInfo] = useRecoilState(BuildingInfoState);
    
    useEffect(() => {
        setBuildingInfo(mockData);
    }, []);
    
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
            <div className={styles.container}>
                {/* 헤더 */}
                <Header/>
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