import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styles from "./FilterModal.module.css";
import { isFilterModalOpenState } from "../../recoil/hartListPage/isFilterModalOpenState";

const FilterModal = () => {
  const [isOpen, setIsOpen] = useRecoilState(isFilterModalOpenState);

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`${styles.sheet} ${isOpen ? styles.open : ""}`}></div>
    </>
  );
};

export default FilterModal;
