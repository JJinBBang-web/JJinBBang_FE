import styles from "./BuildingInfo.module.css"
import heartIconOn from "../../assets/image/heartIconOn.svg";
import heartIconOff from "../../assets/image/heartIconOff.svg";
import starIconOn from "../../assets/image/starIconOn.svg";
import starIconOff from "../../assets/image/starIconOff.svg";
import { tagImages, tagLongMessages } from "../Tag";
import { agencyBuildingInfo, Building, dormBuildingInfo, generalBuildingInfo } from "../../recoil/detail/BuildingRecoilState";
import { useEffect, useState } from "react";
import { typeToKorean } from "../../util/mapping";
import { postAPI } from "../../api/baseAPI";
import { useMutation } from "@tanstack/react-query";

interface Props {
    building : Building;
}

const BuildingInfo: React.FC<Props> = ({building}) => {

    const [isLiked, setIsLiked] = useState(building.basicInfo.liked);

    useEffect(() => {
        setIsLiked(building.basicInfo.liked);
    }, [building]);

    const mutation = useMutation({
        mutationFn: async () => {
        return postAPI(
            `/api/v1/user/bookmark`,
            {
            type: "building",
            id: building?.basicInfo.id,
            bookmark: !isLiked,
            },
            true
        );
        },
        onSuccess: (data) => {
            setIsLiked(!isLiked);
        },
    });

    const renderExtraInfo = () => {
        if (building.basicInfo.type.includes("DORMITORY")) {
            const dorm = building.basicInfo as dormBuildingInfo;
            return (
            <div className={styles.buildingTypeWrap}>
                <div className={styles.buildingType}>
                    {typeToKorean[dorm.type] ?? dorm.type}
                </div>
                <div className={styles.campusType}>{dorm.universityName}</div>
            </div>
            );
        }

        if (building.basicInfo.type.includes("AGENCY")) {
            const agency = building.basicInfo as agencyBuildingInfo;
            return (
            <div className={styles.agencyType}>
                {agency.type.map((t) => typeToKorean[t] ?? t).join(" / ")}
            </div>
            );
        }

        const general = building.basicInfo as generalBuildingInfo;
        return (
            <div className={styles.buildingTypeWrap}>
            {general.type.map((t, index) => (
                <div key={index} className={styles.buildingType}>
                {typeToKorean[t] ?? t}
                </div>
            ))}
            </div>
        );
    };
    
    const roundedRating = Math.round(building.basicInfo?.rating ?? 0);
    const filledStars = Math.min(roundedRating, 5);
    const emptyStars = Math.max(5 - filledStars, 0);


    return (
        <div className={styles.content}>
            <div className={styles.typeAndLike}>
                {renderExtraInfo()}
                <div className={styles.likeContainer}>
                    <img
                        className={styles.likeButton}
                        onClick={(event) => {
                            event.stopPropagation(); // 부모 onClick 이벤트 전파 방지
                            mutation.mutate();
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
                    {[...Array(filledStars)].map((_, i) => (
                        <img key={`filled-${i}`} src={starIconOn} alt="rate" />
                    ))}
                    {[...Array(emptyStars)].map((_, i) => (
                        <img key={`empty-${i}`} src={starIconOff} alt="rate" />
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