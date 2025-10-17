
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

// Debug GUI
const gui = new dat.GUI()

// Canvas and Scene
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const manualImage = new Image()
const manualTexture = new THREE.Texture(manualImage)

manualImage.addEventListener('load', () => {
  manualTexture.needsUpdate = true
  console.log(' Manual image loaded and texture updated!')
})
manualImage.src = '/textures/door/color.jpg'


// Create a loading manager for better control
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => console.log(' Loading started...')
loadingManager.onLoad = () => console.log(' All textures loaded!')
loadingManager.onProgress = () => console.log(' Loading in progress...')
loadingManager.onError = () => console.log(' Error while loading textures!')

// Create a texture loader using the manager
const textureLoader = new THREE.TextureLoader(loadingManager)

// Load textures
const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// Optional texture settings for better results
colorTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping
colorTexture.repeat.set(1, 1)


const material = new THREE.MeshStandardMaterial({
  map: colorTexture,
  aoMap: ambientOcclusionTexture,
  metalnessMap: metalnessTexture,
  roughnessMap: roughnessTexture,
  normalMap: normalTexture,
  alphaMap: alphaTexture,
  transparent: true
})

const geometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 2, 5)
scene.add(ambientLight, directionalLight)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 2
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace


window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

// ANIMATE 

const clock = new THREE.Clock()

function tick() {
  const elapsedTime = clock.getElapsedTime()

  // Rotate cube
  mesh.rotation.x = elapsedTime * 0.3
  mesh.rotation.y = elapsedTime * 0.6

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
