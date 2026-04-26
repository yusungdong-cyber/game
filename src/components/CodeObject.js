import * as THREE from 'three';

function createCodeTexture(code) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff9ef';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#3e2d1f';
  ctx.font = 'bold 124px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(code, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export class CodeObject {
  constructor({ code, position }) {
    this.code = code;
    this.group = new THREE.Group();

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.9, 1),
      new THREE.MeshStandardMaterial({ color: '#e07a35', roughness: 0.9 })
    );
    box.position.set(0, 0.45, 0);

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.5),
      new THREE.MeshBasicMaterial({ map: createCodeTexture(code) })
    );
    label.position.set(0, 0.55, 0.51);

    this.group.add(box, label);
    this.group.position.copy(position);
    this.group.userData.type = 'code-object';
    this.group.userData.code = code;
  }
}
