/**
 * check-naming.js
 *
 * 프로젝트 전역 폴더명 네이밍 컨벤션을 검사합니다.
 *
 * 검증 항목:
 * 1. app/ 하위 전체 폴더의 camelCase 준수 여부 (Expo 그룹 괄호 포함)
 * 2. src/screens/* 폴더의 PascalCase 준수 여부
 * 3. src/features/*, src/shared/* 폴더의 camelCase 준수 여부
 *
 * 제외 대상:
 * - 숨김 폴더 및 node_modules
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT_DIR, 'app');
const SRC_DIR = path.join(ROOT_DIR, 'src');

/**
 * 폴더명이 지정된 컨벤션에 맞는지 검사합니다.
 * Expo 그룹 폴더 (예: (tabs), (heartList))의 괄호를 제거하고 검사합니다.
 */
function validateName(name, type) {
  const isGroup = name.startsWith('(') && name.endsWith(')');
  const pureName = isGroup ? name.slice(1, -1) : name;

  if (type === 'camel') {
    return /^[a-z][a-zA-Z0-9]*$/.test(pureName);
  }
  if (type === 'pascal') {
    return /^[A-Z][a-zA-Z0-9]*$/.test(pureName);
  }
  return true;
}

/**
 * 지정 디렉토리 바로 아래의 서브폴더들을 검사합니다. (재귀 없음)
 */
function checkSubfolders(dir, type, errors) {
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .forEach(d => {
      const rel = path.relative(ROOT_DIR, path.join(dir, d.name));
      if (!validateName(d.name, type)) {
        errors.push(`❌ [네이밍 위반] '${rel}' → ${type}Case 여야 합니다. (현재: '${d.name}')`);
      }
    });
}

/**
 * app/ 하위를 재귀적으로 순회하며 모든 폴더를 camelCase로 검사합니다.
 */
function checkAppDirRecursively(dir, errors) {
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')
    .forEach(d => {
      const fullPath = path.join(dir, d.name);
      const rel = path.relative(ROOT_DIR, fullPath);

      if (!validateName(d.name, 'camel')) {
        errors.push(`❌ [네이밍 위반] '${rel}' → camelCase 여야 합니다. (현재: '${d.name}')`);
      }

      checkAppDirRecursively(fullPath, errors);
    });
}

function checkNaming() {
  console.log('🔍 폴더명 네이밍 컨벤션 체크 시작...');

  const errors = [];

  // 1. app/ 하위 전체 (재귀): camelCase
  checkAppDirRecursively(APP_DIR, errors);

  // 2. src/screens/*: PascalCase
  checkSubfolders(path.join(SRC_DIR, 'screens'), 'pascal', errors);

  // 3. src/features/*: camelCase
  checkSubfolders(path.join(SRC_DIR, 'features'), 'camel', errors);

  // 4. src/shared/*: camelCase
  checkSubfolders(path.join(SRC_DIR, 'shared'), 'camel', errors);

  if (errors.length === 0) {
    console.log('✅ 모든 폴더명이 네이밍 컨벤션을 준수하고 있습니다.');
  } else {
    console.log(`\n🚨 네이밍 위반 ${errors.length}건 발견 (수정 필수):`);
    errors.forEach(e => console.log(e));
    console.log('\n💡 가이드라인: app/ → camelCase, screens/ → PascalCase, features/ → camelCase');
    process.exit(1);
  }
}

checkNaming();
