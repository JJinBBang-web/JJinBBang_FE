import { RecoilState, RecoilValue, useRecoilCallback, useRecoilSnapshot } from "recoil";

// Global variables to hold the implementations
let getRecoilValue: <T>(atom: RecoilValue<T>) => T = () => { throw new Error("RecoilNexus not initialized"); };
let setRecoilValue: <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) => void = () => { throw new Error("RecoilNexus not initialized"); };

export function getRecoil<T>(atom: RecoilValue<T>): T {
    return getRecoilValue(atom);
}

export function setRecoil<T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)): void {
    setRecoilValue(atom, valOrUpdater);
}

const RecoilNexus = () => {
    const snapshot = useRecoilSnapshot();
    
    // Update getter whenever snapshot changes to ensure we read the latest state
    getRecoilValue = <T,>(atom: RecoilValue<T>) => {
        return snapshot.getLoadable(atom).getValue();
    };

    // Initialize setter using useRecoilCallback to access the write interface
    const setCallback = useRecoilCallback(({ set }) => (atom: any, valOrUpdater: any) => {
        set(atom, valOrUpdater);
    }, []);
    
    setRecoilValue = setCallback;

    return null;
};

export default RecoilNexus;
