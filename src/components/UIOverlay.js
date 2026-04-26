export class UIOverlay {
  constructor({ onHintClick }) {
    this.onHintClick = onHintClick;
    this.el = document.createElement('div');
    this.el.className = 'ui-overlay';

    this.hintText = document.createElement('p');
    this.hintText.className = 'hint-text';
    this.hintText.textContent = '힌트 버튼을 눌러 단서를 확인하세요.';

    this.timerText = document.createElement('p');
    this.timerText.className = 'timer';
    this.timerText.textContent = '⏱ 00:00';

    this.findButton = document.createElement('button');
    this.findButton.textContent = '힌트 보기';
    this.findButton.addEventListener('click', () => this.onHintClick?.());

    this.interactText = document.createElement('p');
    this.interactText.className = 'interact';
    this.interactText.textContent = '탐색 중...';

    const top = document.createElement('div');
    top.className = 'top-panel';
    top.append(this.timerText, this.findButton, this.hintText, this.interactText);

    this.joystick = document.createElement('div');
    this.joystick.className = 'joystick';
    this.joystick.innerHTML = '<div class="stick"></div>';

    this.lookPad = document.createElement('div');
    this.lookPad.className = 'look-pad';
    this.lookPad.textContent = '시점 이동';

    const mobileControls = document.createElement('div');
    mobileControls.className = 'mobile-controls';
    mobileControls.append(this.joystick, this.lookPad);

    this.el.append(top, mobileControls);
  }

  updateTimer(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    this.timerText.textContent = `⏱ ${mm}:${ss}`;
  }

  setHint(text) {
    this.hintText.textContent = text;
  }

  setInteractText(text) {
    this.interactText.textContent = text;
  }
}
