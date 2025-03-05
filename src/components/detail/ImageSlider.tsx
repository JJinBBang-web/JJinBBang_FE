import styles from "./ImageSlider.module.css"
import imgIcon from "../../assets/image/imageIcon.svg"

const ImageSlider:React.FC = () => {
    return (
        <div className={styles.content}>
            {/* 슬라이더만들기 */}
            <div className={styles.imgCount} >
                <img src={imgIcon} alt="imgIcon" style={{width:"18px", height:"18px"}}/>
                <p className={styles.count}>20</p>
            </div>
        </div>
    )
}

export default ImageSlider;