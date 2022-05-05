import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'

console.log(gsap)
  
  var gui = new dat.GUI();
  const world = {
      plane: {
          width: 400,
          height: 400,
          widthSegments: 50,
          heightSegments: 50
      }
  }
  gui.add(world.plane, 'width', 1, 500).onChange(generatePlane)
  gui.add(world.plane, 'height', 1, 500).onChange(generatePlane)
  gui.add(world.plane, 'widthSegments', 1, 150).onChange(generatePlane)
  gui.add(world.plane, 'heightSegments', 1, 150).onChange(generatePlane)

  function generatePlane() {
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.widthSegments)

    // vertices position randomized
    const { array } = planeMesh.geometry.attributes.position
    const randomValues = []
  for(var i = 0; i < array.length; i++) {

    if(i % 3 === 0) {
      var x = array[i]
      var y = array[i + 1]
      var z = array[i + 2]

      array[i] = x + (Math.random() - 0.5) * 3
      array[i + 1] = y + (Math.random() - 0.5) * 3
      array[i + 2] = z + (Math.random() - 0.5) * 3
    }
      randomValues.push(Math.random() * Math.PI * 2)
  }
  planeMesh.geometry.attributes.position.randomValues = randomValues
  planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array

  const colors = []
for(var i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4)
}

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
  }

const raycaster = new THREE.Raycaster()
console.log(raycaster)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
camera.position.z = 50;

const planeGeometry = new THREE.PlaneGeometry( world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments );
const planeMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, flatShading: THREE.FlatShading, vertexColors: true})

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)
generatePlane()

const colors = []
for(var i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4)
}

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set( 0, -1, 1)
scene.add(light)

const backlight = new THREE.DirectionalLight(0xffffff, 1)
backlight.position.set( 0, 0, -1)
scene.add(backlight)

const mouse = {
  x: undefined,
  y: undefined
}

let frame = 0

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    //planeMesh.rotation.x +=0.01;
    raycaster.setFromCamera(mouse, camera)
    frame += 0.01
    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position

    for(var i = 0; i < array.length; i += 3) {
      // x
      array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01
      // y
      array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.001
    }
    planeMesh.geometry.attributes.position.needsUpdate = true

    const intersects = raycaster.intersectObject(planeMesh)
    if(intersects.length > 0) {
      const { color } = intersects[0].object.geometry.attributes
      
      //Vertice 1
      color.setX(intersects[0].face.a, 0.1)
      color.setY(intersects[0].face.a, 0.5)
      color.setZ(intersects[0].face.a, 1)

      //Vertice 2
      color.setX(intersects[0].face.a, 0.1)
      color.setY(intersects[0].face.a, 0.5)
      color.setZ(intersects[0].face.a, 1)

      //Vertice 3
      color.setX(intersects[0].face.a, 0.1)
      color.setY(intersects[0].face.a, 0.5)
      color.setZ(intersects[0].face.a, 1)
      
      intersects[0].object.geometry.attributes.color.needsUpdate = true

      const initialColor = {
        r: 0,
        g: 0.19,
        b: 0.4
      }

      const hoverColor = {
        r: 0.1,
        g: 0.5,
        b: 1
      }
      gsap.to (hoverColor, {
        r: initialColor.r,
        g: initialColor.g,
        b: initialColor.b,
        onUpdate: () => {
          //Vertice 1
      color.setX(intersects[0].face.a, hoverColor.r)
      color.setY(intersects[0].face.a, hoverColor.g)
      color.setZ(intersects[0].face.a, hoverColor.b)

      //Vertice 2
      color.setX(intersects[0].face.a, hoverColor.r)
      color.setY(intersects[0].face.a, hoverColor.g)
      color.setZ(intersects[0].face.a, hoverColor.b)

      //Vertice 3
      color.setX(intersects[0].face.a, hoverColor.r)
      color.setY(intersects[0].face.a, hoverColor.g)
      color.setZ(intersects[0].face.a, hoverColor.b)
        }
      })
    }
}

animate()

addEventListener("mousemove", (event) => {
  mouse.x = ( event.clientX / innerWidth ) * 2 - 1
  mouse.y = -( event.clientY / innerHeight ) * 2 + 1
})