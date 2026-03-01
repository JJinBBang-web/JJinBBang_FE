---
name: jjinbbang-project-structure
description: 찐빵(JJinBBang) 프론트엔드 프로젝트 헌법 및 폴더 구조 가이드라인.
priorities:
  - 1: 페이지 우선 법칙 (Page First, Features Later)
  - 2: 재사용될 때만 Features로 승격 (Promote on Reuse)
  - 3: 의존성 규칙 엄수 (Strict Dependency Direction)
---

# 📜 찐빵(JJinBBang) 프로젝트 헌법 (The Constitution)

이 문서는 프로젝트의 **핵심 기준(Source of Truth)** 입니다. 모든 코드 생성, 변경은 이 규칙을 따릅니다.

## I. AI 행동 강령 (AI Protocol & Workflow)

**"뇌피셜로 코딩하지 말고, 근거를 대고 움직여야 함."**

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
  - **1순위**: 프로젝트 내부 가이드라인(`.agent/skills/vercel-composition-patterns/SKILL.md`, `.agent/skills/vercel-react-best-practices/SKILL.md`) 확인.
  - **2순위**: 최신 React/TypeScript 공식 문서 (React 18+, TS 5+ 호환성 확인).
  - **3순위**: 커뮤니티 지식 (StackOverflow 등).
  - **Conflict Resolution (충돌 해결)**: Context(0순위)와 Standard(2순위)가 충돌할 경우, 무조건 따르지 말고 **"Legacy 유지"** 또는 **"표준 준수를 위해 무시"** 여부를 명시(Annotate)해야 함.

### 3. 자가 검증 (Self-Correction)

작성한 코드를 바로 전달하지 말고, 스스로 검열해야 함.

- **Consistency Check**: 조회한 공식 문서의 문법과 일치하는가?
- **Rule Check**: 이 프로젝트 규칙을 준수했는가?
- **Security & Complexity Check**: 민감 정보(Key) 하드코딩 여부, 불필요한 복잡도(중첩 루프, 과도한 리렌더링)가 없는가?
- **Verification Strategy**: "AI의 확신"은 믿을 수 없음. 따라서 작성한 코드를 **어떻게 검증할 것인가(Test Case, Curl, Log Check)**를 반드시 함께 제시해야 함. 검증 불가능한 코드는 가치가 없음.

## II. 기술 스택 (Foundation)

**이 도구들 외의 다른 라이브러리 사용을 금합니다.**

| 분류             | 기술                       | 설명                                                          |
| :--------------- | :------------------------- | :------------------------------------------------------------ |
| **Framework**    | **Create React App (CRA)** | 현재 `react-scripts` 사용 중. (⚠️ **Vite 마이그레이션 예정**) |
| **Language**     | **TypeScript**             | Strict Mode 준수. `any` 사용 지양.                            |
| **Styling**      | **Tailwind CSS Only**      | **Zero-Runtime 전략**. Styled-components 사용 금지.           |
| **Client State** | **Recoil**                 | 모달 열림 여부, 유저 로그인 상태 등 **UI 전역 상태**.         |
| **Server State** | **TanStack Query**         | 서버 API 호출, 캐싱. **`useEffect`로 API 호출 금지**          |
| **Routing**      | **React Router**           | `v6` 이상 사용.                                               |

## III. 아키텍처 및 구조 (Architecture & Structure)

**"하이브리드 모듈형 아키텍처 (Pages + Features + Shared)"**를 따릅니다.
기본 로직은 `pages`에 응집시키고, **재사용되는 도메인 로직만** `features`로 승격시킵니다.

### 1. 폴더 구조 (Project Structure)

```
src/
├── api/                  # 📡 백엔드 API 명세
│   ├── auth/             # 기능별 폴더링
│   │   ├── AuthAPI.ts    # 실제 호출 함수 (axios)
│   │   └── AuthType.ts   # Request/Response 타입 정의 (Interface 대신 Type 사용)
│   ├── map/
│   │   ├── MapAPI.ts
│   │   └── MapType.ts    # Request/Response 타입 정의
│   ├── api.ts            # Axios Instance 설정 (Interceptors)
│   ├── baseAPI.ts        # 공용 API 래퍼 함수 (getAPI, postAPI)
│   └── baseType.ts       # 공용 타입 정의 (BaseResponse 등)
├── assets/               # 🎨 정적 자원
│   ├── fonts/            # 폰트 파일
│   ├── images/           # 이미지 리소스
│   │   ├── shared/       # 공용 이미지
│   │   ├── home/         # 홈 화면 전용
│   │   └── map/          # 지도 화면 전용
│   └── icons/            # SVG 아이콘
├── features/             # 🧩 공유 도메인 로직 (Shared Business Logic)
│   ├── auth/             # (예: 로그인 유지, 토큰 관리) - 여러 페이지 사용
│   ├── map/              # (예: 지도 SDK 초기화) - 여러 페이지 사용 가능성 있음
│   └── review/           # (예: 후기 타입 정의)
├── pages/                # 📄 페이지 단위 (라우팅 & 조립)
│   ├── Home/             # 홈 화면
│   │   ├── components/   # 지역 컴포넌트
│   │   ├── hooks/        # 지역 훅
│   │   ├── recoil/       # 지역 상태 (Atom)
│   │   └── Home.tsx
│   └── Map/              # 지도 화면
│       ├── components/
│       ├── hooks/
│       ├── recoil/
│       └── Map.tsx
├── shared/               # 🛠️ 공용 도구 (비즈니스 로직 없음)
│   ├── ui/               # Atomic Components (Button, Input)
│   ├── utils/            # 순수 유틸리티 (Date, String)
│   └── hooks/            # 범용 훅 (useWindowSize)
└── App.tsx               # 메인 진입점
```

### 2. 레이어 정의 (Strategy: Pragmatic Layering)

기본적으로 **Page-First**를 따르되, 명확한 핵심 도메인은 **선제적으로 승격**시킵니다.

1.  **Pages (Default Rule)**
    - 모든 로직과 상태는 **일단 Page 내부에** 둡니다. (`components`, `hooks`, `recoil` 활용)
    - "이거 나중에 쓸 것 같은데?"라는 막연한 추측으로 `features`로 보내지 마세요. (YAGNI)

2.  **Features (Exception: Pre-emptive Promotion)**
    - **"기획 단계에서 이미 전역 사용이 확실한 핵심 도메인"**은 처음부터 `features`에 생성합니다.
    - **기준**: **서버 데이터(DB)**를 다루면서 + **여러 화면**에서 접근해야 하는 경우.
    - **필수 적용 대상**: `auth`(로그인), `user`(내 정보).
    - _목적: 나중에 리팩토링하기 귀찮아서 코드를 복사/붙여넣기(Ctrl+C/V) 하는 참사를 방지함._

3.  **Shared (Common)**
    - 비즈니스 로직이 없는 순수 UI/Util.

### 3. 의존성 방향 (Dependency Direction)

**엄격한 단방향 의존성**을 준수해야 합니다. 역주행은 절대 금지(Strictly NO Circular Dependency).

1.  **Pages** ➡️ `features`, `api`, `shared`
2.  **Features** ➡️ `api`, `shared` (다른 `features` 참조는 최소화)
3.  **API** ➡️ `shared/utils` (순수 함수만 가능, UI 참조 금지)
4.  **Shared** ➡️ 🚫 **의존성 없음 (No Dependencies)**
    - `shared`는 **절대로** `api`나 `features`를 import 할 수 없습니다.
    - API 호출이 필요한 컴포넌트는 `shared`가 아니라 `features`로 승격시켜야 합니다.

### 4. 리팩토링 원칙

- "이거 나중에 쓰겠지?"라고 미리 `features`로 빼지 마세요. (YAGNI)
- 일단 `pages/Map/hooks`에 만들고, 나중에 다른 페이지가 달라라고 하면 그때 옮기세요.

## IV. 데이터 전략 (Data Strategy)

데이터의 출처에 따라 도구를 분리합니다. 섞어 쓰지 마세요.

1.  **서버 데이터 (Server State) 👉 TanStack Query**
    - API에서 가져오는 모든 데이터 (`isLoading`, `error` 처리 포함).
    - ❌ API 데이터를 `useState`나 `Recoil`에 복사해서 쓰지 마세요. (Sync 깨짐)

2.  **클라이언트 상태 (Client State) 👉 Recoil**
    - 내 앱에서 생성된 데이터 (다크모드, 사이들바 열림, 토스트 메시지).
    - `src/recoil/`, `src/features/.../recoil/` 또는 `src/pages/.../recoil/` 에 정의.

3.  **영구 저장 상태 (Persisted State) 👉 recoil-persist / Storage API**
    - 새로고침 시 유지 필요한 데이터 (로그인 정보 등).
    - Recoil Atom은 `effects_UNSTABLE`(`recoil-persist`) 사용 권장.
    - 단순 값은 `src/shared/utils/storage.ts` 등의 래퍼 함수 사용 (직접 `localStorage`, `sessionStorage` 호출 지양).

## V. 코딩 컨벤션 (Coding Standards)

### 1. 작명 규칙 (Naming Conventions)

**OS 대소문자 이슈(Case Sensitivity) 방지를 위해 `kebab-case`를 강력 권장합니다.**

| 종류            | 규칙           | 예시                                                     |
| :-------------- | :------------- | :------------------------------------------------------- |
| **폴더**        | **kebab-case** | `src/pages/home-page`, `src/features/auth-user`          |
| **파일**        | **kebab-case** | `home-page.tsx`, `auth-api.ts`, `use-auth.ts`            |
| **컴포넌트 명** | **PascalCase** | `HomePage`, `ReviewCard` (파일 내 코드 작성 시)          |
| **상수**        | **UPPER_CASE** | `MAX_COUNT`, `API_URL`                                   |
| **타입**        | **PascalCase** | `User`, `AuthResponse` (Interface 금지, Type Alias 사용) |

### 2. 코드 작성 규칙

#### 2.1 절대 경로 사용 (Absolute Imports)

지옥 같은 `../../../` 경로를 금지합니다. `tsconfig.json`의 `baseUrl`을 활용하세요.

- ✅ `import Button from 'shared/ui/Button';`
- ❌ `import Button from '../../../shared/ui/Button';`

#### 2.2 스타일 코딩 규칙 (Tailwind Only Strategy)

**"Tailwind CSS만 사용합니다(Zero-Runtime). Styled-components 사용을 금지합니다."**

1.  **Tailwind CSS 사용 원칙 (기본)**:
    - **레이아웃 & 배치**: `flex`, `grid`, `absolute`, `z-index` 등 모든 스타일을 Tailwind로 처리합니다.
    - **타이포그래피 & 색상**: `text-xl`, `font-bold`, `text-gray-500` 등 유틸리티 클래스를 사용합니다.

2.  **JIT 모드 & Arbitrary Values 전략**:
    - **One-off (1회성)**: 정말 어쩌다 한번 나오는 값(예: `z-[100]`, `top-[57px]`)은 `[]` 사용 허용.
    - **Recurring (반복)**: **3회 이상 반복**되는 값(예: 브랜드 컬러 `#FF5733`, 공통 간격 `13px`)은 반드시 `tailwind.config.js`의 `theme.extend`에 등록하여 디자인 토큰(`text-brand`, `mt-3.25`)으로 사용해야 함.
    - **Why**: 매직 넘버(`w-[17px]`)가 코드 전체를 뒤덮으면 디자인 변경 시 유지보수가 불가능해짐.

3.  **동적 스타일링 (Dynamic Styling)**:
    - **Styled-components 대신 `clsx` + `tailwind-merge` 조합을 사용합니다.**
    - 조건부 스타일링이 복잡해질 경우, `cva` (Class Variance Authority) 라이브러리 도입을 고려합니다.
    - ❌ `styled.div<{ active: boolean }>` (금지)
    - ✅ `className={clsx('p-4', active && 'bg-blue-500')}`

4.  **반응형 디자인 (Responsive Design) - Mobile First**:
    - **원칙**: 모바일 스타일을 기본(Default)으로 작성하고, `md:`(태블릿), `lg:`(PC) 순서로 확장합니다. (min-width 기준)
    - ❌ `max-md:hidden` (Desktop First 금지)
    - ✅ `hidden md:block` (Mobile First 준수)

#### 2.3 Export 규칙 (Export Style)

`export` 키워드는 함수나 변수 **정의와 동시에** 작성합니다. 파일 하단에 별도로 `export` 문을 두는 것을 금지합니다.

- ✅ `export const MyComponent = () => { ... }`
- ❌ `const MyComponent = () => { ... }; export default MyComponent;`

#### 2.4 타입 정의 (Type Definitions)

Props 및 객체 타입 정의 시 `interface` 대신 `type` alias를 사용합니다.

- ✅ `type Props = { ... }`
- ❌ `interface Props { ... }`

### 3. 컴포넌트 설계 (Component Design Strategy)

**Tailwind의 "Class Soup" 문제를 해결하기 위해 컴포넌트 추상화를 강제합니다.**

#### 3.1 Headless UI 패턴 지향

- **로직(Hook)과 스타일(JSX)을 분리합니다.**
- 복잡한 비즈니스 로직은 커스텀 훅으로 추출하고, 컴포넌트는 오직 렌더링만 담당해야 합니다.
- ✅ `useModal()` (로직) + `<Modal>` (스타일) 조합

#### 3.2 합성 컴포넌트 패턴 (Compound Component Pattern)

- **Props Drilling 방지**: Props가 5개 이상 넘어가는 거대 컴포넌트(God Component)를 금지합니다.
- **조립형 설계**: `<Select>` 하나에 모든 걸 때려 넣지 말고, `<Select.Root>`, `<Select.Item>` 처럼 조립 가능한 형태로 구현합니다.
- **유지보수성**: 내부 구현을 숨기고, 사용처에서는 선언적으로 사용할 수 있어야 합니다.

#### 3.3 아토믹 디자인 (Atomic Design Strict Mode)

- **Atoms**: 버튼, 인풋 등 가장 작은 단위. (단일 책임)
- **Molecules**: 원자들의 조합 (예: 검색폼 = 인풋 + 버튼).
- **Organisms**: 서비스의 구체적인 기능을 수행하는 단위 (예: 헤더, 푸터).
- **Rule**: 상위 컴포넌트는 하위 컴포넌트의 스타일을 침범하지 않아야 합니다(Margin 등 여백은 상위에서 주입).

## VI. 문서화 및 유지보수 (Process & Maintenance)

### 1. 주석 및 문서화 (JSDoc)

**"AI가 읽기 좋은 코드가 사람에게도 좋다"** 는 원칙을 따릅니다.

- **모든 파일 문서화**: 컴포넌트뿐만 아니라 `Hook`, `Util`, `API` 함수 등 **모든 파일과 함수**에 JSDoc을 작성해야 합니다.
- **컴포넌트 설명**: 모든 컴포넌트 상단에 JSDoc `/** ... */`을 사용하여 역할과 Props를 설명합니다.

  ```tsx
  /**
   * @description 메인 홈 화면 상단의 자동 슬라이드 배너입니다.
   * 3초마다 자동으로 전환되며, 사용자가 터치 시 일시정지됩니다.
   *
   * @param {string[]} images - 배너 이미지 URL 배열 (최대 5장 권장)
   * @param {number} [interval=3000] - 슬라이드 전환 간격 (ms)
   * @returns {JSX.Element} 슬라이더 UI
   */
  ```

- **복잡한 로직**: `useQuery`, `useEffect` 등의 복잡한 로직에는 "왜(Why)" 이렇게 짰는지 주석을 남깁니다.

### 2. 상세 문서 (Detailed Documentation)

문서도 코드와 함께 있어야 유지보수가 됩니다. (Co-location)

| 구분                     | 위치                                                | 설명                                                                                                                                                                                                               |
| :----------------------- | :-------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **기능 명세 (Features)** | JSDoc (코드 내 주석)                                | **"제약 조건과 엣지 케이스"**를 명시합니다.<br/>- 예: "할인율은 0~100 사이여야 함", "API 실패 시 3회 재시도"                                                                                                       |
| **화면 명세 (Pages)**    | `src/pages/[Page]/README.md`<br/>(or `PageName.md`) | **"데이터 흐름과 시나리오"**를 명시합니다.<br/>- 진입 조건: "로그인 필수 여부, 권한 체크"<br/>- 상태 의존성: "Recoil의 `userState`를 구독함"<br/>- 주요 액션: "저장 버튼 클릭 시 `useSave` 훅 호출 후 홈으로 이동" |

### 3. 지식 지속적 개선 (Continuous Knowledge Evolution)

- **패턴 추출**: 프로젝트 내에서 3회 이상 반복되거나 구조적 일관성이 필요한 패턴 발견 시, AI는 즉시 `SKILL.md` 반영을 제안함. 이때 제안은 단순 질문이 아닌 **'규칙 추가 시의 이득'**을 포함해야 함.
- **충돌 해결**: 작성된 코드가 `SKILL.md`와 상충할 경우, AI는 이를 '기술 부채(Tech Debt)'로 간주하고 경고함. 사용자는 문서를 수정하여 기술 스택을 진화시키거나, 코드를 수정하여 일관성을 유지해야 함. (방치 금지)
- **정기 요약**: 문서가 비대해질 경우, AI는 유사 규칙을 통합하거나 더 이상 사용되지 않는 규칙의 폐기를 제안하여 문서의 순도를 유지함.
