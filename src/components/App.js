import * as THREE from 'three';
import { EVENT_URL, FIXED_PRIZE_CODE, RECLAIM_COOLDOWN_MS } from '../config/gameConfig';
import { GameScene } from './GameScene';
import { PlayerController } from './PlayerController';
import { HintSystem } from './HintSystem';
import { UIOverlay } from './UIOverlay';
import { SuccessModal } from './SuccessModal';

const STORAGE_KEYS = {
  discovered: 'jeju_treasure_discovered',
  lastClaimAt: 'jeju_treasure_last_claim_at',
  sessionDone: 'jeju_treasure_session_done'
};

function generateCode() {
  if (FIXED_PRIZE_CODE && /^\d{4}$/.test(FIXED_PRIZE_CODE)) return FIXED_PRIZE_CODE;
  return String(Math.floor(1000 + Math.random() * 9000));
}

export class App {
  constructor(root) {
    this.root = root;
    this.hintSystem = new HintSystem();
    this.code = generateCode();
    this.startTime = performance.now();
    this.found = false;

    this.sceneBundle = new GameScene({ code: this.code });
    this.raycaster = new THREE.Raycaster();

    this.uiOverlay = new UIOverlay({
      onHintClick: () => {
        this.uiOverlay.setHint(this.hintSystem.getHint());
      }
    });

    this.playerController = new PlayerController({
      camera: this.sceneBundle.camera,
      domElement: this.sceneBundle.renderer.domElement,
      uiOverlay: this.uiOverlay
    });

    this.successModal = new SuccessModal({
      eventUrl: EVENT_URL,
      onClose: () => {
        this.uiOverlay.setInteractText('이벤트 페이지에서 번호를 입력해 주세요!');
      }
    });

    this.checkExistingState();
  }

  checkExistingState() {
    const isSessionDone = sessionStorage.getItem(STORAGE_KEYS.sessionDone) === 'true';
    if (isSessionDone) {
      this.found = true;
      const savedCode = localStorage.getItem(STORAGE_KEYS.discovered);
      if (savedCode) {
        this.successModal.show(savedCode);
      }
      this.uiOverlay.setInteractText('이미 이번 세션에서 번호를 찾았어요.');
    }
  }

  canClaimNow() {
    const lastClaimAt = Number(localStorage.getItem(STORAGE_KEYS.lastClaimAt) || 0);
    return Date.now() - lastClaimAt > RECLAIM_COOLDOWN_MS;
  }

  onFoundCode() {
    if (this.found) return;

    this.found = true;
    const elapsedSec = Math.floor((performance.now() - this.startTime) / 1000);

    const claimBlocked = !this.canClaimNow();

    localStorage.setItem(STORAGE_KEYS.discovered, this.code);
    localStorage.setItem(STORAGE_KEYS.lastClaimAt, String(Date.now()));
    sessionStorage.setItem(STORAGE_KEYS.sessionDone, 'true');
    if (claimBlocked) {
      this.uiOverlay.setInteractText('잠시 후 다시 참여해 주세요 (중복 방지).');
      return;
    }

    this.successModal.show(this.code);
    this.uiOverlay.setInteractText(`발견 완료! 기록: ${elapsedSec}초`);
  }

  detectCodeObject() {
    const camera = this.sceneBundle.camera;
    const target = this.sceneBundle.codeObject.group;

    const distance = camera.position.distanceTo(target.position);
    if (distance > 5.5) {
      this.uiOverlay.setInteractText('수상한 오브젝트를 가까이서 살펴보세요.');
      return;
    }

    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = this.raycaster.intersectObject(target, true);
    if (intersects.length > 0) {
      this.onFoundCode();
    } else {
      this.uiOverlay.setInteractText('화면 중앙으로 오브젝트를 맞춰보세요.');
    }
  }

  mount() {
    this.root.append(this.sceneBundle.renderer.domElement, this.uiOverlay.el, this.successModal.el);

    const loop = (t) => {
      const delta = this.prev ? (t - this.prev) / 1000 : 0;
      this.prev = t;

      this.playerController.update(delta, this.sceneBundle.worldBounds);
      this.sceneBundle.animateWind(t * 0.001);

      if (!this.found) {
        this.detectCodeObject();
        const elapsedSec = Math.floor((t - this.startTime) / 1000);
        this.uiOverlay.updateTimer(elapsedSec);
      }

      this.sceneBundle.renderer.render(this.sceneBundle.scene, this.sceneBundle.camera);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}
