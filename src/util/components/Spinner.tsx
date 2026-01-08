import React from 'react';
import { ClipLoader, BeatLoader } from 'react-spinners';

type Props = {
  size?: number;
  inline?: boolean;      // true면 텍스트 줄처럼 사용, false면 오버레이 중앙정렬
  variant?: 'clip' | 'beat';
};

export default function Spinner({ size = 36, inline = false, variant = 'clip' }: Props) {
  const Loader = variant === 'beat' ? BeatLoader : ClipLoader;

  if (inline) return <Loader size={size} color="var(--primary-color)"/>;

  return (
      <Loader size={size} color="var(--primary-color)" />
  );
}
