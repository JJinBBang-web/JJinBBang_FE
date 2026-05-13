# II. 기술 스택 (Foundation)

**"Web + Native 동시 지원을 위한 최신 Expo 스택을 기반으로 합니다."**

## 1. 핵심 기술 스택 (Core Stack)

이 도구들은 프로젝트의 근간이 되는 핵심 환경입니다.

| 분류 | 기술 | 설명 |
| :--- | :--- | :--- |
| **Framework** | **Expo (React Native)** | v55 Managed Workflow 및 **Expo Router** 중심. |
| **Language** | **TypeScript** | Strict Mode 준수. `any` 사용 제한. |
| **Styling** | **NativeWind (v4)** | Tailwind CSS for Native. 웹/앱 통합 스타일링. |
| **Client State** | **Zustand** | v5+ 경량 상태 관리. 보일러플레이트 최소화. |
| **Server State** | **TanStack Query (v5)** | 서버 데이터 동기화 및 캐싱. **`useEffect` 호출 금지.** |
| **Navigation** | **Expo Router** | File-based Routing. 웹/앱 통합 URL 및 라우팅. |

## 2. 라이브러리 추가 프로토콜 (Library Addition Protocol)

- **원칙**: 프로젝트의 복잡도를 관리하기 위해 새로운 라이브러리 도입은 신중하게 결정합니다.
- **절차**: 새로운 라이브러리를 설치(`npm/yarn install`)해야 할 경우, 반드시 사용자에게 **[도구 명칭], [도입 목적], [필요성]**을 공지하고 확인(Approved)받은 후 진행합니다.
- **사전 승인 목록**: 아래 라이브러리들은 프로젝트에서 범용적으로 사용됨을 미리 승인하며, 별도 공지 없이 도입 가능합니다.
    - **통신**: `Axios`
    - **폼/검증**: `React Hook Form`, `Zod`
    - **애니메이션/UI**: `React Native Reanimated`, `Moti`, `react-native-svg` (외부 아이콘 라이브러리 사용 배제)
    - **유틸리티**: `date-fns`, `lodash-es`, `clsx`, `tailwind-merge`

## 3. 핵심 도구 선정 이유

1.  **Expo Router**: 앱에서도 웹처럼 URL 구조를 가질 수 있어, 웹 배포 시 SEO와 딥링킹 처리가 매우 강력해짐.
2.  **Zustand**: Recoil보다 설정이 간편하고, React Native 환경에서 성능 및 디버깅(`Redux DevTools` 연동)이 우수함.
3.  **NativeWind**: 웹의 `Tailwind` 문법을 앱에서도 99% 동일하게 사용하여 디자인 시스템 생산성을 극대화함.
