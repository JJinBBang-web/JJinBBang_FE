## 1. 폴더 구조 (Project Structure)

애플리케이션은 **"인앱 코로케이션(In-App Colocation)"** 아키텍처를 따릅니다. 화면과 관련된 모든 파일(컴포넌트, 훅, 상태)은 `app/` 폴더 내의 해당 경로 폴더에 함께 위치합니다.

```text
app/                            # 🗺️ 내비게이션 & 구현 통합 (Navigation & Implementation)
├── (auth)/                     # [A] 인증 그룹
│   ├── login/                  # 로그인 화면 폴더 (주소: /login)
│   │   ├── index.tsx           
│   │   ├── _components/        
│   │   ├── _hooks/             
│   │   └── _store/             # Zustand 상태 보관
│   └── signup/
├── (main)/                     # [B] 메인 서비스 그룹
│   ├── (tabs)/                 
│   │   ├── (home)/             # 🏠 홈 화면 그룹 (괄호 덕분에 주소는 /)
│   │   │   ├── index.tsx       
│   │   │   ├── _styles.ts      # - 스타일 정의 파일 (NativeWind/StyleSheet)
│   │   │   ├── _components/    
│   │   │   ├── _hooks/             
│   │   │   └── _store/         # 홈 전용 Zustand Store    
│   │   ├── profile/            # 👤 프로필 화면 폴더 (주소: /profile)
│   │   │   ├── index.tsx       
│   │   │   └── _components/    
│   │   └── _layout.tsx         
│   └── detail/                 
│        └── [id].tsx            
└── _layout.tsx                 # 최상위 루트 레이아웃

src/
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
├── assets/                     # 🎨 정적 자원 (Static Assets)
│   ├── fonts/                  # - 폰트 파일
│   ├── images/                 # - 이미지 리소스 분류
│   │   ├── shared/             # - 공용 이미지
│   │   ├── home/               # - 홈 화면 전용
│   │   └── map/                # - 지도 화면 전용
│   └── icons/                  # - SVG 아이콘
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
├── shared/                     # 🛠️ 공용 도구 (UI, Utils, Hooks)
└── App.tsx                     # 시스템 부트스트랩 (Provider 설정)
```

## 2. 레이어별 역할 및 규칙

### 1. 라우팅 제외 규칙 (Underscore Prefix)
- `app/` 폴더 내에서 파일이나 폴더 이름 앞에 **언더바(`_`)**를 붙이면 Expo Router가 이를 주소(URL)로 인식하지 않습니다.
- 모든 화면 전용 로직(`_components`, `_hooks`, `_store`)은 반드시 언더바를 붙여 관리합니다.

### 2. API 통신 수칙 (api/*)
- **명명법**: `[Domain]API.ts` (구현), `[Domain]Type.ts` (타입) 형식으로 분리하여 관리합니다.
- **타입 정의**: `interface` 대신 **`type`** 키워드를 사용하여 모든 Request/Response 타입을 정의합니다. (일관성 유지)
- **중앙 관리**: `api.ts`에서 공통 인증 토큰 처리나 에러 인터셉터를 관리하며, `baseAPI`를 통해 공통된 호출 로직(Base Response 처리 등)을 추상화합니다.

### 3. 정적 자원 관리 (assets/*)
- **이미지**: 용도가 겹치는 디자인 자산은 `shared/`에 두며, 특정 화면에만 종속적인 자원은 각 화면 이름의 폴더로 격리하여 관리합니다.
- **아이콘**: SVG 파일은 `icons/` 폴더에 모아 컴포넌트화하여 사용합니다.

### 4. 공유 도메인 로직 (features/*)
- 특정 화면에 종속되지 않고 여러 페이지에서 공용으로 사용되는 복잡한 비즈니스 로직, 상태 관리, 공용 UI 컴포넌트를 위치시킵니다.
- **구조 통일**: 화면(`app/`) 내부 구조와 동일하게 `components/`, `hooks/`, `store/` 폴더를 사용하여 코드 탐색의 일관성을 유지합니다.

## 3. 멀티플랫폼 지원 전략 (Web + Native)

웹과 앱에서 코드가 다르게 동작해야 할 경우 **파일 확장자**를 활용합니다.
- **규칙**: `[name].tsx` (공용), `[name].web.tsx` (웹), `[name].native.tsx` (앱).
- 런타임 분기(`Platform.OS`)보다 빌드 타임 분기(파일 확장자)를 우선합니다.
