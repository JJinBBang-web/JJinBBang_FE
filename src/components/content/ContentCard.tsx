import React from "react";
import styles from "./ContentCard.module.css";
import { useNavigate, useParams } from "react-router-dom";

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
      <div className={styles.thumbnail}></div>

      <div className={styles.right}>
        <div className={styles.category}>{category}</div>
        <p className={styles.title}>{title}</p>

        <div className={styles.dateAndInfo}>
            <p className={styles.date}>{date}</p>

            <div className={styles.meta}>
                <span>
                    <img className={styles.icon} /> {likes / 1000}K
                </span>
                <span>
                    <img  className={styles.icon} /> {views / 1000}K
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
