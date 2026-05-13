# IV. 데이터 전략 (Data Strategy)

**"데이터의 성격에 따라 관리 도구를 엄격히 분리합니다."**

## 1. 서버 데이터 (Server State) 👉 TanStack Query

- **대상**: 외부 API(Axios/Fetch)에서 가져오는 모든 데이터, 로딩 상태, 에러 상태.
- **규칙**:
  - ❌ API 데이터를 `useEffect`로 호출하여 `Zustand`나 `useState`에 수동으로 복사하지 마세요. (상태 비동기화 위험)
  - ✅ `useQuery`의 결과값(`data`)을 화면에서 직접 사용하거나, `select` 옵션을 통해 가공하여 사용하세요.
  - **Caching**: `staleTime`, `gcTime`을 활용하여 불필요한 네트워크 요청을 줄입니다.
  - **SEO & Hydration**: 웹 환경에서 검색 엔진 최적화(SEO)가 중요한 화면(예: 상품 상세)은 서버 사이드에서 데이터를 미리 페치한 후 QueryClient에 주입하는 **Hydration 전략**을 사용하거나, `initialData` 옵션을 활용하여 첫 렌더링 시점에 이미 HTML에 데이터가 포함되도록 설계합니다.

### 📡 표준 서빙 패턴 (useQuery)

```tsx
// src/screens/Main/hooks/useStoreList.ts
import { useQuery } from "@tanstack/react-query";
import { StoreAPI } from "@/api/store/StoreAPI";

export const useStoreList = (category: string) => {
  return useQuery({
    queryKey: ["stores", category],
    queryFn: () => StoreAPI.getStoreList({ category }),
    staleTime: 1000 * 60 * 5, // 5분간 신선함 유지
    select: (data) => data.map((item) => ({ ...item, isNew: true })), // 데이터 가공
  });
};
```

---

## 2. 클라이언트 상태 (Client State) 👉 Zustand

- **대상**: 앱 내부에서 생성되고 사라지는 UI 전역 상태 (예: 다크모드 설정, 바텀시트 열림 유무, 검색어 필터).
- **규칙**:
  - **Store 분리**: 각 화면의 지역 상태는 `store/` (로컬)에, 공용 상태는 `src/features/[Name]/store` (기능별) 또는 `shared/store` (전역)로 나누어 관리합니다.
  - **Shallow Equality**: 필요한 상태만 골라서 가져와 불필요한 리렌더링을 방지합니다.

### 🧠 표준 상태 패턴 (Zustand)

```tsx
// src/features/search/store/useSearchStore.ts
import { create } from "zustand";

type SearchState = {
  keyword: string;
  setKeyword: (text: string) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  keyword: "",
  setKeyword: (text) => set({ keyword: text }),
}));

// 사용 측 (Selector 활용)
const keyword = useSearchStore((state) => state.keyword);
```

---

## 3. 영구 저장 상태 (Persisted State) 👉 Zustand Middleware + MMKV

- **대상**: 앱이 꺼져도 유지되어야 하는 데이터 (예: 로그인 토큰, 유저 설정, 오프라인 데이터).
- **규칙**:
  - **Secure Storage**: 민감 정보(비밀번호 등)는 `Expo SecureStore`를 사용하고, 일반 설정값은 성능이 뛰어난 `react-native-mmkv`를 사용합니다.
  - **Persistence**: Zustand의 `persist` 미들웨어를 활용하되, MMKV와 호환되는 커스텀 스토리지를 연결하여 동기화합니다.

### 💾 표준 저장 패턴 (Persist with MMKV)

```tsx
// src/shared/store/storage.ts
import { StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

// src/features/auth/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "@/shared/store/storage";

export const useAuthStore = create()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string) => set({ token }),
    }),
    {
      name: "auth-storage", // 저장소 키 이름
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
```
