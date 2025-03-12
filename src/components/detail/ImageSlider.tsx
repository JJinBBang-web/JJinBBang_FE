import styles from "./ImageSlider.module.css"
import imgIcon from "../../assets/image/imageIcon.svg"
import { Review } from "../../recoil/detail/ReviewInfoRecoliState";
import { Building } from "../../recoil/detail/BuildingRecoilState";

interface Props {
    building : Building | null,
    review : Review | null
}

const ImageSlider:React.FC<Props> = ({building, review}) => {
    return (
        <div className={styles.content}>
            {/* 슬라이더만들기 */}
            <div className={styles.imgCount} >
                <img src={imgIcon} alt="imgIcon" style={{width:"18px", height:"18px"}}/>
                {
                    building == null ? <p className={styles.count}>{review?.reviewImages.count}</p> : <p className={styles.count}>{building.buildingImages.count}</p>
                }
                
            </div>
        </div>
    )
}

export default ImageSlider;