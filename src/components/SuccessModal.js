export class SuccessModal {
  constructor({ eventUrl, onClose }) {
    this.eventUrl = eventUrl;
    this.onClose = onClose;
    this.el = document.createElement('div');
    this.el.className = 'success-modal hidden';
  }

  show(code) {
    const link = `${this.eventUrl}?code=${encodeURIComponent(code)}`;
    this.el.innerHTML = `
      <div class="modal-card">
        <h2>축하합니다! 경품 번호를 찾았어요.</h2>
        <p>이 번호를 홈페이지 이벤트 페이지에 입력하면 선물을 받을 수 있어요.</p>
        <p class="code">${code}</p>
        <div class="actions">
          <a href="${link}" target="_blank" rel="noreferrer">경품 받으러 가기</a>
          <button type="button" data-close>닫기</button>
        </div>
      </div>
    `;
    this.el.classList.remove('hidden');
    this.el.querySelector('[data-close]')?.addEventListener('click', () => {
      this.el.classList.add('hidden');
      this.onClose?.();
    });
  }
}
