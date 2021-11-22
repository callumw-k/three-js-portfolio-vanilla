import "./styles/style.css";
import * as Three from "three";

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new Three.TorusGeometry(10, 3, 16, 100);
const material = new Three.MeshStandardMaterial({ color: 0x000000 });
const torus = new Three.Mesh(geometry, material);
scene.add(torus);

const pointLight = new Three.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new Three.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

const lightHelper = new Three.PointLightHelper(pointLight);
const gridHelper = new Three.GridHelper(200, 50);
scene.add(gridHelper, lightHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new Three.SphereGeometry(0.25, 24, 24);
  const material = new Three.MeshStandardMaterial({ color: 0xffffff });
  const star = new Three.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => Three.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new Three.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

const callumTexture = new Three.TextureLoader().load("callum.png");

const callum = new Three.Mesh(
  new Three.BoxGeometry(3, 3, 3),
  new Three.MeshBasicMaterial({ map: callumTexture })
);

scene.add(callum);

const marsTexture = new Three.TextureLoader().load("2k_mars.jpg");
const mars = new Three.Mesh(
  new Three.SphereGeometry(3, 32, 32),
  new Three.MeshBasicMaterial({ map: marsTexture })
);

mars.position.z = 10;
mars.position.setX(-10);

document.body.onscroll = () => {
  const t = document.body.getBoundingClientRect().top;
  mars.rotation.x += 0.05;
  mars.rotation.y += 0.075;
  mars.rotation.z += 0.05;

  callum.rotation.y += 0.01;
  callum.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
};
scene.add(mars);
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;
  // controls.update();
  renderer.render(scene, camera);
}

animate();
