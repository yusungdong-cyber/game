import { HINT_TEXTS } from '../config/gameConfig';

export class HintSystem {
  constructor() {
    this.hintIndex = 0;
  }

  getHint() {
    const text = HINT_TEXTS[this.hintIndex % HINT_TEXTS.length];
    this.hintIndex += 1;
    return text;
  }
}
