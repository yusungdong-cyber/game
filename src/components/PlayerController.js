import * as THREE from 'three';

export class PlayerController {
  constructor({ camera, domElement, uiOverlay }) {
    this.camera = camera;
    this.domElement = domElement;
    this.uiOverlay = uiOverlay;

    this.position = new THREE.Vector3(-12, 1.7, 10);
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.move = { forward: false, backward: false, left: false, right: false };

    this.yaw = -Math.PI * 0.15;
    this.pitch = -0.1;
    this.speed = 7.5;
    this.lookSpeed = 0.0025;

    this.joystickVector = { x: 0, y: 0 };
    this.lookTouchId = null;
    this.lookLast = null;

    this.#bindDesktopControls();
    this.#bindTouchControls();
    this.#applyCamera();
  }

  #bindDesktopControls() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.move.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.move.backward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.move.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.move.right = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.move.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.move.backward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.move.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.move.right = false;
    });

    this.domElement.addEventListener('click', () => {
      if (document.pointerLockElement !== this.domElement) {
        this.domElement.requestPointerLock?.();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement !== this.domElement) return;
      this.yaw -= e.movementX * this.lookSpeed;
      this.pitch -= e.movementY * this.lookSpeed;
      this.pitch = Math.max(-1.2, Math.min(1.2, this.pitch));
      this.#applyCamera();
    });
  }

  #bindTouchControls() {
    const joystick = this.uiOverlay.joystick;
    const stick = joystick.querySelector('.stick');
    let joystickTouchId = null;

    const updateJoystick = (touch) => {
      const rect = joystick.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = touch.clientX - cx;
      const dy = touch.clientY - cy;
      const dist = Math.min(Math.hypot(dx, dy), rect.width / 2 - 12);
      const angle = Math.atan2(dy, dx);
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;

      stick.style.transform = `translate(${px}px, ${py}px)`;
      this.joystickVector.x = px / (rect.width / 2);
      this.joystickVector.y = py / (rect.height / 2);
    };

    joystick.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      joystickTouchId = t.identifier;
      updateJoystick(t);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (joystickTouchId === null) return;
      for (const t of e.changedTouches) {
        if (t.identifier === joystickTouchId) updateJoystick(t);
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === joystickTouchId) {
          joystickTouchId = null;
          this.joystickVector.x = 0;
          this.joystickVector.y = 0;
          stick.style.transform = 'translate(0px, 0px)';
        }
      }
    }, { passive: true });

    const lookPad = this.uiOverlay.lookPad;
    lookPad.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      this.lookTouchId = t.identifier;
      this.lookLast = { x: t.clientX, y: t.clientY };
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.lookTouchId === null || !this.lookLast) return;
      for (const t of e.changedTouches) {
        if (t.identifier !== this.lookTouchId) continue;
        const dx = t.clientX - this.lookLast.x;
        const dy = t.clientY - this.lookLast.y;
        this.lookLast = { x: t.clientX, y: t.clientY };

        this.yaw -= dx * 0.008;
        this.pitch -= dy * 0.008;
        this.pitch = Math.max(-1.2, Math.min(1.2, this.pitch));
        this.#applyCamera();
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === this.lookTouchId) {
          this.lookTouchId = null;
          this.lookLast = null;
        }
      }
    }, { passive: true });
  }

  #applyCamera() {
    this.camera.position.copy(this.position);
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }

  update(delta, worldBounds) {
    this.direction.set(0, 0, 0);

    const forward = Number(this.move.forward) - Number(this.move.backward);
    const side = Number(this.move.right) - Number(this.move.left);

    this.direction.z = -(forward - this.joystickVector.y);
    this.direction.x = side + this.joystickVector.x;

    if (this.direction.lengthSq() > 1) {
      this.direction.normalize();
    }

    const moveVector = new THREE.Vector3(this.direction.x, 0, this.direction.z)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw)
      .multiplyScalar(this.speed * delta);

    this.position.add(moveVector);

    this.position.x = THREE.MathUtils.clamp(this.position.x, worldBounds.minX, worldBounds.maxX);
    this.position.z = THREE.MathUtils.clamp(this.position.z, worldBounds.minZ, worldBounds.maxZ);
    this.position.y = 1.7;

    this.#applyCamera();
  }
}
