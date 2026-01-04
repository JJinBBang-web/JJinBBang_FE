import React from "react";
import styles from "./ContentManageCard.module.css";
import { useNavigate, useParams } from "react-router-dom";
import heartIcon from '../../assets/image/heartIcon.svg';
import viewIcon from '../../assets/image/content/View.svg';
import '../../styles/global.css'

interface Props {
  category: string;
  title: string;
  date: string;
  likes: number;
  views: number;
  id?: number;
}

const ContentManageCard: React.FC<Props> = ({
  category,
  title,
  date,
  likes,
  views,
  id,
}) => {
  const navigation = useNavigate();
  
  const handleToEdit = () => {
    // navigation(`/content/${id}`); 
  }

  const handleToDelete = () => {
    // 삭제 로직 구현 예정
  };

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.category}>{category}</div>
        <p className={styles.title}>{title}</p>

        <div className={styles.dateAndInfo}>
            <p className={styles.date}>{date}</p>

            <div className={styles.meta}>
                <span className={styles.iconWrap}>
                    <img className={styles.icon} src={heartIcon} />{likes}
                </span>
                <span className={styles.iconWrap}>
                    <img  className={styles.icon} src={viewIcon}/> {views}
                </span>
            </div>
        </div>
      </div>
      <div className={styles.manageButtons}>
        <button className={styles.editButton} onClick={handleToEdit}>수정</button>
        <button className={styles.deleteButton} onClick={handleToDelete}>삭제</button>
      </div>
    </div>
  );
};

export default ContentManageCard;
