import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'explorationFrequency',
  storage: sessionStorage,
});

export interface ExplorationFrequency {
  [stepName: string]: number;
}

export const explorationFrequencyState = atom<ExplorationFrequency>({
  key: 'explorationFrequencyState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
