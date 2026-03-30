# II. 기술 스택 (Foundation)

**"Web + Native 동시 지원을 위한 최신 Expo 스택을 사용합니다."**

이 도구들 외의 다른 라이브러리 사용을 금합니다.

| 분류             | 기술                       | 설명                                                             |
| :--------------- | :------------------------- | :--------------------------------------------------------------- |
| **Framework**    | **Expo (React Native)**    | Managed Workflow 및 **Expo Router** 중심 배포.                   |
| **Language**     | **TypeScript**             | Strict Mode 준수. `any` 사용 제한.                               |
| **Styling**      | **NativeWind (v4+)**       | **Tailwind CSS for Native**. 웹/앱 통합 스타일링 지원.           |
| **Client State** | **Zustand**                | 경량 상태 관리. 보일러플레이트 최소화.                           |
| **Server State** | **TanStack Query (v5)**    | 서버 데이터 동기화 및 캐싱. **`useEffect`로 API 호출 금지.**     |
| **Navigation**   | **Expo Router**            | **File-based Routing**. 웹/앱 통합 URL 및 라우팅 지원.           |

## 🛠️ 핵심 도구 선정 이유

1.  **Expo Router**: 앱에서도 웹처럼 URL 구조를 가질 수 있어, 웹 배포 시 SEO와 딥링킹 처리가 매우 강력해짐.
2.  **Zustand**: Recoil보다 설정이 간편하고, React Native 환경에서 성능 및 디버깅(`Redux DevTools` 연동)이 우수함.
3.  **NativeWind**: 웹의 `Tailwind` 문법을 앱에서도 99% 동일하게 사용하여 디자인 시스템 생산성을 극대화함.
