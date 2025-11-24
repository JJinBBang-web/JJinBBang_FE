import React from "react";
import styles from "./ContentFooter.module.css";
import heartIcon from '../../assets/image/heartIcon.svg';
import ListIcon from '../../assets/image/content/List.svg';
import ShareIcon from '../../assets/image/content/Share.svg';


interface Props {
  likes: number;
  views: number;
  onClick?:()=> void;
}

const ContentFooter: React.FC<Props> = ({ likes, views, onClick }) => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.leftBox}>
        <div className={styles.iconWrap}>
          <img className={styles.icon} src={heartIcon} />
          <span className={styles.count}>{likes}</span>
        </div>

        <div className={styles.iconWrap}>
          <img className={styles.icon} src={ShareIcon}/>
          <span className={styles.count}>{views}</span>
        </div>
      </div>

      <button className={styles.moreBtn} onClick={onClick}>
        <img className={styles.icon} src={ListIcon}/>
        <span className={styles.count} >목록으로</span>
      </button>
    </div>
  );
};

export default ContentFooter;