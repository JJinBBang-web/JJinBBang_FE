// src/components/auth/PrivacyPolicyDetail.tsx
import React from 'react';
import styles from './TermsDetail.module.css';
import backArrowIcon from '../../assets/image/backArrowIcon.svg';
import checkIcon from '../../assets/image/checkIcon.svg';
import checkIconActive from '../../assets/image/checkIconActive.svg';

interface PrivacyPolicyDetailProps {
  onBack: () => void;
  onClose: () => void;
  isChecked: boolean;
  onToggleCheck: () => void;
}

const PrivacyPolicyDetail: React.FC<PrivacyPolicyDetailProps> = ({
  onBack,
  onClose,
  isChecked,
  onToggleCheck,
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onBack}>
            <img src={backArrowIcon} alt="back" />
          </button>
          <h1 className={styles.headerTitle}>개인정보 수집 및 이용</h1>
        </div>
        <div className={styles.content}>
          <h2 className={styles.mainTitle}>
            (필수) 개인정보 수집 및 이용 동의
          </h2>
          <div className={styles.termsContent}>
            <pre className={styles.preformattedContent}>
              {`“찐빵” 서비스 개인정보처리방침
공고 : 2025-06-13   |  시행 : 2025-06-13

유니브(이하 “회사”)는 「개인정보보호법」 및 관련 법령을 준수하며, 이용자의 개인정보를 안전하게 보호하고 고충을 신속 · 원활하게 처리하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다. 본 방침은 “찐빵”(웹·모바일 웹/앱 포함) 서비스에 적용됩니다.

1. 개인정보의 수집
1) 최소 수집 원칙
회원가입·문의·오프라인 이벤트 등 서비스 제공에 필요한 최소한의 개인정보만 수집합니다. 필수항목 외 선택항목 미동의로 인한 서비스 이용 제한은 없습니다.
[소셜 계정 회원가입 시 수집 항목]
소셜사 : 카카오
제공 항목 : 이메일, 카카오 ID

추가 수집
필수 : 닉네임
선택 : 성별, 출생연도, 추가 이메일
[고객 상담 시]
이름, 연락처, 이메일, 상담 내용
2) 자동 수집 정보
접속 IP, 쿠키, 기기정보, 방문·이용 기록 등
3) 수집 방법
회원가입·서비스 이용 중 이용자가 직접 입력
이벤트·세미나 서면 양식
고객센터(웹·메일·전화 등) 접수
서비스 이용 중 자동 생성(쿠키 등)

2. 개인정보 이용 목적
회원 식별, 본인·연령 확인, 부정 이용 방지
문의·불만처리, 공지사항 전달
맞춤형 콘텐츠·광고 제공, 통계·분석, 신규 기능 개발
서비스 안정화(버그·보안 관리)
법령에 따라, 수집 목적과 합리적 관련성이 있는 범위에서 추가 이용·제공할 수 있으며, 이 때 이용자의 이익 침해 여부·가명처리 등 안전성 확보 조치를 종합 검토합니다.

3. 개인정보 처리 위탁
회사는 서비스 운영 향상을 위해 일부 업무를 외부 전문업체에 위탁하며, 수탁자가 개인정보를 안전하게 처리하도록 관리·감독합니다.

수탁자 : Amazon Web Service
위탁 업무 : 클라우드 인프라(저장·처리)
수탁자 : ㈜카카오
위탁 업무 : 카카오 간편 로그인, 알림톡 발송

4. 쿠키 등 자동 수집 장치
쿠키 사용 목적 : 방문 빈도·이력 분석, 이용자 맞춤 추천·광고 제공
거부 방법 : 브라우저 설정에서 ‘쿠키 차단/삭제’ 선택
IE : 도구 > 인터넷옵션 > 개인정보
Chrome : 설정 > 개인정보 및 보안 > 쿠키
Safari / Firefox 등 동일한 위치에서 설정 가능
쿠키 차단 시 일부 서비스 이용이 제한될 수 있습니다.
Google Analytics : 웹 로그 분석 도구 사용(개인 식별 정보 미수집) → 거부 시 tools.google.com/dlpage/gaoptout 플러그인 설치

5. 보유 기간 및 파기
구분
회원 정보 : 회원 탈퇴 시 즉시 파기
고객 문의  : 목적 달성 후 즉시 파기
기록민원 처리 : 종료 후 3년
보존 필요 시 법령에 따라 별도 보관(DB 분리 등)
전자 파일 : 복구 불가 방식 삭제 | 서면 : 분쇄·소각

6. 이용자 권리 및 행사 방법
개인 정보 열람·정정·삭제·처리정지 요청 가능
문의 : T) 010-9350-8862 E) 218155223@gnu.ac.kr
대리인이 요청할 경우 법정대리권 확인 후 처리
오류 정정 요청 시 완료 전까지 해당 정보 이용·제공 중단

7. 개인정보 보호책임자
보호책임자 : CEO 방유찬
담당 부서 : 기획 및 개인정보보호팀
전화 / 이메일 : 010-9350-8862 / 218155223@gnu.ac.kr

추가 상담 기관 : 개인정보침해신고센터(118), 경찰청 사이버수사국(182) 등

8. 안전성 확보 조치
관리적 : 내부관리계획·임직원 교육
기술적 : 접근권한 관리, 암호화, 보안프로그램 적용
물리적 : 서버실·자료보관실 출입통제

9. 적용 범위
본 방침은 “찐빵” 웹·모바일 서비스에 한해 적용되며, 외부 링크·협력사 서비스는 별도 방침이 적용될 수 있습니다.

10. 방침 변경
법령·서비스 변경 시 내용을 수정하며, 최소 7 일 전 홈페이지 공지 후 시행합니다.
공고 : 2025-06-13 | 시행 : 2025-06-13`}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyDetail;
