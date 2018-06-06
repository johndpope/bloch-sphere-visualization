import * as THREE from 'three'
import OrbitControls from 'three-orbit-controls'

const _OrbitControls = new OrbitControls(THREE)
const step = 50

export default class BlochSphere {
  constructor(container, bit) {
    this.container = container
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setClearColor(0xffffff)
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000)
    this.camera.position.set(0, 0, 10)
    // this._onResize()
    this.scene.add(this.camera)

    // eslint-disable-next-line no-new
    new _OrbitControls(this.camera, this.renderer.domElement)

    // this.scene.add(new THREE.DirectionalLight(0xffffff, 0.7))
    this.scene.add(new THREE.AmbientLight(0xffffff, 1))

    this.sphere = new THREE.LineSegments(
      new THREE.EdgesGeometry(
        new THREE.Mesh(
          new THREE.SphereGeometry(5, 32, 32),
          new THREE.MeshBasicMaterial({color: 0xffff00})
        ).geometry
      ),
      new THREE.LineBasicMaterial({color: 0xbbbbbb, linewidth: 2})
    )
    this.scene.add(this.sphere)

    const axisX = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 10, 10, 1), new THREE.MeshPhongMaterial({color: 0x0000ff}))
    axisX.rotation.set(0, 0, 0.5 * Math.PI)
    const axisY = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 10, 10, 1), new THREE.MeshPhongMaterial({color: 0xff0000}))
    axisY.rotation.set(0.5 * Math.PI, 0, 0)
    const axisZ = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 10, 10, 1), new THREE.MeshPhongMaterial({color: 0x00ff00}))
    this.scene.add(axisX)
    this.scene.add(axisY)
    this.scene.add(axisZ)

    this.arrow = []
    for (let i = 0; i < bit; i++) {
      const _arrow = new THREE.Group()
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5, 10, 1), new THREE.MeshPhongMaterial({color: 0x000000}))
      c.position.set(0, 0, 2.5)
      c.rotation.set(Math.PI * 0.5, 0, 0)
      _arrow.add(c)
      _arrow.lookAt(new THREE.Vector3(0, 1, 0))
      this.scene.add(_arrow)
      this.arrow.push(_arrow)
    }

    window.addEventListener('resize', () => {
      this._onResize()
    }, false)

    this.requestAnimationFrame = (...args) => {
      window.requestAnimationFrame(...args)
    }

    this.queue = []
    this._animate()
  }

  _onResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
  }

  _animate() {
    if (this.queue.length !== 0) {
      this.queue.shift()()
    }
    this.renderer.render(this.scene, this.camera)
    this.requestAnimationFrame(() => {
      this._animate()
    })
  }

  h(index) {
    for (let i = 0; i < step / 2; i++) {
      this.queue.push(() => {
        this.arrow[index].rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), Math.PI / step)
      })
    }
    let nowRotationX
    this.queue.push(() => {
      nowRotationX = this.arrow[index].rotation.x
    })
    for (let i = 0; i < step / 2; i++) {
      this.queue.push(() => {
        this.arrow[index].rotation.set(
          nowRotationX - nowRotationX * (i + 1) / step * 4,
          this.arrow[index].rotation.y,
          this.arrow[index].rotation.z
        )
      })
    }
    return new Promise((resolve) => {
      this.queue.push(resolve)
    })
  }

  x(index) {
    for (let i = 0; i < step; i++) {
      this.queue.push(() => {
        this.arrow[index].rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI / step)
      })
    }
    return new Promise((resolve) => {
      this.queue.push(resolve)
    })
  }

  y(index) {
    for (let i = 0; i < step; i++) {
      this.queue.push(() => {
        this.arrow[index].rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), Math.PI / step)
      })
    }
    return new Promise((resolve) => {
      this.queue.push(resolve)
    })
  }

  z(index) {
    for (let i = 0; i < step; i++) {
      this.queue.push(() => {
        this.arrow[index].rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI / step)
      })
    }
    return new Promise((resolve) => {
      this.queue.push(resolve)
    })
  }

  zero(index) {
    this.arrow[index].lookAt(new THREE.Vector3(0, 1, 0))
  }

  one(index) {
    this.arrow[index].lookAt(new THREE.Vector3(0, -1, 0))
  }

  init(x, y, z, index) {
    this.arrow[index].lookAt(new THREE.Vector3(x, z, y))
  }
}
