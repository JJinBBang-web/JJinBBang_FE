// src/components/event/PriceInput.tsx
import React from "react";
import styles from "./PriceInput.module.css";
import RentTypeToggle from "./RentTypeToggle";

export type RentType = "MONTHLY" | "JEONSE";

export type PriceValue = {
  rentType: RentType;
  deposit: string;
  monthlyRent: string;
  maintenanceFee: string;
};

type Props = {
  value: PriceValue;
  onChange: (next: PriceValue) => void;
};

const PriceInput: React.FC<Props> = ({ value, onChange }) => {
  const setRentType = (rentType: RentType) => {
    onChange({
      ...value,
      rentType,
      monthlyRent: rentType === "JEONSE" ? "" : value.monthlyRent,
    });
  };

  const handle =
    (key: keyof PriceValue) => (e: React.ChangeEvent<HTMLInputElement>) => {
      // 숫자만 허용
      const numericValue = e.target.value.replace(/[^\d]/g, "");
      onChange({ ...value, [key]: numericValue });
    };

  return (
    <div className={styles.wrapper}>
      <RentTypeToggle value={value.rentType} onChange={setRentType} />

      <div
        className={`${styles.inputGrid} ${
            value.rentType === "MONTHLY" ? styles.grid3 : styles.grid2
        }`}
        >
        <div className={styles.inputBox}>
          <label className={styles.label}>
            {value.rentType === "JEONSE" ? "보증금(전세금)" : "보증금"}
          </label>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={value.deposit}
              onChange={handle("deposit")}
              placeholder="500"
              inputMode="numeric"
            />
            <span className={styles.unit}>만원</span>
          </div>
        </div>

        {value.rentType === "MONTHLY" && (
          <div className={styles.inputBox}>
            <label className={styles.label}>월세</label>
            <div className={styles.inputRow}>
              <input
                className={styles.input}
                value={value.monthlyRent}
                onChange={handle("monthlyRent")}
                placeholder="40"
                inputMode="numeric"
              />
              <span className={styles.unit}>만원</span>
            </div>
          </div>
        )}

        <div className={styles.inputBox}>
          <label className={styles.label}>관리비</label>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={value.maintenanceFee}
              onChange={handle("maintenanceFee")}
              placeholder="5"
              inputMode="numeric"
            />
            <span className={styles.unit}>만원</span>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default PriceInput;
