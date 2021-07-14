import "./style.css";

import * as THREE from "three";
// we need 3 things:
// 1. scene (==Container)
// 2. camera
// 3. renderer

//animation according to mouse movements
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



const scene = new THREE.Scene();

// params : (fov, aspect ration, near, far), near n far are called view frustum
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//render graphics to scene, select which dom elements to use
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//currently camera is in the middle of the scene
camera.position.setZ(30);

//now draw the scene, aka render
renderer.render(scene, camera);

// now add geometries (using three js inbuilt geometries..)
const geometry = new THREE.TorusGeometry(10, 3, 16, 100); //torus is like a ring

//give it color, texture, etc.
// standard will react to the light bouncing off of it
const material = new THREE.MeshStandardMaterial({color: 0xFF6347, wireframe=true})
const torus = new THREE.Mesh(geometry, material)

scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20)
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointlight)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement) //listens to dom events on mouse, and update camera position accordingly


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff})
  const star = new THREE.Mesh(geometry, material)

  //how to randomly generate the pos of each star?
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)); //(-100, 100)
  
  star.position.set(x,y,z);
  scene.add(star)
}

//now create the star
Array(200).fill().forEach(addStar)

// we can also track load %, so if too large size we can add loading bar till it completes!
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//my avatar! concept used: texture mapping!
const abhiTexture = new THREE.TextureLoader().load('profilepic.jpg');
const abhi = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3), //cube like
  new THREE.MeshBasicMaterial({map: abhiTexture})
)

scene.add(abhi)


// adding that moon
const moonTexture = new THREE.TextureLoader('moon.jpg');
const normalTexture = new THREE.TextureLoader('normal.jpg')

const moon = new THREE.Mesh (
  new THREE
  .SphereGeometry(3, 32, 32),
  new Three.MeshBasicMaterial( {
    map: moonTexture,
    normalMap : normalTexture
  })
)

scene.add(moon)
moon.position.z = 30
moon.position.setX(-10) //they both do the same thing, .z = 10 or .setz(10)

//this function is event handler for camera
function moveCamera() {
  //currently scrolled to
  const t = document.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  abhi.rotation.y += 0.01;
  abhi.rotation.z += 0.01;

  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
  camera.position.z = t * -0.01;
  
}

document.body.onscroll = moveCamera

//now draw the scene, aka render
// renderer.render(scene, camera);

function animate()
{
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate()