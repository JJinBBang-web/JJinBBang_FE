# I. AI 행동 강령 (AI Protocol & Workflow)

**"뇌피셜로 코딩하지 말고, 근거를 대고 움직여야 함."**

이 섹션은 AI가 코드를 생성하거나 수정할 때 반드시 지켜야 할 사고 과정을 정의합니다.

### 1. 판단 및 결정 (Stop & Judge)

작성을 시작하기 전에 먼저 판단해야 함.

- **Fast Track (바로 가기)**: 단순 오타 수정, 주석 추가, 기존 패턴 복사/붙여넣기(Boilerplate).
  👉 **단, `Source Validity Check` 필수: 기존 패턴이 최신 Best Practice에 위배되거나 기술 부채(Anti-pattern)일 경우 복사를 금지하고 개선안을 제시할 것.**
- **Stop (멈춤)**: 설정(Config) 변경, 새로운 기술/라이브러리 도입, 복잡한 비즈니스 로직 설계.
  👉 **무조건 Step 2로 이동해야 함.**

### 2. 탐색 및 설계 (Search & Plan)

절대 추측으로 코드를 작성하면 안 됨.

- **Search (팩트 체크)**:
  - **0순위**: **Project Context 분석 (Ripple Effect Check 포함).**
    - **자동화 검증 (Tier 시스템)**:
      - AI는 모든 작업 단계마다 무분별하게 전체 검증 스크립트를 실행하지 않고, 아래 **Tier 기준**에 따라 선택적으로 실행함.
      - **Tier 1 (상시 - 모든 코드 수정 후)**:
        - `npm run lint`: 정적 분석 검사
        - `npx tsc --noEmit`: 타입 체크
      - **Tier 2 (구조 변경 - 새 파일/폴더 생성 시)**:
        - `npm run check:naming`: 네이밍 컨벤션 검사
        - `npm run check:guidelines`: 아키텍처 정합성 검사
        - `npm run check:route-mapping`: 라우트-스크린 매핑 검증
      - **Tier 3 (최종 완료 - PR 제출 전 또는 큰 기능 완료 시)**:
        - `npm run check:all`: 모든 검증 스크립트 일괄 실행
    - **Ripple Effect Check (상향식 검증)**:
      - 수정 대상 코드를 직접 `import` 하는 상위 파일을 확인하여 타입 및 로직 호환성을 반드시 확인하고 보고함. (`npx tsc --noEmit` 활용 권장)
      - **Cross-Domain Check (횡방향 검증)**: 공용 영역(`shared/`, `features/`) 수정 시, 영향받는 서로 다른 도메인 화면 중 **최소 1개**의 정상 동작을 확인해야 함.
  - **1순위**: 프로젝트 내부 가이드라인(`.agents/skills/jjinbbang-mobile-structure/`) 확인.
  - **2순위**: 설치된 Vercel 스킬 가이드라인 확인.
    - `vercel-react-native-skills`: 리액트 네이티브 최적화 및 베스트 프랙티스.
    - `vercel-composition-patterns`: 컴포넌트 합성 및 구조 설계 패턴.
  - **3순위**: 최신 React Native/Expo 공식 문서 (Expo Router, NativeWind 등).
  - **4순위**: 커뮤니티 지식 (StackOverflow 등).
  - **Conflict Resolution (충돌 해결)**:
    - Context(Legacy)와 Standard(최신 표준)가 충돌할 경우, AI가 자의적으로 판단하지 말고 **반드시 사용자에게 다음 방식 중 하나를 선택하도록 질문해야 함.**
    - 질문 예시: "기존 코드는 A 방식(Legacy)이나, 현재 표준은 B 방식입니다. 이 파일만 표준을 따를까요, 아니면 일관성을 위해 Legacy를 유지할까요?"
    - 사용자의 승인 없이 자의적으로 표준으로 마이그레이션하거나 Legacy를 답습하지 말 것.

### 3. 중복 구현 방지 및 기능 승격 프로토콜 (Anti-Duplication)

AI는 새로운 기능을 개발하거나 파일을 생성하기 전, 다음 절차를 반드시 준수합니다.

1. **매니페스트 및 지능형 중복 확인 (Check Manifest & Similarity)**:
   - 프로젝트 루트의 `manifest.md`를 읽고, 반드시 **`npm run check:manifest`**를 실행하여 시스템이 감지한 **지능형 중복/유사 의심 사례**를 확인함.
   - 스크립트가 보고하는 "식별자 중복" 또는 "키워드 유사도" 경고가 있다면, AI는 자의적으로 무시하지 말고 반드시 해당 파일들을 비교 분석하여 `src/features/` 승격 여부를 결정함.
2. **연구 증거 제출 (Submit Evidence of Research) [권장]**:
   - 새로운 기능을 구현하기 전, AI는 가능한 한 관련 도메인의 README 또는 JSDoc을 확인하여 중복을 예방함.
   - **형식적 보고를 지양**하고, 실제 중복이 의심되는 지점이 있다면 사용자에게 보고함.
3. **두 번째 사용처 발생 시 승격 (Promote on 2nd Use)**:
   - 특정 화면의 지역 폴더(`hooks/`, `components/` 등)에 있는 기능을 **두 번째 다른 화면**에서 사용해야 하는 상황이 발생했을 때만 **`src/features/`**로 승격시킴.
   - 단일 화면에서만 사용되는 기능을 무분별하게 Features로 이동시키지 않음.
   - 이동 시, 해당 기능이 특정 화면 폴더의 파일을 역참조(Import)하고 있지 않은지 확인하고, 필요하다면 타입/유틸도 함께 승격시켜 **의존성 단방향(Features -> Screens 참조 금지)**을 유지함.
4. **매니페스트 및 지역 문서 최신화 (Context-Aware Update)**:
   - 파일을 새로 생성하거나 승격했을 경우 **해당 변경과 직접 관련된** `manifest.md` 및 문서(README, JSDoc)를 최신화함.
   - **문서화 차별화**:
     - **Screens**: 반드시 폴더 내부에 전용 **`README.md`**를 포함해야 함.
     - **Features**: 메인 엔트리 파일(index 등)에 상세한 **JSDoc**을 작성하여 관리함.
   - 변경 사항 발생 시 영향받는 최소 범위의 문서를 업데이트하여 정보의 정합성을 유지함.

### 4. 자가 검증 (Self-Correction & Evidence)

작성한 코드를 바로 전달하지 말고, 반드시 시스템적 근거를 확보해야 함.

- **Consistency Check**: 조회한 공식 문서의 문법과 일치하는가?
- **Rule Check**: 이 프로젝트 규칙(의존성 방향 등)을 준수했는가?
- **CLI Evidence (Tier 기준)**:
  - 코드를 파일로 생성하거나 수정한 후 **현재 작업 단계에 해당하는 Tier 검증**을 수행하고 결과를 보고함.
  - 보고 시 "수정했습니다" 대신 **"Tier [N] 검증(lint, tsc 등) 결과 에러가 없음을 확인했습니다"**라고 근거를 포함하여 보고함.
  - **주의**: 새로 추가된 `no-restricted-paths`(횡단 참조 금지), `useEffect` Error 등의 엄격한 ESLint 에러가 발생할 경우, 자의적으로 `eslint-disable`을 남용하지 말고 **아키텍처 수준에서의 구조 변경(예: 기능 승격, 파일 이동)**을 먼저 고려해야 함.
- **Verification Strategy**: 작성한 코드를 **어떻게 검증할 것인가(Test Case, Log Check)**를 반드시 함께 제시해야 함. 검증 불가능한 코드는 가치가 없음.
