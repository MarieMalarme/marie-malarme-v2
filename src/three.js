import React, { useEffect, useState, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh as SetMesh,
} from 'three'

export const Three = () => {
  return (
    <Canvas>
      <Mesh
        rotation={{ x: 1, y: 2, z: 3 }}
        position={{ x: 10, y: 20, z: 10 }}
        name="box"
      />
    </Canvas>
  )
}

export const Canvas = ({ children }) => {
  const [state, setState] = useState({})
  const ref = useRef(null)

  const scene = new Scene()
  const ratio = window.innerWidth / window.innerHeight
  const camera = new PerspectiveCamera(70, ratio, 0.1, 500)
  camera.position.set(0, 3, 75)
  camera.lookAt(scene.position)

  const renderer = new WebGLRenderer({ alpha: true })
  renderer.setClearAlpha(0)
  renderer.setSize(window.innerWidth, window.innerHeight)

  const animate = () => {
    requestAnimationFrame(animate)
    const target = scene.children.find((c) => c.name === 'box')
    target.rotation.x += 0.01
    target.rotation.y += 0.01
    renderer.render(scene, camera)
  }

  children = Array.isArray(children) ? children : [children]
  const childrenUpdated = children.map((child) => ({
    ...child,
    props: { ...child.props, canvasProps: { scene, state, setState } },
  }))

  useEffect(() => {
    animate()
    ref.current.appendChild(renderer.domElement)
  }, [])


  return <div ref={ref}>{childrenUpdated}</div>
}

const boxGeometry = new BoxGeometry(15, 15, 15)
const normalMaterial = new MeshNormalMaterial()

const coords = { x: 0, y: 0, z: 0 }

export const Mesh = ({
  canvasProps,
  geometry,
  material,
  position = coords,
  rotation = coords,
  ...props
}) => {
  const geo = geometry || boxGeometry
  const mat = material || normalMaterial
  const shape = new SetMesh(geo, mat)
  const { x: px, y: py, z: pz } = position
  const { x: rx, y: ry, z: rz } = rotation
  shape.position.set(px, py, pz)
  shape.rotation.set(rx, ry, rz)

  const { scene, setState, state } = canvasProps
  const mesh = Object.assign(shape, props)
  scene.add(mesh)

  useEffect(() => {
    setState({ meshes: { ...state.meshes, [mesh.name]: mesh } })
  }, [])

  useEffect(() => {
    scene.remove(mesh)
  }, [mesh, scene])

  return null
}
