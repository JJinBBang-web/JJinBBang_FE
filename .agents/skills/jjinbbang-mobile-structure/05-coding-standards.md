# V. 코딩 컨벤션 (Coding Standards)

**"일관성 있는 작명과 모바일 최적화 스타일링을 지향합니다."**

## 1. 작명 규칙 (Naming Conventions)

| 종류            | 규칙           | 예시                                                     |
| :-------------- | :------------- | :------------------------------------------------------- |
| **폴더**        | **kebab-case** | `src/features/auth-user`, `src/shared/ui-components`     |
| **파일**        | **kebab-case** | `home-screen.tsx`, `auth-api.ts`, `use-auth.ts`          |
| **컴포넌트 명** | **PascalCase** | `HomeScreen`, `PrimaryButton` (코드 작성 시)             |
| **타입/인터페이스** | **PascalCase** | `UserType`, `AuthResponse` (Type Alias만 사용)            |

## 2. 스타일링 가이드 (NativeWind)

**"Native CSS는 지양하고, 99.9% NativeWind(Tailwind)로 해결합니다."**

1.  **유틸리티 우선**: 모든 레이아웃과 디자인은 `className`에 테일윈드 클래스를 작성하여 처리합니다.
2.  **디자인 토큰**: 반복되는 컬러(`#FF5733`)나 간격은 `tailwind.config.js`의 `theme.extend`에 등록하여 브랜드 컬러(`text-brand`)로 사용합니다.
3.  **반응형 (Screen Size)**: 앱은 화면 크기가 다양하므로 특정 픽셀 하드코딩보다 `flex`, `percentage`, 또는 NativeWind의 `sm`, `md` 브레이크포인트를 활용합니다.
4.  **다크 모드**: `dark:` 프리픽스를 적극 활용하여 별도의 로직 없이 다크모드를 대응합니다.

## 3. 코드 작성 원칙

- **Absolute Imports**: `../../..` 대신 `@/` 또는 `src/` 기반 절대 경로만 허용합니다.
- **Export Style**: 정의와 동시에 `export` 키워드를 사용합니다. `export default`는 가급적 지양합니다. (명시적 이름 사용 목적)
- **Type Definitions**: `interface` 대신 **`type` alias**를 사용합니다. (확장성 및 일관성)
