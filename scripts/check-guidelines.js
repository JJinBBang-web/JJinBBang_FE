/**
 * check-guidelines.js
 *
 * 프로젝트의 핵심 아키텍처 및 폴더 구조 규칙을 검증합니다.
 *
 * 검증 항목:
 * 1. src/screens 폴더명 PascalCase 및 [Name]Screen.tsx 존재 여부
 * 2. src/screens 및 src/features 하위의 단일 계층 구조(허용된 폴더명) 준수 여부
 * 3. src/api 파일명 규칙 (*API.ts, *Type.ts) 준수 여부
 *
 * 제외 대상:
 * - API 공용 설정 파일 (api.ts, baseAPI.ts 등)
 */
const fs = require('fs');
const path = require('path');

const SRC_PATH = path.join(__dirname, '../src');
const SCREENS_PATH = path.join(SRC_PATH, 'screens');
const FEATURES_PATH = path.join(SRC_PATH, 'features');
const API_PATH = path.join(SRC_PATH, 'api');

let hasError = false;

function logError(message) {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`);
  hasError = true;
}

function logSuccess(message) {
  console.log(`\x1b[32m[SUCCESS]\x1b[0m ${message}`);
}

// 1. src/screens 구조 검사
function checkScreens() {
  if (!fs.existsSync(SCREENS_PATH)) return;

  const domains = fs.readdirSync(SCREENS_PATH).filter(f => fs.statSync(path.join(SCREENS_PATH, f)).isDirectory());

  domains.forEach(domain => {
    const domainPath = path.join(SCREENS_PATH, domain);
    
    // (1) PascalCase 폴더명 체크 (간이)
    if (!/^[A-Z]/.test(domain)) {
      logError(`Screen 폴더명은 PascalCase여야 합니다: src/screens/${domain}`);
    }

    // (2) [Name]Screen.tsx 존재 여부
    const screenFileName = `${domain}Screen.tsx`;
    if (!fs.existsSync(path.join(domainPath, screenFileName))) {
      logError(`화면 구현 파일이 누락되었습니다: src/screens/${domain}/${screenFileName}`);
    }

    // (3) 단일 계층 구조 체크 (하위 폴더에 또 다른 도메인 폴더가 있는지)
    const subDirs = fs.readdirSync(domainPath).filter(f => fs.statSync(path.join(domainPath, f)).isDirectory());
    const allowedSubDirs = ['components', 'hooks', 'store', 'types'];
    
    subDirs.forEach(sub => {
      if (!allowedSubDirs.includes(sub)) {
        logError(`허용되지 않은 폴더 구조입니다: src/screens/${domain}/${sub} (허용: ${allowedSubDirs.join(', ')})`);
      }
    });
  });
}

// 2. src/features 구조 검사
function checkFeatures() {
  if (!fs.existsSync(FEATURES_PATH)) return;

  const features = fs.readdirSync(FEATURES_PATH).filter(f => fs.statSync(path.join(FEATURES_PATH, f)).isDirectory());

  features.forEach(feature => {
    const featurePath = path.join(FEATURES_PATH, feature);
    const subDirs = fs.readdirSync(featurePath).filter(f => fs.statSync(path.join(featurePath, f)).isDirectory());
    const allowedSubDirs = ['components', 'hooks', 'store', 'types', 'services', 'utils'];

    subDirs.forEach(sub => {
      if (!allowedSubDirs.includes(sub)) {
        logError(`허용되지 않은 폴더 구조입니다: src/features/${feature}/${sub} (허용: ${allowedSubDirs.join(', ')})`);
      }
    });
  });
}

// 3. src/api 파일명 검사
function checkAPI() {
  if (!fs.existsSync(API_PATH)) return;

  const files = fs.readdirSync(API_PATH);
  const allowedFiles = ['api.ts', 'baseAPI.ts', 'baseType.ts', 'index.ts'];

  files.forEach(file => {
    const filePath = path.join(API_PATH, file);
    if (fs.statSync(filePath).isDirectory()) {
        // API 하위 폴더(도메인별) 허용, 단 내부 파일 규칙은 동일해야 함
        const subFiles = fs.readdirSync(filePath);
        subFiles.forEach(subFile => {
            if (!subFile.endsWith('API.ts') && !subFile.endsWith('Type.ts')) {
                logError(`API 파일명 규칙 위반: src/api/${file}/${subFile} (*API.ts 또는 *Type.ts여야 함)`);
            }
        });
        return;
    }

    if (allowedFiles.includes(file)) return;

    if (!file.endsWith('API.ts') && !file.endsWith('Type.ts')) {
      logError(`API 파일명 규칙 위반: src/api/${file} (*API.ts 또는 *Type.ts여야 함)`);
    }
  });
}

console.log('--- 찐빵 프로젝트 가이드라인 검증 시작 ---');
checkScreens();
checkFeatures();
checkAPI();

if (hasError) {
  console.log('\n\x1b[31m검증 실패: 가이드라인 위반 사항을 수정하세요.\x1b[0m');
  process.exit(1);
} else {
  logSuccess('모든 가이드라인 검증을 통과했습니다!');
  process.exit(0);
}
