const data = [
    { label: "A", value: 5 },
    { label: "B", value: 8 },
    { label: "C", value: 3 },
    { label: "D", value: 7 },
    { label: "E", value: 2 },
  ];
  
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 15);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  
  // Load environment map for steel reflection
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const envMap = cubeTextureLoader.load([
    "https://threejs.org/examples/textures/cube/Bridge2/posx.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negx.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/posy.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negy.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/posz.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negz.jpg",
  ]);
  scene.environment = envMap;
  
  //Other options are:
  // MeshStandardMaterial
  // MeshBasicMaterial: no lighting
  // MeshLambertMaterial: simple lighting
  // MeshPhongMaterial: shiny surfaces
  
  // Steel-like material
  const metalMaterial = new THREE.MeshPhongMaterial({
    metalness: 1,
    roughness: 0.2,
    envMap: envMap,
    color: 0x888888,
  });
  
  // Create bars
  const barWidth = 1;
  const spacing = 0.4;
  const startX = -(data.length * (barWidth + spacing)) / 2 + barWidth / 2;
  
  data.forEach((item, i) => {
    const barHeight = item.value;
    const geometry = new THREE.BoxGeometry(barWidth, barHeight, barWidth);
    const bar = new THREE.Mesh(geometry, metalMaterial);
    bar.position.set(startX + i * (barWidth + spacing), barHeight / 2, 0);
    scene.add(bar);
  });
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  
  const gridHelper = new THREE.GridHelper(20, 20);
  scene.add(gridHelper);
  
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
  