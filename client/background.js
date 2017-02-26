var THREE = require('three');

$(document).ready(() => {
  var scene = new THREE.Scene()

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
  camera.rotation.z = -0.2
  camera.position.set(-300, 0, 600)

  var renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setSize(window.innerWidth, window.innerHeight)
  $('body').append(renderer.domElement)

  var geometry = new THREE.SphereGeometry(300, 32, 32)
  var material = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('/images/map.jpg')})

  var mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = -200
  mesh.position.y = -10
  scene.add( mesh )

  scene.add(new THREE.AmbientLight(0x111111, 0.1))

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
  directionalLight.position.x = 0.5
  directionalLight.position.y = 0.5
  directionalLight.position.z = 0.5
  directionalLight.position.normalize()
  scene.add(directionalLight)

  var render = () => {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
  }

  render()

  $(window).on('resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize(window.innerWidth, window.innerHeight)
  })

  $(window).on('scroll', () => {
     mesh.rotation.y = - Math.PI * 2 / ($('.row.column').height() - $(window).innerHeight()) * $(window).scrollTop()
  })

})
