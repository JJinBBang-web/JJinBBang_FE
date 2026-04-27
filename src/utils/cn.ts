export const cn = (...classNames: (string | false | null | undefined)[]) => {
  return classNames.filter(Boolean).join(' ');
};
