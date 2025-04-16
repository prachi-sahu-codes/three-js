// Global variables
let scene, camera, renderer, controls;
let currentModel = null;
const canvasContainer = document.getElementById("canvas-container");

// Initialize the scene
function init() {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5);

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  canvasContainer.appendChild(renderer.domElement);

  // Create controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.update();

  // Add lights
  addLights();

  // Add helpers
  addHelpers();

  // Handle window resize
  window.addEventListener("resize", onWindowResize);

  // Load initial model
  loadModel(
    "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf"
  );

  // Start animation loop
  animate();
}

// Add lights to the scene
function addLights() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Directional light (sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  scene.add(directionalLight);
}

// Add helper objects to the scene
function addHelpers() {
  // Grid helper
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);

  // Axes helper (shows the X (red), Y (green), and Z (blue) axes)
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);
}

// Load a GLTF model
function loadModel(url) {
  // Remove previous model if it exists
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }

  // Create GLTF loader
  const loader = new THREE.GLTFLoader();

  // Load the model
  loader.load(
    url,
    // Success callback
    function (gltf) {
      const model = gltf.scene;

      // Center the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Reposition to center
      model.position.x = -center.x;
      model.position.y = -center.y;
      model.position.z = -center.z;

      // Scale to reasonable size
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const scale = 2 / maxDim;
        model.scale.set(scale, scale, scale);
      }

      // Enable shadows
      model.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      // Add model to scene
      scene.add(model);
      currentModel = model;
    },
    // Progress callback
    function (xhr) {
      if (xhr.lengthComputable) {
        const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
        loadingInfo.textContent = `Loading: ${percentComplete}%`;
      }
    }
  );
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Render scene
  renderer.render(scene, camera);
}

// Initialize the application
init();
