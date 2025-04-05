import styles from "./Footer.module.css"
import pencilIcon from "../../assets/image/pencilIcon.svg"
import { useNavigate } from 'react-router-dom';


const Footer:React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <div className={styles.content}>
            <button className={styles.writeBtn}>
                <img src={pencilIcon} alt="writeImg" className={styles.writeImg}/>
                <p className={styles.textBtn}
                onClick={()=> navigate('/review/content')}
                >정보 수정 및 삭제</p>
            </button>
        </div>
    )
}

export default Footer