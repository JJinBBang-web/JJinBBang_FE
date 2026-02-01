import React, { useMemo } from "react";
import styles from "./UniversityCard.module.css"

type Props = {
  fullName: string; // "경상국립대 칠암캠퍼스"
  campusAddress: string;
  selected?: boolean;
  query: string; // 사용자 입력 원본(공백 포함 가능)
  onClick?: () => void;
};

// fullName(공백 포함)에서 query(공백 제거)와 매칭되는 글자만 파란색 처리
function buildHighlightMask(fullName: string, rawQuery: string) {
  const q = (rawQuery ?? "").replace(/\s+/g, "");
  const mask = new Array(fullName.length).fill(false);

  if (!q) return mask;

  // fullName의 공백을 제거한 문자열 + 원본 인덱스 매핑
  const mapToOriginIndex: number[] = [];
  let normalized = "";
  for (let i = 0; i < fullName.length; i++) {
    const ch = fullName[i];
    if (ch === " ") continue;
    normalized += ch;
    mapToOriginIndex.push(i);
  }

  const start = normalized.indexOf(q);
  if (start === -1) return mask;

  for (let k = 0; k < q.length; k++) {
    const originIdx = mapToOriginIndex[start + k];
    if (originIdx !== undefined) mask[originIdx] = true;
  }
  return mask;
}

export default function UniversityCard({
  fullName,
  campusAddress,
  selected = false,
  query,
  onClick,
}: Props) {
  const mask = useMemo(() => buildHighlightMask(fullName, query), [fullName, query]);

  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <div className={styles.img}/>
      <div className={styles.textWrap}>
        <div className={styles.title}>
            {fullName.split("").map((ch, idx) => (
            <span key={`${ch}-${idx}`} className={mask[idx] ? styles.match : ""}>
                {ch}
            </span>
            ))}
        </div>
        <div className={styles.address}>{campusAddress}</div>
      </div>
    </button>
  );
}
