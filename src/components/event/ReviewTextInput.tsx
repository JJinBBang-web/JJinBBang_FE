// src/components/event/ReviewTextInput.tsx
import React, { useRef, useLayoutEffect } from "react";
import styles from "./ReviewTextInput.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  minLength?: number;
};

const ReviewTextInput: React.FC<Props> = ({
  value,
  onChange,
  maxLength = 1000,
  minLength = 20,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "inherit";
    const computedHeight = Math.max(150, textarea.scrollHeight);
    textarea.style.height = `${computedHeight}px`;
  };

  useLayoutEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={styles.wrapper}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={value}
        onChange={handleChange}
        placeholder={`미래 후배들을 위해 솔직한 거주 후기를 남겨주세요! (최소 ${minLength}자 이상)`}
        maxLength={maxLength}
      />
    </div>
  );
};

export default ReviewTextInput;
