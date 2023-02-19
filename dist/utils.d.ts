interface DeltaTimer {
    lastUpdate: number;
    tick: (freq?: number) => boolean;
}
declare const freqTimer: DeltaTimer;
export { freqTimer };
