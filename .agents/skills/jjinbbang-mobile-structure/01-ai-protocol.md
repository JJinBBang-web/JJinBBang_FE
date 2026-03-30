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
    - **Ripple Effect Check**: 수정 대상 코드를 호출하는 **주요 상위 파일(Key Caller)을 샘플링**하여 제한적으로 호환성을 확인함.
  - **1순위**: 프로젝트 내부 가이드라인(`.agents/skills/jjinbbang-mobile-structure/`) 확인.
  - **2순위**: 최신 React Native/Expo 공식 문서 (Expo Router, NativeWind 등).
  - **3순위**: 커뮤니티 지식 (StackOverflow 등).
  - **Conflict Resolution (충돌 해결)**: Context(0순위)와 Standard(2순위)가 충돌할 경우, 무조건 따르지 말고 **"Legacy 유지"** 또는 **"표준 준수를 위해 무시"** 여부를 명시(Annotate)해야 함.

### 3. 중복 구현 방지 및 기능 승격 프로토콜 (Anti-Duplication)
AI는 새로운 기능을 개발하거나 파일을 생성하기 전, 다음 절차를 반드시 준수합니다.

1. **매니페스트 확인 (Check Manifest)**: 프로젝트 루트의 `manifest.md`를 읽고 유사하거나 동일한 기능이 이미 존재하는지 확인함.
2. **지역 기능 재사용 & 승격 (Reuse & Promotion)**: 
   - 특정 화면의 지역 폴더(`_hooks`, `__components` 등)에서 이미 구현된 기능을 발견했다면, 해당 파일을 **`src/features/`**로 즉시 이동함.
   - 이동 후에는 매니페스트를 갱신하고, 필요한 모든 화면에서 공용 비즈니스 로직으로 재사용함.
3. **매니페스트 갱신 (Update Manifest)**: 독립적인 새로운 기능을 개발 완료한 후에는 반드시 매니페스트에 추가하여 추후 중복을 원천 차단함.

### 4. 자가 검증 (Self-Correction)

작성한 코드를 바로 전달하지 말고, 스스로 검열해야 함.

- **Consistency Check**: 조회한 공식 문서의 문법과 일치하는가?
- **Rule Check**: 이 프로젝트 규칙을 준수했는가?
- **Security & Complexity Check**: 민감 정보(Key) 하드코딩 여부, 불필요한 복잡도(중첩 루프, 과도한 리렌더링)가 없는가?
- **Verification Strategy**: "AI의 확신"은 믿을 수 없음. 따라서 작성한 코드를 **어떻게 검증할 것인가(Test Case, Log Check)**를 반드시 함께 제시해야 함. 검증 불가능한 코드는 가치가 없음.
