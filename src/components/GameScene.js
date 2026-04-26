import * as THREE from 'three';
import { CodeObject } from './CodeObject';

function addGround(scene) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.MeshStandardMaterial({ color: '#cfe7cf', roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
}

function addOcean(scene) {
  const ocean = new THREE.Mesh(
    new THREE.CircleGeometry(26, 48),
    new THREE.MeshStandardMaterial({ color: '#95d8eb', roughness: 0.65, metalness: 0.05 })
  );
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.set(-25, 0.02, -18);
  scene.add(ocean);
}

function createRock(color = '#59656f') {
  return new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.1, 0),
    new THREE.MeshStandardMaterial({ color, roughness: 0.95 })
  );
}

function addBasaltRocks(scene) {
  const group = new THREE.Group();
  for (let i = 0; i < 26; i += 1) {
    const rock = createRock('#4f5660');
    rock.position.set(-30 + Math.random() * 18, 0.8, -28 + Math.random() * 18);
    rock.scale.setScalar(0.55 + Math.random() * 1.25);
    group.add(rock);
  }
  scene.add(group);
}

function addStoneWalls(scene) {
  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#7a736e', roughness: 0.95 });
  const lines = [
    { x: 20, z: 8, w: 24, h: 1.4, d: 1.1 },
    { x: 8, z: 20, w: 1.1, h: 1.4, d: 24 },
    { x: 30, z: 20, w: 1.1, h: 1.4, d: 24 },
    { x: 20, z: 32, w: 24, h: 1.4, d: 1.1 }
  ];
  for (const line of lines) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(line.w, line.h, line.d), wallMaterial);
    mesh.position.set(line.x, line.h / 2, line.z);
    scene.add(mesh);
  }
}

function addTangerineTrees(scene) {
  const group = new THREE.Group();

  for (let i = 0; i < 14; i += 1) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.28, 1.5),
      new THREE.MeshStandardMaterial({ color: '#7f5b3c', roughness: 0.9 })
    );
    trunk.position.y = 0.75;

    const crown = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.95, 0),
      new THREE.MeshStandardMaterial({ color: '#8fd48a', roughness: 0.85 })
    );
    crown.position.y = 1.9;

    for (let j = 0; j < 5; j += 1) {
      const orange = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 10, 10),
        new THREE.MeshStandardMaterial({ color: '#ff8f2e', roughness: 0.7 })
      );
      orange.position.set((Math.random() - 0.5) * 0.8, 1.8 + Math.random() * 0.5, (Math.random() - 0.5) * 0.8);
      tree.add(orange);
    }

    tree.add(trunk, crown);
    tree.position.set(12 + Math.random() * 16, 0, 11 + Math.random() * 16);
    group.add(tree);
  }

  scene.add(group);
}

function addCafeStreet(scene) {
  const cafeColors = ['#ffd7c2', '#ffe6a6', '#dbf3ff'];

  for (let i = 0; i < 4; i += 1) {
    const cafe = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({ color: cafeColors[i % cafeColors.length], roughness: 0.8 })
    );
    body.position.y = 1.25;

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.1, 1.4, 4),
      new THREE.MeshStandardMaterial({ color: '#f1b4c5', roughness: 0.8 })
    );
    roof.position.y = 3.2;
    roof.rotation.y = Math.PI * 0.25;

    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.5, 0.2),
      new THREE.MeshStandardMaterial({ color: '#8d6b57' })
    );
    sign.position.set(0, 2.2, 2.12);

    cafe.add(body, roof, sign);
    cafe.position.set(-2 + i * 6.6, 0, -2);
    scene.add(cafe);
  }
}

function addDolHareubang(scene) {
  const dol = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.3, 3.2, 8),
    new THREE.MeshStandardMaterial({ color: '#76706a', roughness: 0.95 })
  );
  body.position.y = 1.6;

  const hat = new THREE.Mesh(
    new THREE.ConeGeometry(1.45, 1.2, 8),
    new THREE.MeshStandardMaterial({ color: '#67605a', roughness: 0.95 })
  );
  hat.position.y = 3.8;

  dol.add(body, hat);
  dol.position.set(-12, 0, 6);
  scene.add(dol);
}

function addWindParticles(scene) {
  const geom = new THREE.BufferGeometry();
  const count = 120;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 1] = 2 + Math.random() * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
  }
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({ color: '#ffffff', size: 0.08, transparent: true, opacity: 0.55 });
  const points = new THREE.Points(geom, mat);
  points.userData.isWind = true;
  scene.add(points);
}

export class GameScene {
  constructor({ code }) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#b9e7ff');

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 250);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.worldBounds = { minX: -45, maxX: 45, minZ: -45, maxZ: 45 };

    const ambient = new THREE.AmbientLight('#ffffff', 0.85);
    const sun = new THREE.DirectionalLight('#fff9dc', 1.2);
    sun.position.set(15, 28, 10);

    this.scene.add(ambient, sun);

    addGround(this.scene);
    addOcean(this.scene);
    addBasaltRocks(this.scene);
    addStoneWalls(this.scene);
    addTangerineTrees(this.scene);
    addCafeStreet(this.scene);
    addDolHareubang(this.scene);
    addWindParticles(this.scene);

    // 변경 포인트: 코드 오브젝트 위치를 바꾸면 숨김 위치를 바꿀 수 있습니다.
    this.codeObject = new CodeObject({
      code,
      position: new THREE.Vector3(26, 0, 26)
    });
    this.scene.add(this.codeObject.group);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animateWind(timeSeconds) {
    this.scene.traverse((obj) => {
      if (!obj.userData.isWind || !obj.geometry?.attributes?.position) return;
      const attr = obj.geometry.attributes.position;
      for (let i = 0; i < attr.count; i += 1) {
        let x = attr.getX(i);
        const y = attr.getY(i);
        let z = attr.getZ(i);
        x += 0.01;
        z += Math.sin(timeSeconds + i * 0.1) * 0.003;
        if (x > 45) x = -45;
        attr.setXYZ(i, x, y, z);
      }
      attr.needsUpdate = true;
    });
  }
}
