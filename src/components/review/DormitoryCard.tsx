import React, { useMemo } from "react";
import styles from "./UniversityCard.module.css"

type Props = {
  campusName: string;
  dormitoryName: string;
  address: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function DormitoryCard({
  campusName,
  dormitoryName,
  selected = false,
  address,
  onClick,
}: Props) {

  return (
    <button
      type="button"
      className={`${styles.dormcard} ${selected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <div className={styles.title}>
          {campusName} {dormitoryName}
      </div>
      <div className={styles.address}>{address}</div>
    </button>
  );
}
