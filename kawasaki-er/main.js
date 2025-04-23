import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Create renderer
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(30, 10, 8);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 3;
controls.maxDistance = 21;

// Load HDRI environment map
new RGBELoader().load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/docklands_01_2k.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  }
);

const loader = new GLTFLoader();
loader.load("./kawasaki_er.glb", function (gltf) {
  gltf.scene.scale.set(0.01, 0.01, 0.01);
  gltf.scene.position.set(1, -0.8, 8);
  gltf.scene.rotation.y = Math.PI;
  scene.add(gltf.scene);
});

// Load ground texture
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load("../kawasaki-bike/assets/ground.jpg");
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(100, 100);
groundTexture.encoding = THREE.sRGBEncoding;

// Add ground plane
const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: groundTexture,
  roughness: 0.8,
  metalness: 0.2,
});
const ground = new THREE.Mesh(planeGeometry, planeMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.9;
ground.receiveShadow = true;
scene.add(ground);

// Restrict camera movement
controls.maxPolarAngle = Math.PI / 2; // Prevent going below ground
controls.minPolarAngle = 0.1; // Prevent going too high

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.dampingFactor = 0.05;
  controls.update();
  renderer.render(scene, camera);
}

animate();

// information box interactivit
document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const icon = header.querySelector(".fa-chevron-down");

    if (content.style.maxHeight === "0px" || !content.style.maxHeight) {
      content.style.maxHeight = content.scrollHeight + "px";
      icon.style.transform = "rotate(180deg)";
    } else {
      content.style.maxHeight = "0px";
      icon.style.transform = "rotate(0deg)";
    }
  });
});
