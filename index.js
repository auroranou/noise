document.addEventListener('DOMContentLoaded', init);


class Audio {
  constructor() {
    this.context = new AudioContext();
    this.filter = null;
    this.microphone = null;
    this.analyser = null;
    this.source = null;
    this.bufferLength = null;
    this.dataArr = new Uint8Array();
    this.fftSize = 512;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.microphone = this.context.createMediaStreamSource(stream);
        this.filter = this.context.createBiquadFilter();

        this.analyser = this.context.createAnalyser();
        // this.analyser.smoothingTimeConstant = 0.5;
        this.analyser.fftSize = this.fftSize;
        this.microphone.connect(this.analyser);
        this.filter.connect(this.analyser);
        this.analyser.connect(this.context.destination);

        this.source = this.context.createBufferSource();
        this.source.connect(this.analyser);

        this.microphone.connect(this.filter);
        this.filter.connect(this.context.destination);

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArr = new Uint8Array(this.bufferLength);
      })
      .catch(function (err) { console.log(`there's an error ${err}`) });
  }

  process() {
    if (!this.analyser) {
      // audio.microphone.disconnect(0);
      //Need to set the analyser to null to stop the animation.
      // audio.analyser = null;
      // Might need to disconnect the other analysers.
      return;
    }

    this.analyser.getByteTimeDomainData(this.dataArr);

    // console.log(this.dataArr);
    return this.dataArr;
  }
}

function init() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  let audio = new Audio();

  // debugger
  const startTime = Date.now();

  const container = document.getElementById('container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  var geometry = new THREE.BoxGeometry(2, 2, 2);
  // var uniforms = {
  //   uTime: { type: 'f', value: 1.0 },
  //   tAudioData: { type: 't', value: getTexture() }
  // };
  // var material = new THREE.ShaderMaterial({
  //   uniforms: uniforms,
  //   vertexShader: document.getElementById('vertex-shader').textContent,
  //   fragmentShader: document.getElementById('fragment-shader').textContent
  // });
  var material = new THREE.MeshBasicMaterial({
    map: getTexture(),
    needsUpdate: true
  });

  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  var animate = function () {

    requestAnimationFrame(animate);
    // audio.process();

    cube.rotation.x += 0.001;
    cube.rotation.y += 0.01;
    var elapsedMs = Date.now() - startTime;
    var elapsedSeconds = elapsedMs / 1000.0;
    // uniforms.uTime.value = 60.0 * elapsedSeconds;
    // uniforms.uTime.value = 12.0;

    material.map = getTexture(audio.process());

    renderer.render(scene, camera);
  };

  animate();
}

function getTexture(audioData) {
  const width = 6;
  const height = 6;
  let size = audioData && audioData.length > 0 ? audioData.length : 3 * width * height;
  let data = new Uint8Array(size);

  for (let i = 0; i < size; i++) {
    let stride = i * 3;
    let x = audioData ? audioData[i] : 255;

    data[stride] = Math.floor(Math.random() * x);
    data[stride + 1] = Math.floor(Math.random() * x);
    data[stride + 2] = Math.floor(Math.random() * x);
  }

  let texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
}