import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styles from "./FilterModal.module.css";
import { isFilterModalOpenState } from "../../recoil/hartListPage/isFilterModalOpenState";
import iconClose from "../../assets/image/iconClose.svg";

const FilterModal = () => {
  const [isOpen, setIsOpen] = useRecoilState(isFilterModalOpenState);
  const [selectedTab, setSelectedTab] = useState("전체");
  const tabs = ["전체", "후기만", "건물만"];
  const [selectedSort, setSelectedSort] = useState("최신순");
  const sorts = ["최신순", "좋아요순", "별점순"];

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`${styles.sheet} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header_divider} />
        <div className={styles.title}>
          <p className={styles.titleText}>필터</p>
          <img
            className={styles.exitImg}
            src={iconClose}
            alt="iconClose"
            onClick={() => setIsOpen(false)}
          />
        </div>
        <div className={styles.filterTabsContainer}>
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`${styles.filterTab} ${
                selectedTab === tab ? styles.active : ""
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              <p
                className={`${styles.filterTabText} ${
                  selectedTab === tab ? styles.active : ""
                }`}
              >
                {tab}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.thickLine} />
        <div className={styles.sortFilterContainer}>
          {sorts.map((sort) => (
            <>
              <p
                key={sort}
                className={`${styles.sortFilterText} ${
                  selectedSort === sort ? styles.active : ""
                }`}
                onClick={() => {
                  console.log("Clicked:", sort); // 클릭된 값 확인
                  setSelectedSort(sort);
                }}
              >
                {sort}
              </p>

              <div className={styles.line} />
            </>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <div
            className={styles.button}
            onClick={() => {
              setSelectedTab("전체");
              setSelectedSort("최신순");
            }}
          >
            <p className={styles.buttonText}>초기화</p>
          </div>
          <div
            className={styles.button}
            style={{ background: "var(--primary-color)" }}
            onClick={() => setIsOpen(false)}
          >
            <p className={styles.buttonText} style={{ color: "var(--white)" }}>
              확인
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
