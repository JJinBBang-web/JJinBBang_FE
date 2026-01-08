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
};

const SelectCategory: React.FC<Props> = ({
  tabs,
  optionsByTab,
  selected,
  onChangeSelected,
  maxSelect,
}) => {
  const [activeTabKey, setActiveTabKey] = useState(tabs[0]?.key ?? "");

  const options = useMemo(() => {
    return optionsByTab[activeTabKey] ?? [];
  }, [optionsByTab, activeTabKey]);

  const toggleOption = (option: string) => {
    const exists = selected.includes(option);

    if (exists) {
      onChangeSelected(selected.filter((x) => x !== option));
      return;
    }

    if (typeof maxSelect === "number" && selected.length >= maxSelect) return;

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
          return (
            <button
              key={opt}
              type="button"
              className={`${styles.optionChip} ${isSelected ? styles.optionChipSelected : ""}`}
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
