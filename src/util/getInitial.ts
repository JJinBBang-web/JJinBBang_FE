export function getInitial(char: string): string {
  const code = char.charCodeAt(0) - 44032;
  const initialIndex = Math.floor(code / 588);
  const initials = [
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ",
    "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ",
    "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
  ];
  return initials[initialIndex] || "";
}