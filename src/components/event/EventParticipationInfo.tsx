// src/components/event/EventParticipationInfo.tsx
import React from "react";
import styles from "./EventParticipationInfo.module.css";

type Props = {
  phone: string;
  onPhoneChange: (phone: string) => void;
  agreeMarketing: boolean;
  onAgreeMarketingChange: (agree: boolean) => void;
  agreePrivacy: boolean;
  onAgreePrivacyChange: (agree: boolean) => void;
};

const EventParticipationInfo: React.FC<Props> = ({
  phone,
  onPhoneChange,
  agreeMarketing,
  onAgreeMarketingChange,
  agreePrivacy,
  onAgreePrivacyChange,
}) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 추출
    const numbersOnly = e.target.value.replace(/[^\d]/g, "");

    // 11자리 초과 입력 방지
    if (numbersOnly.length > 11) return;

    // 자동 하이픈 추가 (010-0000-0000 형식)
    let formatted = numbersOnly;
    if (numbersOnly.length > 3 && numbersOnly.length <= 7) {
      formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    } else if (numbersOnly.length > 7) {
      formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7)}`;
    }

    onPhoneChange(formatted);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>휴대폰 번호</p>
      <input
        type="tel"
        className={styles.phoneInput}
        value={phone}
        onChange={handlePhoneChange}
        placeholder="010-0000-0000"
        maxLength={13}
      />

      <div className={styles.checkboxContainer}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreeMarketing}
            onChange={(e) => onAgreeMarketingChange(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>
            이벤트 참여 및 마케팅 수신 동의 (필수)
          </span>
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={(e) => onAgreePrivacyChange(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>
            개인정보 수집 동의 (필수)
          </span>
        </label>
      </div>
    </div>
  );
};

export default EventParticipationInfo;
