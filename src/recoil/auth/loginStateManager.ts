// loginStateManager.ts
let externalSetIsLoggedIn: ((value: boolean) => void) | null = null;

export const setLoginStateUpdater = (fn: (value: boolean) => void) => {
  externalSetIsLoggedIn = fn;
};

export const setLoggedIn = (val: boolean) => {
  if (externalSetIsLoggedIn) {
    externalSetIsLoggedIn(val);
  } else {
    console.warn("🚨 setIsLoggedIn 함수가 아직 초기화되지 않았습니다.");
  }
};
