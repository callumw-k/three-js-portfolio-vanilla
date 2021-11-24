import "./styles/style.scss";
import * as Three from "three";

function throttled(delay, fn) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}

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

//create a function that updates the three.js canvas size on window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

const geometry = new Three.TorusGeometry(10, 3, 16, 100);
const material = new Three.MeshStandardMaterial({ color: 0x000000 });
const torus = new Three.Mesh(geometry, material);
// scene.add(torus);

const pointLight = new Three.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new Three.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

const lightHelper = new Three.PointLightHelper(pointLight);
const gridHelper = new Three.GridHelper(200, 50);
// scene.add(gridHelper, lightHelper);

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

const spaceTexture = new Three.TextureLoader().load(
  "https://res.cloudinary.com/callum-wellwood-kane/image/upload/v1637741079/My%20Website/space-2_mjb1tk.png"
);
scene.background = spaceTexture;

// scene.add(callum);

const marsTexture = new Three.TextureLoader().load(
  "https://res.cloudinary.com/callum-wellwood-kane/image/upload/v1637741080/My%20Website/2k_mars_ll797s.jpg"
);
const mars = new Three.Mesh(
  new Three.SphereGeometry(3, 32, 32),
  new Three.MeshBasicMaterial({ map: marsTexture })
);

mars.position.z = 10;
mars.position.setX(-5);
mars.position.y = -10;

let t = 0;
let prev = 0;

const mouseWheel = (e) => {
  let delta = e.deltaY;
  delta = delta / 100;
  delta = -delta;
  console.log(delta);
  if (delta <= 0) {
    delta -= camera.position.y * 0.001;
  } else {
    delta += camera.position.y * 0.001;
  }
  if (camera.position.y + delta > 1 && camera.position.y + delta < 200) {
    camera.translateY(delta);
  }
};

const mouseWheel2 = (e) => {
  let delta = e.deltaY;
  delta = -delta;
  if (delta < 0) {
    mars.position.x += 0.1;
    camera.position.y += delta * 0.002;
  } else {
    mars.position.x -= 0.1;
    camera.position.y += delta * 0.002;
  }
  mars.rotation.x += 0.05;
  mars.rotation.y += 0.075;
  mars.rotation.z += 0.05;
};
function scrollFunc() {
  t = document.body.getBoundingClientRect().top;
  console.log(t);
  if (t <= prev) {
    mars.rotation.x += 0.05;
    mars.rotation.y += 0.075;
    mars.rotation.z += 0.05;
    mars.position.x += 0.1;

    //    camera.position.z += t * -0.01;
    // camera.position.x += t * 0.0002;
    camera.position.y += t * 0.0002;
  } else {
    mars.rotation.x += 0.05;
    mars.rotation.y += 0.075;
    mars.rotation.z += 0.05;
    mars.position.x -= 0.1;
    // camera.position.z += t * 0.01;
    // camera.position.x += t * 0.0002;
    camera.position.y -= t * 0.0002;
  }
  prev = t;
}
document.addEventListener("wheel", throttled(10, mouseWheel2));

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
