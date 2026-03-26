# 찐빵(JJinBBang) v2.0.0 프론트엔드 스타일 가이드 & 컨벤션

> **적용 범위**: `expo-router` 기반 React Native / TypeScript 코드
> Gemini Code Assist가 생성/수정하는 코드에 그대로 반영한다.

---

## 1. 네이밍 규칙 (Naming Conventions)

### 1.1 상수
- 영문 대문자 + 스네이크 표기법 사용

```tsx
const NAME_ROLE = "Admin";
const MAX_RETRY_COUNT = 3;
```

### 1.2 변수 / 함수 / 훅
- **camelCase** 사용

| 유형 | 규칙 | 예시 |
|------|------|------|
| 배열 | 영어 복수형 사용 | `users`, `posts`, `engineList` |
| 이벤트 핸들러 (Props) | `on`으로 시작 | `onClick`, `onChange` |
| 이벤트 핸들러 (내부 함수) | `handle`로 시작 | `handleClick`, `handleSubmit` |
| 불린 반환값 | `is` / `has` / `can`으로 시작 | `isLoading`, `hasError`, `canSubmit` |
| Fetch 함수 | HTTP 메서드로 시작 | `getEngineList`, `postReport`, `deleteUser` |

```tsx
// ✅ 올바른 예시
const users = [];
const isLoading = false;
const getEngineList = () => {};
const handleClick = () => {};

// ❌ 잘못된 예시
const datas = [];         // data는 이미 복수형, datas는 비문법적
const loading = false;    // 불린임이 불명확
```

### 1.3 컴포넌트
- **PascalCase** 사용

```tsx
const CustomButton = () => {
  return <View>...</View>;
};
```

### 1.4 파일 네이밍
- 일반 파일: `camelCase`
- 컴포넌트 파일 (컴포넌트 정의가 포함된 경우): `PascalCase`
- Tailwind `className`: camelCase로 의미가 명확하도록 네이밍

---

## 2. 타입 vs 인터페이스 (Type vs Interface)

- **`interface`**: 컴포넌트 Props, 클래스 구조처럼 확장 가능성이 있는 객체 타입
- **`type`**: 유니온 타입, 원시값 조합, 유틸리티 타입 등 확장이 필요 없는 타입

```tsx
// ✅ Props → interface 사용
export interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

// ✅ 유니온 타입 → type 사용
type Size = 'sm' | 'md' | 'lg';
type Status = 'idle' | 'loading' | 'error' | 'success';
```

---

## 3. 컴포넌트 선언 방식

- 컴포넌트는 **화살표 함수**로 선언한다.
- Props는 `interface`로 선언하며, 이름은 `컴포넌트명 + Props`로 한다.
- 컴포넌트 내부에서 **구조 분해 할당**으로 props를 사용한다.

### 3.1 export 방식

| 유형 | 방식 | 이유 |
|------|------|------|
| **페이지 파일** (`app/` 하위) | `export default` | expo-router가 default export를 기준으로 페이지 인식 |
| **일반 컴포넌트** | `export const` (named export) | import 시 이름 일관성 유지, 자동완성 개선 |

```tsx
// ✅ 페이지 파일 (app/home.tsx) - expo-router 요구사항
const HomePage = () => {
  return <View>...</View>;
};

export default HomePage;

// ✅ 일반 컴포넌트 (components/CustomButton.tsx) - named export
export interface CustomButtonProps {
  label: string;
  onPress: () => void;
}

export const CustomButton = (props: CustomButtonProps) => {
  const { label, onPress } = props;

  return <View>...</View>;
};

// ❌ 컴포넌트에 default export 사용 (import 시 이름 불일치 위험)
export default CustomButton;
```

---

## 4. 커스텀 훅 규칙

- 훅 이름은 `use + 기능명` 으로 명명한다.
- 훅은 **도메인 API 함수만** 호출한다. 네트워크 로직을 직접 작성하지 않는다.

```tsx
// ✅ 올바른 예시
const useFetchData = () => { /* ContentAPI.getReportList() 호출 */ };
const useAuthStore = () => { /* Zustand store 접근 */ };

// ❌ 잘못된 예시
const fetchData = () => {};   // use 접두사 누락
```

---

## 5. 상태 관리 - Zustand

> ⚠️ 네이밍 및 파일 구조 규칙은 추후 확정 예정 (TBD)

- Store는 도메인 단위로 분리한다.
- Store 내부 상태와 액션은 같은 파일에 정의한다.
- 컴포넌트에서 store 전체를 구독하지 않고, 필요한 상태/액션만 선택적으로 구독한다.

```tsx
// ✅ 필요한 값만 구독
const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

// ❌ store 전체 구독 (불필요한 리렌더링 유발)
const store = useAuthStore();
```

---

## 6. 스타일링 - Tailwind CSS

- 클래스 순서는 아래 순서를 따른다: `레이아웃 → 크기 → 간격 → 색상 → 타이포 → 기타`
- 조건부 클래스 조합은 `cn()` 유틸 함수를 사용한다. (문자열 직접 조합 금지)
- 반복되는 클래스 조합은 컴포넌트로 추출한다.

```tsx
// ✅ cn() 유틸 사용
import { cn } from '@/utils/cn';

const Button = ({ disabled }: ButtonProps) => (
  <TouchableOpacity
    className={cn(
      'flex-row items-center px-4 py-2 rounded-lg bg-primary',
      disabled && 'opacity-50 bg-gray-300'
    )}
  />
);

// ❌ 문자열 직접 조합
className={`flex-row items-center ${disabled ? 'opacity-50' : ''}`}
```

---

## 7. 도메인 API 규칙

- 도메인 API 클래스명은 **PascalCase** + `API` 접미사
- 클래스 내부 메서드명은 `get | post | put | del`로 시작

```tsx
export class ContentAPI {
  static async getReportList(
    category: ReportCategory,
    options?: { cursor?: number | null; size?: number }
  ): Promise<ReportListResponse> {
    try {
      return await getAPI('/reports', { category, ...options });
    } catch (error) {
      throw error;
    }
  }
}
```

> **주의**: 도메인 API에서는 `api.ts` 직접 사용 금지. 반드시 `baseAPI`(`getAPI`, `postAPI`, `deleteAPI`)를 사용한다.

---

## 8. 호출 계층 규칙 (Layered Architecture)

백엔드의 Controller → Service → Repository 계층과 동일한 방향성을 따른다.

```
Page / Component  →  Custom Hook  →  Domain API  →  baseAPI
```

| 계층 | 역할 | 규칙 |
|------|------|------|
| **Page / Component** | UI 렌더링 | Hook만 호출. API 직접 호출 금지 |
| **Custom Hook** | 비즈니스 로직, 상태 관리 | 도메인 API 함수만 호출 |
| **Domain API** | 네트워크 요청 정의 | `baseAPI`만 사용. `api.ts` 직접 사용 금지 |
| **baseAPI** | HTTP 기반 함수 | 공통 요청 처리 |

---

## 9. 에러 처리 규칙

- API 에러는 **도메인 API 계층**에서 catch하고, 필요 시 커스텀 에러로 변환해서 던진다.
- Hook에서는 에러 상태를 관리하고 컴포넌트에 전달한다.
- 컴포넌트/페이지에서 직접 try-catch로 API를 감싸지 않는다.
- 사용자에게 노출되는 에러 메시지는 반드시 한국어로 작성한다.

```tsx
// ✅ Domain API - 에러 변환
export class ContentAPI {
  static async getReportList(): Promise<ReportListResponse> {
    try {
      return await getAPI('/reports');
    } catch (error) {
      throw new ContentAPIError('리포트 목록을 불러오지 못했습니다.');
    }
  }
}

// ✅ Hook - 에러 상태 관리
const useFetchReports = () => {
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const data = await ContentAPI.getReportList();
      // ...
    } catch (e) {
      setError(e instanceof ContentAPIError ? e.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  return { error, fetchReports };
};

// ❌ 컴포넌트에서 직접 API 호출 + try-catch
const MyComponent = () => {
  const handleLoad = async () => {
    try {
      await ContentAPI.getReportList(); // 금지
    } catch (e) {}
  };
};
```

---

## 10. 보안 (Security)

- **절대 금지**: API 키, 시크릿, 인증 토큰, 개인정보(PII)를 코드에 하드코딩하지 않는다.
- 모든 민감한 값은 환경변수(`.env`)로 관리하고, `EXPO_PUBLIC_` 접두사 규칙을 따른다.
- `.env` 파일은 절대 Git에 커밋하지 않는다. (`.gitignore`에 반드시 포함)
- 클라이언트 번들에 포함되는 `EXPO_PUBLIC_` 변수에는 시크릿 값을 넣지 않는다. 서버에서만 필요한 키는 백엔드에서 관리한다.

```tsx
// ✅ 환경변수 사용
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// ❌ 하드코딩 금지
const BASE_URL = "https://api.jjinbbang.com";
const API_KEY = "sk-1234abcd";
```

---

## 11. 체크리스트 (Gemini Code Assist용)

코드 생성/수정 시 아래 항목을 반드시 확인한다.

- [ ] 변수/함수/훅: `camelCase` / 상수: `UPPER_SNAKE_CASE` / 컴포넌트: `PascalCase`
- [ ] 배열 변수명은 영어 복수형 (`users`, `posts` 등)
- [ ] 컴포넌트는 화살표 함수로 선언
- [ ] 페이지(`app/` 하위)는 `default export`, 일반 컴포넌트는 `named export`
- [ ] Props는 `interface`, 이름은 `컴포넌트명 + Props`
- [ ] 확장 불필요한 타입은 `type` 사용
- [ ] 커스텀 훅은 `use + 기능명` 규칙
- [ ] 도메인 API는 `baseAPI`를 통해 요청 (`api.ts` 직접 사용 금지)
- [ ] Hook은 API 함수만 호출, 컴포넌트/페이지는 Hook만 호출
- [ ] 조건부 클래스는 `cn()` 유틸 사용
- [ ] 에러 처리는 도메인 API 계층에서 수행, 컴포넌트에서 직접 try-catch 금지
- [ ] API 키, 토큰, 개인정보는 코드에 하드코딩 금지 — 환경변수(`.env`)로 관리
- [ ] `.env` 파일은 `.gitignore`에 포함 확인