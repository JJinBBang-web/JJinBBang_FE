import styles from "./BuildingInfo.module.css"
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import { tagMessages, tagImages, tagLongMessages } from "../Tag";
import { agencyBuildingInfo, Building, dormBuildingInfo, generalBuildingInfo } from "../../recoil/detail/BuildingRecoilState";
import { useEffect, useState } from "react";

interface Props {
    building : Building;
}

const BuildingInfo: React.FC<Props> = ({building}) => {
    const [isLiked, setIsLiked] = useState(building.basicInfo.liked);


    useEffect(() => {
        setIsLiked(building.basicInfo.liked);
    }, [building]);

    const renderExtraInfo = () => {
        if (building.basicInfo.type.includes("기숙사")) {
            return <>
                <div className={styles.buildingType}>{(building.basicInfo as dormBuildingInfo).type}</div>
                <div className={styles.campusType}>{(building.basicInfo as dormBuildingInfo).campus}</div>
            </>
        }
        if (building.basicInfo.type.includes("공인중개사")) {
            return <div className={styles.agencyType}>{(building.basicInfo as agencyBuildingInfo).type}</div>
        }
        return (            
                <>
                {(building.basicInfo as generalBuildingInfo).type.map((t, index) => (
                    <div key={index} className={styles.buildingType}>{t}</div>
                ))}
                </>
            );
      }
    
    // const renderTageInfo = () => {
    //     if (building.basicInfo.type.includes("기숙사")) {
    //         return (
    //             <>
    //             {(building.keywords as dormBuildingInfo).map((keyword)=> (
    //                 <div className={styles.keywordBack}>
    //                     <div className={styles.keywordContent}>
    //                         <img className={styles.keywordImg} src={tagImages[keyword.key]}/>
    //                         <p className={styles.keyword}>{tagLongMessages[keyword.key]}</p>
    //                     </div>
    //                     <p className={styles.keywordCount}>{keyword.count}</p>
    //                 </div>
    //             ))}
    //             </>
    //         );
    //     }
    //     if (building.basicInfo.type.includes("공인중개사")) {
    //         return <div className={styles.agencyType}>{(building.basicInfo as agencyBuildingInfo).type}</div>
    //     }
    //     return <div className={styles.buildingType}>{(building.basicInfo as generalBuildingInfo).type}</div>;
    // }

    return (
        <div className={styles.content}>
            <div className={styles.typeAndLike}>
                <div className={styles.buildingTypeWrap}>
                    {renderExtraInfo()}
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
                <p className={styles.buildingName}>{building.basicInfo.name}</p>
                <p className={styles.buildingAddress}>{building.basicInfo.address}</p>
            </div>
            <div className={styles.reviewsInfo}>
                <div className={styles.buildingRating}>
                    {[...Array(building.basicInfo.rating)].map((_, index) => (
                    <img src={starIconOn} alt="rate"></img>
                    ))}
                    {[...Array(5 - Math.round(building.basicInfo.rating))].map((_, index) => (
                    <img key={index} src={starIconOff} alt="rate" />
                    ))}
                </div>
                <div className={styles.reviewCountDiv}>
                    <p>•</p>
                    <p>{building.basicInfo.reviewCount}</p>
                    <p>개의 찐빵</p>
                </div>
            </div>
            <div className={styles.keywordsWrap}>
                {building.keywords.map((keyword )=> (
                    <div className={styles.keywordBack}>
                        <div className={styles.keywordContent}>
                            <img className={styles.keywordImg} src={tagImages[keyword.key]}/>
                            <p className={styles.keyword}>{tagLongMessages[keyword.key]}</p>
                        </div>
                        <p className={styles.keywordCount}>{keyword.count}</p>
                    </div>
                ))}
                
            </div>
        </div>
    )
}

export default BuildingInfo;