// src/components/event/RentTypeToggle.tsx
import React from "react";
import styles from "./RentTypeToggle.module.css";
import type { RentType } from "./PriceInput";

type Props = {
  value: RentType;
  onChange: (next: RentType) => void;
};

const RentTypeToggle: React.FC<Props> = ({ value, onChange }) => {
  const isMonthly = value === "MONTHLY";

  return (
    <div className={styles.wrapper}>
      {/* ✅ 슬라이딩 하이라이트 */}
      <div
        className={styles.slider}
        style={{ transform: `translateX(${isMonthly ? "0%" : "100%"})` }}
      />

      <button
        type="button"
        className={`${styles.btn} ${isMonthly ? styles.activeText : ""}`}
        onClick={() => onChange("MONTHLY")}
      >
        월세
      </button>

      <button
        type="button"
        className={`${styles.btn} ${!isMonthly ? styles.activeText : ""}`}
        onClick={() => onChange("JEONSE")}
      >
        전세
      </button>
    </div>
  );
};

export default RentTypeToggle;
