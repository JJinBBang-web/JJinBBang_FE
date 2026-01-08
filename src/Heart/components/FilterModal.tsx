import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styles from "./FilterModal.module.css";
import { filterConfigState } from "../../recoil/hartListPage/filterConfigState";
import iconClose from "../../assets/image/iconClose.svg";

const FilterModal = () => {
  const [filterConfig, setFilterConfig] = useRecoilState(filterConfigState);
  const [selectedTab, setSelectedTab] = useState(filterConfig.type);
  const tabs = ["all", "review", "building"];
  const [selectedSort, setSelectedSort] = useState(filterConfig.sortBy);
  const sorts = ["latest", "likes", "stars"];

  useEffect(() => {
    setTimeout(() => {
      setSelectedTab(filterConfig.type);
      setSelectedSort(filterConfig.sortBy);
    }, 500);
  }, [filterConfig.isOpen]);

  return (
    <>
      <div
        className={`${styles.overlay} ${
          filterConfig.isOpen ? styles.open : ""
        }`}
        onClick={() =>
          setFilterConfig((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />
      <div
        className={`${styles.sheet} ${filterConfig.isOpen ? styles.open : ""}`}
      >
        <div className={styles.header_divider} />
        <div className={styles.title}>
          <p className={styles.titleText}>필터</p>
          <img
            className={styles.exitImg}
            src={iconClose}
            alt="iconClose"
            onClick={() =>
              setFilterConfig((prev) => ({
                ...prev,
                isOpen: false,
              }))
            }
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
                {tab === "all" ? "전체" : tab === "review" ? "후기만" : "건물만"}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.thickLine} />
        <div className={styles.sortFilterContainer}>
          {sorts.map((sort) => (
            <div key={sort} style={{ width: "100%" }}>
              <p
                className={`${styles.sortFilterText} ${
                  selectedSort === sort ? styles.active : ""
                }`}
                onClick={() => {
                  setSelectedSort(sort);
                }}
              >
                {sort === "latest"
                  ? "최신순"
                  : sort === "likes"
                  ? "좋아요순"
                  : "별점순"}
              </p>

              <div className={styles.line} />
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <div
            className={styles.button}
            onClick={() => {
              setSelectedTab("all");
              setSelectedSort("latest");
            }}
          >
            <p className={styles.buttonText}>초기화</p>
          </div>
          <div
            className={styles.button}
            style={{ background: "var(--primary-color)" }}
            onClick={() => {
              setFilterConfig((prev) => ({
                sortBy: selectedSort,
                type: selectedTab,
                isOpen: false,
              }));
            }}
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
