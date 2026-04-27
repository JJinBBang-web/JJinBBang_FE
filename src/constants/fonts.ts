export const fonts = {
  pretendard: 'PretendardVariable',

  size: {
    xxs: 10,
    xs: 11,
    sm: 12,
    md: 13,
    lg: 14,
    xl: 15,
    xxl: 16,
    xxxl: 18,
  },
  weight: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    heavy: '800',
    black: '900',
  },
  lineHeight: {
    normal140: '140%',
    normal160: '160%',
    body13: 20,
  },
  textStyles: {
    title: {
      t18SemiBold: { fontSize: 18, fontWeight: '600', lineHeight: '140%', letterSpacing: -0.2 },
      t16Bold: { fontSize: 16, fontWeight: '700', lineHeight: '140%',  },
      t16SemiBold: { fontSize: 16, fontWeight: '600', lineHeight: '160%', letterSpacing: -0.2 },
      t16Medium: { fontSize: 16, fontWeight: '500', lineHeight: '140%', letterSpacing: -0.4},
      t15Medium: { fontSize: 15, fontWeight: '500', lineHeight: '160%', letterSpacing: -0.2},
    },
    body: {
      b13Medium: { fontSize: 13, fontWeight: '500', lineHeight: '140%', letterSpacing: -0.2},
      b13Regular: { fontSize: 13, fontWeight: '400', lineHeight: 20, letterSpacing: -0.2},
      b14Medium: { fontSize: 14, fontWeight: '500', lineHeight: '160%', letterSpacing: -0.4},
      b14Regular: { fontSize: 14, fontWeight: '400', lineHeight: '140%', letterSpacing: -0.4},
      b14SemiBold: { fontSize: 14, fontWeight: '600', lineHeight: '160%', letterSpacing: -0.2},
      b12Medium: { fontSize: 12, fontWeight: '500', lineHeight: '140%' },
      b11SemiBold: { fontSize: 11, fontWeight: '600', lineHeight: '140%', letterSpacing: -0.2},
    },
    caption: {
      c10Regular: { fontSize: 10, fontWeight: '400', lineHeight: '140%', letterSpacing: -0.4},
    },
  },
} as const;