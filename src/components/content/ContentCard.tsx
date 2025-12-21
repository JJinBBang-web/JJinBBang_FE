import React from "react";
import styles from "./ContentCard.module.css";
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
  img?: string;
  id?: number;
}

const ContentCard: React.FC<Props> = ({
  category,
  title,
  date,
  likes,
  views,
  img,
  id,
}) => {
  const navigation = useNavigate();
  
  const handleClick = () => {
    navigation(`/content/${id}`); 
  }
  return (
    <div className={styles.card} onClick={handleClick}>
      <img className={styles.thumbnail} src={img}/>

      <div className={styles.right}>
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
    </div>
  );
};

export default ContentCard;
