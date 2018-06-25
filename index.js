document.addEventListener('DOMContentLoaded', init);

function init() {
  const container = document.getElementById('container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertex-shader').textContent,
    fragmentShader: document.getElementById('fragment-shader').textContent
  });
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  var animate = function () {
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.1;
    // cube.rotation.y += 0.1;

    renderer.render(scene, camera);
  };

  animate();
}