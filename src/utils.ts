    interface DeltaTimer {
  lastUpdate: number;
  tick: (freq?: number) => boolean;
}

const freqTimer: DeltaTimer = {
  lastUpdate: Date.now(),
  tick: function (freq = 10) {
    var now = Date.now();
    var dt = now - this.lastUpdate;
    if (dt > 1000 / freq) {
      this.lastUpdate = now;
      return true;
    }
    return false;
  },
};

export { freqTimer };
