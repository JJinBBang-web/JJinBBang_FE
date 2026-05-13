import fs from "node:fs";
import path from "node:path";
import expo from "eslint-config-expo/flat.js";
import checkFile from "eslint-plugin-check-file";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";

const srcFeaturesPath = path.join(import.meta.dirname, "src/features");
let featureDomains = [];
try {
  featureDomains = fs
    .readdirSync(srcFeaturesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
    .map((dirent) => dirent.name);
} catch (e) {}

const crossDomainZones = featureDomains.flatMap((domain) => {
  return featureDomains
    .filter((otherDomain) => otherDomain !== domain)
    .map((otherDomain) => ({
      target: `./src/features/${domain}`,
      from: `./src/features/${otherDomain}`,
      message: `Features 간 횡단 참조가 감지되었습니다. (${otherDomain} -> ${domain})`,
    }));
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...expo,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      // 1. 파일명 네이밍 컨벤션
      "check-file/filename-naming-convention": [
        "error",
        {
          "src/screens/**/*.{tsx}": "PASCAL_CASE",
          "src/features/**/*.{tsx}": "PASCAL_CASE",
          "src/features/**/*.{ts}": "CAMEL_CASE",
          "src/api/**/*API.ts": "PASCAL_CASE",
          "src/api/**/*Type.ts": "PASCAL_CASE",
        },
      ],

      // 1-1. Import 순서 자동 정렬
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            { pattern: "react", group: "builtin", position: "before" },
            { pattern: "react-native", group: "builtin", position: "before" },
            { pattern: "expo-*", group: "external", position: "before" },
            { pattern: "@/**", group: "internal" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // 2. 아키텍처 의존성 방향 강제 (Screens -> Features -> Shared)
      // target = "이 폴더 안의 파일에서", from = "이 경로를 import 하는 것을 금지"
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/shared",
              from: "./src/features",
              message:
                "Shared 영역의 코드는 Features 영역을 참조할 수 없습니다.",
            },
            {
              target: "./src/shared",
              from: "./src/screens",
              message:
                "Shared 영역의 코드는 Screens 영역을 참조할 수 없습니다.",
            },
            {
              target: "./src/features",
              from: "./src/screens",
              message:
                "Features 영역의 코드는 Screens 영역을 참조할 수 없습니다.",
            },
            ...crossDomainZones,
          ],
        },
      ],

      // 순환 참조 방지 (maxDepth로 대규모 프로젝트 성능 보호)
      "import/no-cycle": ["error", { maxDepth: 5 }],
      // 3. Named Export 권장 (Expo Router 제외)
      "import/no-default-export": "error",
      "import/no-named-as-default": "error",

      // 4. 상대 경로 상단 참조 제한 (절대 경로 @/ 사용 권장)
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message:
                "상대 경로 대신 @/ 를 기반으로 한 절대 경로를 사용하세요.",
            },
          ],
        },
      ],

      // 5. 타입 선언 컨벤션 (interface 대신 type alias 사용)
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],

      // 6. 명명 규칙 (naming-convention)
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "has", "can"],
        },
        {
          selector: "variable",
          modifiers: ["const", "global"],
          format: ["UPPER_CASE", "camelCase", "PascalCase"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        {
          selector: "interface",
          format: ["PascalCase"],
        },
      ],

      // 7. 컴포넌트 선언 스타일 및 네이밍
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
        },
      ],
      "react/jsx-handler-names": [
        "error",
        {
          eventHandlerPrefix: "handle",
          eventHandlerPropPrefix: "on",
        },
      ],

    },
  },
  {
    // Expo Router 라우트 및 타입 선언 파일은 export default 허용
    files: ["app/**/*.tsx", "app/**/*.ts", "src/**/*.d.ts"],
    rules: {
      "import/no-default-export": "off",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: ["function-declaration", "arrow-function"],
        },
      ],
    },
  },
  {
    // 8. app/ 라우트 파일 최소 구현 원칙 (_layout.tsx, +not-found.tsx 제외)
    // app/ 라우트 파일은 Screen 컴포넌트를 import하여 렌더링만 수행해야 함.
    // 비즈니스 로직(useState, useQuery 등)이나 API/Features 직접 참조를 금지.
    files: ["app/**/*.tsx", "app/**/*.ts"],
    ignores: ["app/**/_layout.tsx", "app/**/+*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/api/*"],
              message:
                "app/ 라우트에서 API를 직접 호출하지 마세요. Screen 컴포넌트에서 처리하세요.",
            },
            {
              group: ["@/features/*"],
              message:
                "app/ 라우트에서 Features를 직접 참조하지 마세요. Screen 컴포넌트에서 합성하세요.",
            },
            {
              group: ["../*"],
              message:
                "상대 경로 대신 @/ 를 기반으로 한 절대 경로를 사용하세요.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='useState']",
          message:
            "app/ 라우트 파일에서 상태를 관리하지 마세요. Screen 컴포넌트에서 처리하세요.",
        },
        {
          selector: "CallExpression[callee.name='useQuery']",
          message:
            "app/ 라우트 파일에서 데이터를 fetch하지 마세요. Screen 컴포넌트에서 처리하세요.",
        },
        {
          selector: "CallExpression[callee.name='useMutation']",
          message:
            "app/ 라우트 파일에서 mutation을 하지 마세요. Screen 컴포넌트에서 처리하세요.",
        },
      ],
    },
  },
  {
    // API 관련 규칙 (메서드 명명 제약)
    files: ["src/api/**/*API.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "MethodDefinition[key.name!=/^(get|post|put|del|patch)/][kind='method']",
          message:
            "API 클래스의 메서드는 반드시 get, post, put, del, patch로 시작해야 합니다.",
        },
      ],
    },
  },
  {
    files: ["scripts/**/*"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // screens/features 전용: useEffect 금지 + Zustand Selector 강제 + StyleSheet 제한
    // flat config에서는 마지막 매칭 블록이 이전 것을 덮어쓰므로,
    // 이 영역에 적용할 모든 no-restricted-syntax 규칙을 한 곳에 통합해야 함.
    files: ["src/screens/**/*.{ts,tsx}", "src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='useEffect']",
          message:
            "useEffect 내부에서의 직접적인 상태 가공 및 API 호출은 금지되어 있습니다.",
        },
        {
          selector:
            "CallExpression[callee.name=/^use.*Store$/][arguments.length=0]",
          message:
            "Zustand store는 selector를 사용하세요: useXxxStore((s) => s.xxx). 전체 구독은 불필요한 리렌더링을 유발합니다.",
        },
        {
          selector: "CallExpression[callee.object.name='StyleSheet'][callee.property.name='create']",
          message:
            "NativeWind 사용을 우선하세요. 애니메이션, 동적 계산 등 불가피한 경우에만 // eslint-disable-next-line 을 추가하세요.",
        },
      ],
    },
  },
  {
    // src 나머지 영역 (api, shared, constants 등): Zustand Selector 강제 + StyleSheet 제한
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/screens/**", "src/features/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.name=/^use.*Store$/][arguments.length=0]",
          message:
            "Zustand store는 selector를 사용하세요: useXxxStore((s) => s.xxx). 전체 구독은 불필요한 리렌더링을 유발합니다.",
        },
        {
          selector: "CallExpression[callee.object.name='StyleSheet'][callee.property.name='create']",
          message:
            "NativeWind 사용을 우선하세요. 애니메이션, 동적 계산 등 불가피한 경우에만 // eslint-disable-next-line 을 추가하세요.",
        },
      ],
    },
  },
];

