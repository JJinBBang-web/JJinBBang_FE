import React, { useState } from "react";
import styles from "./CategoryTabs.module.css";
import '../../styles/global.css'

const categories = ["부동산", "자취꿀팁", "대학생활", "이사관련"] as const;

interface Props {
  active: string;
  onChange: (category: any) => void;
}


const CategoryTabs: React.FC<Props> = ({active, onChange}) => {    
    return (
        <div className={styles.wrap}>
            {categories.map((c) => (
                <button
                    key={c}
                    className={`${styles.tab} ${active === c ? styles.active : ""}`}
                    onClick={() => onChange(c)}
                >
                    {c}
                </button>
            ))}
        </div>
    );
}

export default CategoryTabs;