document.addEventListener('DOMContentLoaded', init);

function init() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  var context = new AudioContext();

  navigator.mediaDevices.getUserMedia({audio: true}, function(stream) {
    var microphone = context.createMediaStreamSource(stream);
    var filter = context.createBiquadFilter();
  
    // microphone -> filter -> destination.
    microphone.connect(filter);
    filter.connect(context.destination);
    console.log(stream);
  }, function(err) { console.log(`there's an error ${err}`) } );


  const startTime = Date.now();

  const container = document.getElementById('container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const listener = new THREE.AudioListener();
  camera.add(listener);

  const sound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();


  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  var geometry = new THREE.BoxGeometry(5, 5, 5);
  var uniforms = {
    uTime: { type: 'f', value: 1.0 }
  };
  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
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

    var elapsedMs = Date.now() - startTime;
    var elapsedSeconds = elapsedMs / 1000.0;
    // uniforms.uTime.value = 60.0 * elapsedSeconds;
    uniforms.uTime.value = 12.0;

    renderer.render(scene, camera);
  };

  animate();
}