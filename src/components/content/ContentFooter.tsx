import React from "react";
import styles from "./ContentFooter.module.css";
import ListIcon from '../../assets/image/content/List.svg';
import ShareIcon from '../../assets/image/content/Share.svg';
import hartIconOn from "../../assets/image/heartIconOn.svg";
import hartIconOff from "../../assets/image/heartIconOff.svg";
import '../../styles/global.css'

interface Props {
  likes: number;
  shares: number;
  isLiked?: boolean;
  onToggleLike?: () => void;
  onClick?: () => void;
  onShare?: () => void;
}


const ContentFooter: React.FC<Props> = ({ likes, shares, onToggleLike, onClick, isLiked, onShare}) => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.leftBox}>
        <div className={styles.iconWrap} onClick={onToggleLike}>
          <img className={styles.icon} src={isLiked ? hartIconOn : hartIconOff} />
          <span className={styles.count}>{likes}</span>
        </div>

        <div className={styles.iconWrap} onClick={onShare}>
          <img className={styles.icon} src={ShareIcon}/>
          <span className={styles.count}>{shares}</span>
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