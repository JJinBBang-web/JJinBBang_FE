import styles from "./ReviewMapInfo.module.css"
import { Review } from "../../recoil/detail/ReviewInfoRecoliState";
import RVMarker from "../../assets/image/ReviewMarker.svg";
import { Map, MapMarker } from 'react-kakao-maps-sdk';

declare global {
    interface Window {
      kakao: any;
    }
}

interface Props {
    review: Review;
}

const ReviewMapInfo:React.FC<Props> = ({review}) => {
    return (
        <div className={styles.content}>
            <p className={styles.title}>단지 정보</p>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>유형</p>
                <p className={styles.infoContent}>{review.building.type}</p>
            </div>
            <hr/>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>주소</p>
                <p className={styles.infoContent}>
                    {review.building.address}
                </p>
            </div>
            <hr/>
            <div className={styles.infoWrap}>
                <p className={styles.subTitle}>상세주소</p>
                <p className={styles.infoContent}>
                    {review.building.name}<br/>
                    {review.basicInfo.floor}           
                </p>
            </div>
            <div className={styles.map}>
                {/* <ReviewMap/> */}
                <Map center={{
                    lat: review.building.latitude,
                    lng: review.building.longitude
                    }}
                    style={{ width: '100%', height: '100%', zIndex:"0"}}
                    level={3} // 줌 레벨 설정
                    draggable={false} // 드래그 비활성화
                    zoomable={false} // 확대/축소 비활성화
                    >
                    <MapMarker position={{
                    lat: review.building.latitude,
                    lng: review.building.longitude
                    }}
                    image={{
                    src: RVMarker,
                    size: { width: 40, height: 40 },
                    }} />
                </Map>
            </div>
            
        </div>
    )
}

export default ReviewMapInfo