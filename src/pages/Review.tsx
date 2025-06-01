import { useEffect, useState } from 'react';
import styles from './Review.module.css'
import Header from '../components/Header';
import ImageSlider from '../components/detail/ImageSlider';
import TopButton from '../components/util/TopButton';
import ReviewInfo from '../components/detail/ReviewInfo';
import ReveiwContractInfo from '../components/detail/ReviewContractInfo';
import ReviewMapInfo from '../components/detail/ReviewMapInfo';
import { useRecoilState } from 'recoil';
import { ReviewInfoState } from '../recoil/detail/ReviewInfoRecoliState';
import Footer from '../components/detail/Footer';
import ReportButton from '../components/util/ReportButton';
import exampleImage1 from '../assets/image/example_image1.png';
import exampleImage2 from '../assets/image/example_image2.png';
import ReviewFacilitiesInfo from '../components/detail/ReviewFacilitiesInfo';

const mockData = {
    generalReviewInfo: {
        id: 1, // 후기 id
        name:"다희빌",
        type:"원룸",
        contractType: '월세', // 계약 형태 (월세, 전세)
        deposit: 500, // 보증금
        monthlyRent: 45, // 월세 (계약 형태가 전세인 경우 null)
        liked: true, // 후기에 대한 사용자의 좋아요 유무
        floor: '저층', // 층수 (저층, 중층, 고층)
        space: 26.44, // 면적 area -> space
        maintenanceCost: 10, // 관리비
        rating: 4, // 평점
    },
    reviewInfo: {
        content : "경상국립대 근처 자취방에서 1년 동안 거주했습니다. 학교와 도보 10분 거리라 통학이 정말 편리했고, 근처에 편의점과 작은 마트가 있어서 기본적인 생활이 수월했어요. 방은 채광이 좋아 낮에는 불을 켤 필요가 없었고, 통풍도 괜찮아서 여름에도 쾌적했습니다. 다만 방음이 조금 아쉬워서 밤에 옆방 소리가 들리곤 했습니다. 관리비도 비교적 합리적이어서 부담 없이 생활할 수 있었어요. 전반적으로 위치와 가격 대비 만족스러운 자취방이었습니다. 초보 자취생에게 추천드려요!",
        keywords: null,
        likesCount: 120,
        updatedAt: new Date("2025-02-23T04:06:00.000+09:00")
    },
    reviewImages: {
        count: 5,
        imageUrl: [exampleImage1,exampleImage2,exampleImage1,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage2]
    },
    building : {
        buildingId : 1, // 건물 id
        buildingCode: '4113511000105320000000002',
        name : '진주가좌그린빌 주공아파트', // 건물 이름
        type : '아파트', // 건물 유형
        address : '경남 진주시 내동로348번길 10 [가좌동 573-10]', // 건물 주소
        latitude: 37.5605, // 건물 위도
        longitude: 127.0103, // 건물 경도
    },
    keywords: {
        positive : ["PO_BD_LO_01", "PO_BD_MT_01", "PO_BD_MT_04", "PO_BD_ST_05", "PO_BD_LO_03", "PO_BD_ST_01"],
        negative : ["NE_BD_LO_03", "NE_BD_ST_05", "NE_BD_MT_07", "NE_BD_MT_04", "NE_BD_LO_08"]
    },
    authorId : 1,
}


// const mockData = {
//     domitoryReviewInfo : {
//         id: 1,
//         name: "지희관",
//         type: "기숙사",
//         university: "경상국립대 칠암캠퍼스",
//         floor: "저층",
//         capacity: 2,
//         dormFee: 35,
//         rating: 3,
//         liked: true,
//     },
//     reviewInfo: {
//         content : "경상국립대 근처 자취방에서 1년 동안 거주했습니다. 학교와 도보 10분 거리라 통학이 정말 편리했고, 근처에 편의점과 작은 마트가 있어서 기본적인 생활이 수월했어요. 방은 채광이 좋아 낮에는 불을 켤 필요가 없었고, 통풍도 괜찮아서 여름에도 쾌적했습니다. 다만 방음이 조금 아쉬워서 밤에 옆방 소리가 들리곤 했습니다. 관리비도 비교적 합리적이어서 부담 없이 생활할 수 있었어요. 전반적으로 위치와 가격 대비 만족스러운 자취방이었습니다. 초보 자취생에게 추천드려요!",
//         keywords: null,
//         likesCount: 100,
//         updatedAt: new Date("2025-02-23T04:06:00.000+09:00")
//     },
//     reviewImages: {
//         count: 5,
//         imageUrl: [exampleImage1,exampleImage2,exampleImage1,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage2]
//     },
//     building : {
//         buildingId : 1, // 건물 id
//         name : 'LG개척관', // 건물 이름
//         type : '기숙사', // 건물 유형
//         address : '경남 진주시 내동로348번길 10 [가좌동 573-10]', // 건물 주소
//         latitude: 37.5605, // 건물 위도
//         longitude: 127.0103, // 건물 경도
//     },
//     keywords: {
//         positive : ["PO_BD_LO_01", "PO_BD_MT_01", "PO_BD_MT_04", "PO_BD_ST_05", "PO_BD_LO_03", "PO_BD_ST_01"],
//         negative : ["NE_BD_LO_03", "NE_BD_ST_05", "NE_BD_MT_07", "NE_BD_MT_04", "NE_BD_LO_08"]
//     },
//     authorId : 1,
//     conditions: {
//         currnet_region: "창원",
//         currnet_grade: "3.8"
//     },
//     facilities:{
//         private: ["화장실", "샤워실"],
//         public: ["냉장고", "전자레인지", "세탁기"],
//         lounge: true
//     },
// }

// const mockData = {
//     agencyReviewInfo : {
//         id: 3,
//         name: "e편한공인중개사사무소",
//         type: "공인중개사",
//         rating: 2,
//         liked: false
//     },
//     reviewInfo: {
//         content : "경상국립대 근처 자취방에서 1년 동안 거주했습니다. 학교와 도보 10분 거리라 통학이 정말 편리했고, 근처에 편의점과 작은 마트가 있어서 기본적인 생활이 수월했어요. 방은 채광이 좋아 낮에는 불을 켤 필요가 없었고, 통풍도 괜찮아서 여름에도 쾌적했습니다. 다만 방음이 조금 아쉬워서 밤에 옆방 소리가 들리곤 했습니다. 관리비도 비교적 합리적이어서 부담 없이 생활할 수 있었어요. 전반적으로 위치와 가격 대비 만족스러운 자취방이었습니다. 초보 자취생에게 추천드려요!",
//         keywords: null,
//         likesCount: 99,
//         updatedAt: new Date("2025-02-23T04:06:00.000+09:00")
//     },
//     reviewImages: {
//         count: 5,
//         imageUrl: [exampleImage1,exampleImage2,exampleImage1,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage1,exampleImage2,exampleImage1,exampleImage2,exampleImage1,exampleImage2]
//     },
//     building : {
//         buildingId : 1, // 건물 id
//         name : '햇살 공인중개사', // 건물 이름
//         type : '공인중개사', // 건물 유형
//         address : '경남 진주시 내동로348번길 10 [가좌동 573-10]', // 건물 주소
//         latitude: 37.5605, // 건물 위도
//         longitude: 127.0103, // 건물 경도
//     },
//     keywords: {
//         positive : ["PO_AG_PD_02", "PO_AG_PD_04", "PO_AG_PD_05", "PO_AG_SO_02", "PO_AG_SO_04", "PO_AG_SO_06"],
//         negative : ["NE_AG_PD_01", "NE_AG_PD_03", "NE_AG_PD_02", "NE_AG_SO_03", "NE_AG_SO_06"]
//     },
//     authorId : 1,
// }

const Review: React.FC = () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [reviews, setReviews] = useRecoilState(ReviewInfoState);

    const ID = 3
    
        useEffect(() => {
            setReviews(mockData);
        }, []);
        
        useEffect(() => {
            const handleResize = () => {
                setWindowHeight(window.visualViewport?.height || window.innerHeight);
            };
    
            window.addEventListener('resize', handleResize);
            
            // 초기 로드 시 한 번 실행
            handleResize();
    
            return () => window.removeEventListener('resize', handleResize);
        })
        
    return (
        <div className={styles.content}
        style={{ minHeight: `${windowHeight}px`, display: "flex", flexDirection: "column" }}>
            <div className={styles.container}>
                {/* 헤더 */}
                <Header/>
                {/* 이미지슬라이더 */}
                <ImageSlider review={reviews} building={null}/>
                {/* 리뷰 정보 및 키워드 */}
                <ReviewInfo review={reviews}/>
                <hr className={styles.divider} style={{marginTop:"50px"}}/>
                {/* 계약형태 */}
                {reviews.generalReviewInfo && (
                    <>
                    <ReveiwContractInfo review={reviews}/>
                    <hr className={styles.divider}/>
                    </>
                )}
                {reviews.domitoryReviewInfo && (
                     <>
                     <ReveiwContractInfo review={reviews}/>
                     <hr className={styles.divider}/>
                     <ReviewFacilitiesInfo review={reviews}/>
                     <hr className={styles.divider}/>
                     </>
                )}
                {/* 단지정보 */}
                <ReviewMapInfo review={reviews}/>
            </div>
            {/* 작성id === 로그인 id 같으면 Footer 보이게+reportBtn안보이게, 아니면 반대 */}
            { ID == reviews.authorId ? 
                <div className={styles.fixedWrap}>
                    <TopButton/>
                    <Footer/>
                </div>
                : 
                <div className={styles.fixedWrap}>
                    <ReportButton/>
                    <TopButton/>
                </div>
            }
        </div>
    )
}

export default Review;