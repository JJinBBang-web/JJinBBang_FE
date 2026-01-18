import React from 'react';
import styles from './QuestionInfo.module.css';

interface QuestionInfoProps {
    title : string;
    description? : string;
    isRequired? : boolean;
}

const QuestionInfo: React.FC<QuestionInfoProps> = ({
    title,
    description,
    isRequired,
}) => {
    return (
        <div className={styles.questionInfo}>
            <div className={styles.titleRow}>
                <span className={styles.title}>{title}</span>
                {isRequired === true && <span className={styles.required}>*</span>}
                {isRequired === false && <span className={styles.optional}>선택</span>}
            </div>
            {description && <p className={styles.description}>{description}</p>}
        </div>
    );
}

export default QuestionInfo;