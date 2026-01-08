// src/components/event/SelectCategory.tsx
import React, { useMemo, useState } from "react";
import styles from "./SelectCategory.module.css";

export type CategoryTab = {
  key: string;
  label: string;
};

type Props = {
  tabs: CategoryTab[];
  optionsByTab: Record<string, string[]>;
  selected: string[];
  onChangeSelected: (nextSelected: string[]) => void;
  maxSelect?: number;
  disabledOptions?: string[];
  oppositeType?: "장점" | "단점";
};

const SelectCategory: React.FC<Props> = ({
  tabs,
  optionsByTab,
  selected,
  onChangeSelected,
  maxSelect,
  disabledOptions = [],
  oppositeType,
}) => {
  const [activeTabKey, setActiveTabKey] = useState(tabs[0]?.key ?? "");

  const options = useMemo(() => {
    return optionsByTab[activeTabKey] ?? [];
  }, [optionsByTab, activeTabKey]);

  const toggleOption = (option: string) => {
    const exists = selected.includes(option);

    // 이미 선택된 항목은 해제 가능
    if (exists) {
      onChangeSelected(selected.filter((x) => x !== option));
      return;
    }

    // 비활성화된 옵션은 선택 불가 + alert 표시
    if (disabledOptions.includes(option)) {
      if (oppositeType) {
        alert(`동일한 항목이 ${oppositeType}으로 선택되었어요!`);
      }
      return;
    }

    // 최대 개수 체크
    if (typeof maxSelect === "number" && selected.length >= maxSelect) {
      alert("최대 5개만 선택할 수 있어요!");
      return;
    }

    onChangeSelected([...selected, option]);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabRow}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`${styles.tab} ${activeTabKey === t.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTabKey(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.optionGrid}>
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          const isDisabled = disabledOptions.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              className={`${styles.optionChip} ${isSelected ? styles.optionChipSelected : ""} ${isDisabled ? styles.optionChipDisabled : ""}`}
              onClick={() => toggleOption(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectCategory;
