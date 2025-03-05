import styles from "./BuildingInfo.module.css"
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import ExampelImg from "../../assets/image/emptyCharacterIcon.svg"
import dlatl from "../../assets/image/PO_LO_01.svg"
import { tagMessages, tagImages } from "../Tag";
import { useRecoilState } from "recoil";
import { BuildingInfoState } from "../../recoil/detail/BuildingRecoilState";
import { useEffect, useState } from "react";

const BuildingInfo: React.FC = () => {
    const [buildingInfo, setBuildingInfo] = useRecoilState(BuildingInfoState);
    const [isLiked, setIsLiked] = useState(buildingInfo.basicInfo.liked);


    useEffect(() => {
        setIsLiked(buildingInfo.basicInfo.liked);
    }, [buildingInfo]);
    
    useEffect(() => {
        setBuildingInfo({
            basicInfo: {
                liked: true,
                id: 3,
                type: ["아파트", "원룸"],
                name: "진주가좌그린빌 주공아파트",
                address: "경남 진주시 내동로348번길 10 [가좌동 573-10]",
                rating: 3,
                reviewCount: 25
            },
            buildingImages: {
                count: 2,
                imageUrl: [
                    "http://localhost:8080/image/x.jpg",
                    "http://localhost:8080/image/y.jpg"
                ]
            },
            keywords: [ // 키워드 정보
						{
							"key": "PO_LO_01",
							"count": 10
						},
						{
							"key": "PO_MT_02",
							"count": 6
						},
						{
							"key": "PO_MT_03",
							"count": 4
						},
                        {
							"key": "PO_MT_04",
							"count": 3
						},
                        {
							"key": "PO_MT_05",
							"count": 2
						},
	     ]
        });
    }, [setBuildingInfo]);

    return (
        <div className={styles.content}>
            <div className={styles.typeAndLike}>
                <div className={styles.buildingTypeWrap}>
                    {buildingInfo.basicInfo.type.map((type) => (
                        <div className={styles.buildingType}>{type}</div>
                        
                    ))}
                </div>
                <div className={styles.likeContainer}>
                    <img
                        className={styles.likeButton}
                        onClick={(event) => {
                        event.stopPropagation(); // 부모 onClick 이벤트 전파 방지
                          setIsLiked((prev) => !prev);
                        }}
                        src={isLiked ? heartIconOn : heartIconOff}
                        alt="heartIcon"
                    />
                </div>
            </div>
            <div className={styles.textWrap}>
                <p className={styles.buildingName}>{buildingInfo.basicInfo.name}</p>
                <p className={styles.buildingAddress}>{buildingInfo.basicInfo.address}</p>
            </div>
            <div className={styles.reviewsInfo}>
                <div className={styles.buildingRating}>
                    {[...Array(buildingInfo.basicInfo.rating)].map((_, index) => (
                    <img src={starIconOn} alt="rate"></img>
                    ))}
                    {[...Array(5 - Math.round(buildingInfo.basicInfo.rating))].map((_, index) => (
                    <img key={index} src={starIconOff} alt="rate" />
                    ))}
                </div>
                <div className={styles.reviewCountDiv}>
                    <p>•</p>
                    <p>{buildingInfo.basicInfo.reviewCount}</p>
                    <p>개의 찐빵</p>
                </div>
            </div>
            <div className={styles.keywordsWrap}>
                {buildingInfo.keywords.map((keyword )=> (
                    <div className={styles.keywordBack}>
                        <div className={styles.keywordContent}>
                            <img className={styles.keywordImg} src={tagImages[keyword.key]}/>
                            <p className={styles.keyword}>{tagMessages[keyword.key]}</p>
                        </div>
                        <p className={styles.keywordCount}>{keyword.count}</p>
                    </div>
                ))}
                
            </div>
        </div>
    )
}

export default BuildingInfo;