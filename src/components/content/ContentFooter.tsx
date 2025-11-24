import React from "react";
import styles from "./ContentFooter.module.css";
import heartIcon from '../../assets/image/heartIcon.svg';

interface Props {
  likes: number;
  views: number;
}

const ContentFooter: React.FC<Props> = ({ likes, views }) => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.leftBox}>
        <div className={styles.iconWrap}>
          <img className={styles.icon} src={heartIcon} />
          <span className={styles.count}>{likes}</span>
        </div>

        <div className={styles.iconWrap}>
          <img className={styles.icon} />
          <span className={styles.count}>{views}</span>
        </div>
      </div>

      <button className={styles.moreBtn}>
        <img className={styles.icon} />
        <span className={styles.count}>목록으로</span>
      </button>
    </div>
  );
};

export default ContentFooter;