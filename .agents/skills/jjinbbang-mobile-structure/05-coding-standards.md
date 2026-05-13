# V. 코딩 컨벤션 (Coding Standards)

**"일관성 있는 작명과 모바일 최적화 스타일링을 지향합니다."**

## 1. 명명 규칙 (Naming Conventions)

### 1-1. 식별자 종류별 규칙

| 종류 | 규칙 | 예시 |
| :--- | :--- | :--- |
| **상수** | `UPPER_SNAKE_CASE` | `const MAX_RETRY_COUNT = 3;` |
| **변수 / 함수 / 훅** | `camelCase` | `const userName`, `const fetchData` |
| **컴포넌트** | `PascalCase` | `const ProfileCard = () => {}` |
| **타입 / 인터페이스** | `PascalCase` | `type UserType`, `type ButtonProps` |
| **도메인 API 클래스** | `PascalCase` | `class ContentAPI {}` |

### 1-2. 변수 / 함수 네이밍 세부 규칙

```tsx
// 배열: 복수형 이름
const users = [];

// 이벤트 핸들러 Props: 'on'으로 시작
<MyComponent onClick={handleClick} />

// 이벤트 핸들러 내부 함수: 'handle'로 시작
const handleClick = () => {};
const handleChange = () => {};

// 반환값이 불린: 'is'로 시작 (상황에 따라 has, can 사용 가능)
const isLoading = false;
const hasPermission = true;

// API 호출 함수: HTTP method(get, post, put, del)로 시작
const getStoreList = () => {};
const postReview = () => {};
```

### 1-3. 파일 / 폴더 네이밍

| 종류 | 규칙 | 예시 |
| :--- | :--- | :--- |
| **컴포넌트 파일** | `PascalCase` | `StoreCard.tsx`, `TabBarIcon.tsx` |
| **훅 / 유틸 / 스토어 파일** | `camelCase` | `useStoreList.ts`, `dateUtils.ts` |
| **API 파일** | `PascalCase` | `StoreAPI.ts`, `AuthType.ts` |
| **폴더 (라우팅 그룹 포함)** | `camelCase` | `components/`, `(heartList)/` |
| **화면 폴더 (`src/screens/`)** | `PascalCase` | `Main/`, `HeartList/` |

### 1-4. 커스텀 훅

훅 이름은 반드시 `use` + 함수명 형태로 명명합니다.

```tsx
const useFetchStoreList = () => { ... };
const useAuthSession = () => { ... };
```

---

## 2. 선언 방식 (Declaration Style)

### 2-1. 컴포넌트

컴포넌트는 **화살표 함수**로 선언하고, 정의와 동시에 `export`를 붙입니다.

```tsx
export const StoreCard = () => {
  return <View>...</View>;
};
```

> **Export 원칙**:
> - Named export(`export const`)를 기본으로 사용합니다. (명시적 이름 추적 목적)
> - **예외**: `app/` 디렉토리 내 **Expo Router 라우트 파일**은 프레임워크 요구사항이므로 `export default`를 사용합니다.

### 2-2. Props

- 컴포넌트의 Props는 **`type`** 으로 선언하고, **`컴포넌트명 + Props`** 로 명명합니다.
- Props는 컴포넌트 내부에서 **구조 분해 할당**으로 사용합니다. (컴포넌트 선언부 가독성 및 일관성 유지)

```tsx
export type StoreCardProps = {
  storeId: number;
  name: string;
  isLiked?: boolean;
};

export const StoreCard = (props: StoreCardProps) => {
  const { storeId, name, isLiked = false } = props;
  /* ... */
};
```

### 2-3. 도메인 API 클래스

- API 클래스명은 **PascalCase** (`[Domain]API`)
- 내부 함수명은 **HTTP method (get, post, put, del)** 로 시작

```tsx
export class StoreAPI {
  static async getStoreList(options?: {
    cursor?: number | null;
    size?: number;
  }): Promise<StoreListResponse> {
    try {
      // ...
    } catch (error) {
      // ...
    }
  }

  static async postReview(body: ReviewBody): Promise<void> {
    // ...
  }
}
```

---

## 3. 스타일링 가이드 (NativeWind)

**"기본적으로 NativeWind(Tailwind)를 사용하며, 기술적 한계가 있는 경우에만 StyleSheet를 보조적으로 사용합니다."**

1. **유틸리티 우선**: 모든 레이아웃과 디자인은 `className`에 Tailwind 클래스를 작성하여 처리합니다.
2. **디자인 토큰**: 반복되는 컬러나 간격은 `tailwind.config.js`의 `theme.extend`에 등록하여 브랜드 토큰(`text-brand`)으로 사용합니다.
3. **상수 참조 (SSOT)**: NativeWind가 처리할 수 없는 영역(JSON, JS Logic, Animation Value 등)에서 색상이나 폰트 설정이 필요할 경우, 하드코딩하지 말고 반드시 `constants/colors.ts` 또는 `constants/fonts.ts`에 정의된 상수를 `import`하여 사용합니다.
4. **반응형**: 특정 픽셀 하드코딩 대신 `flex`, `percentage`, 또는 NativeWind 브레이크포인트를 활용합니다.
5. **다크 모드**: `dark:` 프리픽스를 적극 활용하여 별도 로직 없이 다크모드를 대응합니다.
6. **StyleSheet 사용 예외 (Allowed Exceptions)**:
    - **애니메이션**: `react-native-reanimated`의 `useAnimatedStyle` 등 복잡한 애니메이션 로직이 포함된 경우.
    - **동적 계산 스타일**: 런타임에 Props나 상태에 따라 복잡한 수치 연산(예: 드래그 위치 계산)이 필요한 경우.
    - **플랫폼 특화 그림자**: NativeWind만으로 구현하기 어려운 정교한 iOS `shadow*` 또는 Android `elevation` 설정이 필요한 경우.
    - **서드파티 라이브러리**: `react-native-maps` 등 NativeWind의 `className`을 직접 지원하지 않는 외부 컴포넌트의 스타일링 속성.

---

## 4. 코드 작성 원칙

- **Absolute Imports**: `../../..` 대신 `@/` 기반 절대 경로만 허용합니다.
- **Type Definitions**:
  - Props와 그 외 공용 타입 모두 **`type alias`**를 사용합니다. (일관성 유지)
  - **선언 위치(Colocation)**: 타입이나 인터페이스는 **그것을 주로 사용하는 파일(또는 같은 폴더)** 에 가깝게 위치시킵니다. (예: 특정 화면에서 사용하는 파라미터 타입은 해당 화면(`screens/[Name]`) 컴포넌트 파일 바로 위나 같은 폴더의 `types.ts`로 생성)
  - `src/types/` 폴더는 모듈 선언(`*.d.ts`) 용도로만 사용합니다.
