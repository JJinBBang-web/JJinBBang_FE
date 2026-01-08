// src/components/event/ProsAndConsInput.tsx
import React from "react";
import SelectCategory, { CategoryTab } from "./SelectCategory";
import styles from "./ProsAndConsInput.module.css";
import closeIcon from "../../assets/image/OrangeCloseIcon.svg";

type Props = {
  tabs: CategoryTab[];
  optionsByTab: Record<string, string[]>;
  selected: string[];
  onChangeSelected: (nextSelected: string[]) => void;
  minSelect?: number;
  maxSelect?: number;
  disabledOptions?: string[];
  oppositeType?: "장점" | "단점";
};

const ProsAndConsInput: React.FC<Props> = ({
  tabs,
  optionsByTab,
  selected,
  onChangeSelected,
  minSelect = 3,
  maxSelect,
  disabledOptions = [],
  oppositeType,
}) => {
  const removeSelected = (item: string) => {
    onChangeSelected(selected.filter((x) => x !== item));
  };

  const isSelected = selected.length > 0

  const isMinSatisfied = selected.length >= minSelect;

  return (
    <div className={styles.wrapper}>
      <SelectCategory
        tabs={tabs}
        optionsByTab={optionsByTab}
        selected={selected}
        onChangeSelected={onChangeSelected}
        maxSelect={maxSelect}
        disabledOptions={disabledOptions}
        oppositeType={oppositeType}
      />

      {isSelected && (
        <div className={styles.selectedChips}>
          {selected.map((s) => (
            <div key={s} className={styles.selectedChip}>
              <span>{s}</span>
              <img src={closeIcon} className={styles.icon} alt="제거아이콘" onClick={() => removeSelected(s)}/>
            </div>
          ))}
          </div>
      )}
      </div>
  );
};

export default ProsAndConsInput;
