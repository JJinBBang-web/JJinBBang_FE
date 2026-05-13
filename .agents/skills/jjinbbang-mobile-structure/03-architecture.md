# III. 아키텍처 및 구조 (Architecture)

**「화면 우선, 기능은 나중에 (Screen First, Features Later)」**

## 1. 폴더 구조 (Project Structure)

애플리케이션은 **「플랫 스크린(Flat Screens)」** 아키텍처를 따릅니다. `app/` 폴더는 프레임워크가 요구하는 **라우팅 엔트리(진입점)** 역할만 수행하며, 화면을 구성하는 실제 컴포넌트와 비즈니스 로직은 라우트 중첩 깊이와 무관하게 `src/screens/` 내의 **단일 계층 도메인 폴더**에 응집(Colocation)시킵니다.

```text
app/                            # 🗺️ 라우팅 엔트리 (Routing Only)
├── (auth)/
│   └── login.tsx               # 로그인 진입점 (주소: /login)
├── (tabs)/
│   ├── (main)/
│   │   └── index.tsx           # 🏠 홈 진입점 (주소: /)
│   ├── (heartList)/
│   │   └── heartList.tsx       # 💛 관심 목록 진입점
│   ├── (review)/
│   │   └── review.tsx          # 📝 리뷰 진입점
│   ├── (content)/
│   │   └── content.tsx         # 📰 콘텐츠 진입점
│   ├── (myPage)/
│   │   └── myPage.tsx          # 👤 마이페이지 진입점
│   └── _layout.tsx
├── detail/
│    └── [id].tsx               # 상세 진입점 (주소: /detail/:id)
├── +not-found.tsx
└── _layout.tsx                 # 최상위 루트 레이아웃

src/
├── screens/                    # 🏗️ 화면 단위 구현부 (Flat Screens)
│   ├── Main/                   # (tabs)/(main)/index.tsx 화면 구현부
│   │   ├── MainScreen.tsx      # - 실제 화면 컴포넌트
│   │   ├── components/
│   │   └── hooks/
│   ├── HeartList/              # (tabs)/(heartList)/heartList.tsx 화면 구현부
│   │   ├── HeartListScreen.tsx
│   │   ├── components/
│   │   └── hooks/
│   ├── Review/                 # (tabs)/(review)/review.tsx 화면 구현부
│   │   ├── ReviewScreen.tsx
│   │   ├── components/
│   │   └── hooks/
│   ├── Content/                # (tabs)/(content)/content.tsx 화면 구현부
│   │   ├── ContentScreen.tsx
│   │   └── components/
│   ├── MyPage/                 # (tabs)/(myPage)/myPage.tsx 화면 구현부
│   │   ├── MyPageScreen.tsx
│   │   └── components/
├── api/                        # 📡 백엔드 API 명세
│   ├── auth/                   # - 기능별 그룹화(Domain logic)
│   │   ├── AuthAPI.ts          # - 실제 호출 함수 (Axios)
│   │   └── AuthType.ts         # - Request/Response 타입 정의 (Type 사용)
│   ├── map/
│   │   ├── MapAPI.ts
│   │   └── MapType.ts
│   ├── api.ts                  # - Axios Instance 설정 (Interceptors 등)
│   ├── baseAPI.ts              # - 공용 API 래퍼 (getAPI, postAPI)
│   └── baseType.ts             # - 공용 타입 정의 (BaseResponse 등)
├── constants/                  # 🔢 전역 상수 (Global Constants)
│   ├── colors.ts               # - 브랜드 컬러 토큰 (NativeWind theme 연동)
│   ├── fonts.ts                # - 폰트 패밀리 / 사이즈 정의
│   └── index.ts                # - 상수 통합 export
├── assets/                     # 🎨 정적 자원 (Static Assets)
│   ├── fonts/                  # - 폰트 파일
│   ├── images/                 # - 이미지 리소스 분류
│   │   ├── shared/             # - 공용 이미지
│   │   ├── home/               # - 홈 화면 전용
│   │   └── map/                # - 지도 화면 전용
│   └── icons/                  # - 파비콘, 앱 아이콘 등 정적 메타 파일
├── features/                   # 🧩 공유 도메인 로직 (Shared Business Logic)
│   ├── auth/                   # - 인증/유저 관련 공용 로직
│   │   ├── components/
│   │   ├── hooks/
│   │   └── store/
│   ├── map/                    # - 지도 SDK 및 데이터 연동 공용 로직
│   │   ├── components/
│   │   ├── hooks/
│   │   └── store/
│   └── review/                 # - 후기 관련 공용 데이터 처리
│       ├── components/
│       ├── hooks/
│       └── store/
└── shared/                     # 🛠️ 공용 도구 (UI, Utils, Hooks)
    ├── components/             # - 공통 범용 UI 요소
    └── utils/                  # - 범용 유틸 함수
```

## 2. 레이어별 역할 및 규칙

### 1. 라우팅 전용 원칙 (Routing Isolation)

- **최소 구현 원칙 (Entry vs Implementation)**:
  - **app/ (안내 데스크)**: URL 주소를 인식하고 필요한 데이터(ID 등)만 뽑아내는 역할만 합니다. 비즈니스 로직은 절대 여기에 두지 않습니다.
    - 예: `app/(tabs)/(main)/index.tsx`에서는 오직 `MainScreen`을 import하여 렌더링만 수행합니다.
  - **src/screens/ (실제 작업실)**: 화면의 실제 뼈대와 로직이 위치하는 곳입니다.
    - 예: `src/screens/Main/MainScreen.tsx`에 실제 홈 화면의 모든 UI와 로직이 들어있습니다.
  - **이유**: 이렇게 분리하면 나중에 앱의 **메뉴 구조(URL)**가 바뀌더라도, 실제 구현된 **화면 코드**는 하나도 건드리지 않고 `app/` 폴더 안의 파일 위치만 옮기면 되기 때문입니다.

### 2. src/screens 플랫 응집 규칙 (Flat Colocation)

- 개별 화면을 구성하는 로직은 **라우트 중첩 깊이와 무관하게** `src/screens/` 내부의 고유한 도메인 폴더(예: `Main/`, `HeartList/`) 안에 **단일 계층으로** 모아둡니다.
- **스크린 컴포넌트**: 각 도메인 폴더의 최상위에는 해당 화면의 실제 구현체인 **`[Name]Screen.tsx`** 파일이 반드시 존재해야 합니다. (예: `src/screens/Main/MainScreen.tsx`)
- `app/` 내의 URL 구조가 변경되더라도(`(tabs)/` → `(main)/` 등), `src/screens/` 영역은 **전혀 수정할 필요가 없어** 유지보수성이 향상됩니다.
- **폴더 네이밍**: 화면 폴더는 **PascalCase**로 명명합니다. (예: `Main/`, `HeartList/`)
- **내부 구조**: 각 화면 폴더 내부에는 `components/`, `hooks/`, `store/` 폴더를 필요에 따라 배치합니다.
- **의존성 단방향 원칙**: 
  - 참조 방향은 항상 **`Screens -> Features -> Shared`** 순서로만 흐릅니다. 
  - 공용 영역(`Features`, `Shared`)에 있는 코드는 절대로 특정 화면(`Screens`)의 파일을 `import` 할 수 없습니다. (역참조 발생 시 기능 승격 필요)
  - **횡단 참조 금지**: `Features` 내부의 서로 다른 도메인(예: `auth`와 `map`) 간의 직접적인 `import`는 원칙적으로 금지합니다. 기능 간 연동이 필요한 경우 부모인 `Screens`에서 Props/콜백으로 합성(Composition)하거나 전역 상태(Zustand)를 활용해 결합도를 낮춥니다.
- **Layout 전용 컴포넌트**: `_layout.tsx`에서만 사용되는 컴포넌트(예: `TabBarIcon`)는 해당 레이아웃과 가장 밀접한 `src/features/[domain]/components/`에 위치시킵니다. (예: `src/features/navigation/components/TabBarIcon.tsx`). 범용적이라면 `src/shared/components/`로 승격합니다.

### 3. API 통신 수칙 (api/*)

- **명명법**: `[Domain]API.ts` (구현), `[Domain]Type.ts` (타입) 형식으로 분리하여 관리합니다.
- **타입 정의**: `interface` 대신 **`type`** 키워드를 사용하여 모든 Request/Response 타입을 정의합니다. (일관성 유지)
- **중앙 관리**: `api.ts`에서 공통 인증 토큰 처리나 에러 인터셉터를 관리하며, `baseAPI`를 통해 공통된 호출 로직(Base Response 처리 등)을 추상화합니다.

### 4. 전역 상수 (constants/*)

- **역할**: 코드 전체에서 공통으로 참조하는 **변하지 않는 값**만 위치시킵니다. (`UPPER_SNAKE_CASE` 규칙 적용)
- **컬러**: `colors.ts`에 브랜드 컬러 토큰을 정의하고, NativeWind `tailwind.config.js`의 `theme.extend`와 연동합니다. 컬러 값은 `constants/colors.ts`를 **단일 출처(Single Source of Truth)**로 관리합니다.
- **폰트**: `fonts.ts`에 폰트 패밀리 및 사이즈 스케일을 정의합니다.
- **주의**: 비즈니스 로직에 의존하는 값, API URL, 동적으로 변하는 값은 이곳에 두지 않습니다.

### 5. 정적 자원 관리 (assets/*)

- **이미지**: `src/assets/images/` 하위에 관리합니다. 여러 화면에서 공용으로 사용하는 자산은 `shared/` 폴더에, 특정 화면에만 종속적인 자원은 해당 화면 이름을 딴 폴더(예: `home/`, `map/`)에 격리하여 관리합니다.
- **아이콘**:
    - **앱 메타**: 파비콘, 스플래시, 앱 아이콘 등 시스템용 정적 파일은 `src/assets/icons/`에 배치합니다.
    - **UI 아이콘**: `react-native-svg-transformer`를 통해 컴포넌트로 사용하는 SVG 파일 역시 `src/assets/icons/` 하위에서 도메인별로 분류하여 관리합니다. (기존 `src/shared/icons`는 폐지)

### 6. 공유 도메인 로직 (features/*)

- 특정 화면에 종속되지 않고 여러 페이지에서 공용으로 사용되는 복잡한 비즈니스 로직, 상태 관리, 공용 UI 컴포넌트를 위치시킵니다.
- **도메인 종속성**: 비즈니스 규칙과 도메인 데이터가 얽힌 재사용 컴포넌트(예: `AuthForm.tsx`, `MapPin.tsx`)만을 이곳에 배치하여 명확히 분리합니다.
- **Layout 전용 컴포넌트**: `_layout.tsx`에서만 사용되는 컴포넌트도 해당 도메인 feature 폴더에 위치시킵니다. (예: 탭 네비게이션 관련 → `features/tab/components/`)
- **구조 통일**: 화면(`screens/`) 내부 구조와 동일하게 `components/`, `hooks/`, `store/` 폴더를 사용하여 코드 탐색의 일관성을 유지합니다.

### 7. 공용 도구 (shared/*)

- **도메인-Agnostic(불가지론)**: 특정 비즈니스 도메인에 종속되지 않는 범용적인 순수 UI 구성요소(예: `Button.tsx`, `Modal.tsx`) 및 범용 유틸리티(예: `DateUtils.ts`)만 보관합니다.
- 이 규칙을 엄격히 지켜 `shared/` 폴더가 성격 불분명한 모듈들의 거대한 '쓰레기통(Dumping Ground)'이 되는 것을 방지합니다.

## 3. 멀티플랫폼 지원 전략 (Web + Native)

웹과 앱에서 코드가 다르게 동작해야 할 경우 **파일 확장자 분리**를 기본 원칙으로 합니다. 이는 런타임 분기(`Platform.OS`)로 인한 코드 복잡도 증가와 번들 크기 증가를 방지하기 위함입니다.

### 1-1. 분리 방식 (Suffix)

- `[name].tsx`: 플랫폼 공용 로직 및 UI
- `[name].web.tsx`: 웹 전용 구현 (웹 표준 API, DOM 라이브러리 사용 등)
- `[name].native.tsx`: 앱 전용 구현 (네이티브 모듈, 모바일 전용 컴포넌트 사용 등)

### 1-2. 분리 기준 (Decision Matrix)

어떤 상황에서 확장자를 분리해야 하는지는 다음 기준을 따릅니다.

| 우선순위 | 방식 | 채택 기준 (Condition) |
| :--- | :--- | :--- |
| **1순위 (추천)** | **확장자 분리** (`.web` / `.native`) | - 플랫폼별로 사용하는 라이브러리가 다른 경우 (예: `react-modal` vs `@gorhom/bottom-sheet`) <br> - 웹과 앱의 UI 레이아웃/컴포넌트 구조가 근본적으로 다른 경우 <br> - 파일 내 플랫폼 분기 코드(`Platform.OS`)가 3곳 이상 발생하여 가독성을 해치는 경우 |
| **2순위 (사소함)** | **인라인 분기** (`Platform.OS`) | - 10줄 이내의 사소한 비즈니스 로직 차이 <br> - 단순한 스타일 값(색상, 간격 등)의 미세 조정 |

### 1-3. 아키텍처 규칙

- 런타임 분기(`Platform.OS`)보다는 **빌드 타임 분기(파일 확장자)**를 항상 우선합니다.
- 분리된 파일 간에는 반드시 **동일한 인터페이스(Props)**를 유지하여 상위 컴포넌트에서 투명하게 사용할 수 있도록 설계해야 합니다.
