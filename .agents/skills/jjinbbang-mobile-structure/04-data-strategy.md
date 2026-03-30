# IV. 데이터 전략 (Data Strategy)

**"데이터의 성격에 따라 관리 도구를 엄격히 분리합니다."**

## 1. 서버 데이터 (Server State) 👉 TanStack Query

- **대상**: 외부 API(Axios/Fetch)에서 가져오는 모든 데이터, 로딩 상태, 에러 상태.
- **규칙**:
    - ❌ API 데이터를 `useEffect`로 호출하여 `Zustand`나 `useState`에 수동으로 복사하지 마세요. (상태 비동기화 위험)
    - ✅ `useQuery`의 결과값(`data`)을 화면에서 직접 사용하거나, `select` 옵션을 통해 가공하여 사용하세요.
    - **Caching**: `staleTime`, `gcTime`을 활용하여 불필요한 네트워크 요청을 줄입니다.

## 2. 클라이언트 상태 (Client State) 👉 Zustand

- **대상**: 앱 내부에서 생성되고 사라지는 UI 전역 상태 (예: 다크모드 설정, 바텀시트 열림 유무, 검색어 필터).
- **규칙**:
    - **Store 분리**: 각 화면의 지역 상태는 `_store/` (로컬)에, 공용 상태는 `src/features/[Name]/store` (기능별) 또는 `shared/store` (전역)로 나누어 **다중 스토어(Multiple Stores) 방식**으로 관리합니다.
    - **Shallow Equality**: `useStore` 호출 시 필요한 상태만 골라서 가져와 불필요한 리렌더링을 방지합니다.

## 3. 영구 저장 상태 (Persisted State) 👉 Zustand Middleware + AsyncStorage

- **대상**: 앱이 꺼져도 유지되어야 하는 데이터 (예: 로그인 토큰, 유저 설정, 오프라인 데이터).
- **규칙**:
    - **Secure Storage**: 민감 정보(비밀번호 등)는 `Expo SecureStore`를 사용하고, 일반적인 설정값은 `AsyncStorage`를 사용합니다.
    - **Persistence**: Zustand의 `persist` 미들웨어를 사용하여 로컬 스토리지와 자동 동기화합니다.
