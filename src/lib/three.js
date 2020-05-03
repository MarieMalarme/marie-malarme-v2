import React, { Fragment, useEffect, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  PlaneGeometry,
  SphereGeometry,
  TextGeometry,
  FontLoader,
  DoubleSide,
  MeshNormalMaterial,
  MeshBasicMaterial,
  MeshPhongMaterial,
  TextureLoader,
  Raycaster,
  Vector2,
  Mesh as SetMesh,
  SpotLight as SetSpotLight,
} from 'three'
import { Div, Component } from './design.js'
import { flatten, generateId, findByProp } from './toolbox.js'
import { events } from './events.js'
import Murmure from '../fonts/Murmure.json'

export const Canvas = ({ children = [], ...props }) => {
  const mouseCoords = useRef()

  const meshes = useRef()
  const ref = useRef()

  const scene = new Scene()
  const ratio = window.innerWidth / window.innerHeight
  const camera = new PerspectiveCamera(70, ratio, 1, 600)
  camera.position.set(0, 0, 75)
  camera.lookAt(scene.position)

  const renderer = new WebGLRenderer({ alpha: true })
  renderer.setClearAlpha(0)
  renderer.setSize(window.innerWidth, window.innerHeight)

  const raycaster = new Raycaster()

  const mouse = new Vector2()

  const updatedChildren = flatten(children).map((child) => ({
    ...child,
    props: { ...child.props, meshes },
  }))

  const animateScene = () => {
    requestAnimationFrame(animateScene)

    if (mouseCoords.current) {
      mouse.x = (mouseCoords.current.x / window.innerWidth) * 2 - 1
      mouse.y = -(mouseCoords.current.y / window.innerHeight) * 2 + 1
    }

    animate({ meshes })
    hover({ meshes, raycaster, mouse, camera, scene })

    renderer.render(scene, camera)
  }

  const hasChildren = children.length

  useEffect(() => {
    if (!hasChildren) return
    Object.values(meshes.current).map((m) => scene.add(m))
    animateScene()
    ref.current.appendChild(renderer.domElement)

    const listeners = Object.entries(events(props))

    if (listeners.length) {
      listeners.map(([event, func]) => {
        window.addEventListener(event, (e) => {
          raycaster.setFromCamera(mouse, camera)

          const hovered = raycaster
            .intersectObjects(scene.children, true)
            .filter((c) => c.object.hover)[0]

          func({ e, camera, scene, renderer, hovered })
        })
        return listeners
      })
    }
  })

  if (!hasChildren) return <EmptyCanvas />

  return (
    <CanvasWrapper mouseCoords={mouseCoords} reference={ref}>
      {updatedChildren}
    </CanvasWrapper>
  )
}

const CanvasWrapper = ({ mouseCoords, reference, children }) => (
  <div
    onMouseMove={(e) => {
      mouseCoords.current = {
        x: e.nativeEvent.clientX,
        y: e.nativeEvent.clientY,
      }
    }}
    ref={reference}
  >
    {children}
  </div>
)

const EmptyCanvasWrapper = Component.lh28.pa100.flex.flexColumn.alignCenter.justifyCenter.bgGrey1.white.div()
const EmptyCanvas = ({ ref }) => (
  <EmptyCanvasWrapper>
    <Div>Nothing yet in your canvas !</Div>
    <Div>To start, add a component {`<Mesh />`}</Div>
  </EmptyCanvasWrapper>
)

const animate = ({ meshes }) => {
  const meshesToAnimate = findByProp('animate', meshes.current)

  if (meshesToAnimate.length) {
    meshesToAnimate.map((m) => {
      const { animate } = m
      animate(m)
      return m
    })
  }
}

const hover = ({ meshes, raycaster, mouse, camera, scene }) => {
  const meshesToHover = findByProp('hover', meshes.current)
  if (!meshesToHover.length) return
  if (!mouse.x && !mouse.y) return

  raycaster.setFromCamera(mouse, camera)

  const hovered = raycaster
    .intersectObjects(scene.children, true)
    .filter((c) => c.object.hover)[0]

  const meshesAfterHover = findByProp('afterHover', meshes.current)

  if (hovered) {
    meshesToHover.map((m) => {
      const { hover } = m
      hover(hovered.object, camera)
      return m
    })
  } else if (meshesAfterHover.length) {
    meshesAfterHover.map((m) => {
      const { afterHover } = m
      afterHover(m)
      return m
    })
  }
}

const coords = { x: 0, y: 0, z: 0 }

export const Mesh = ({
  meshes,
  name,
  position = coords,
  rotation = coords,
  shadow = true,
  center,
  animate,
  children = [],
  ...props
}) => {
  const meshProps = useRef({})

  const updatedChildren = flatten(children).map((child) => ({
    ...child,
    props: { ...child.props, meshProps },
  }))

  useEffect(() => {
    const geo = meshProps.current.geometry || new BoxGeometry()
    const mat = meshProps.current.material || new MeshNormalMaterial()

    const mesh = new SetMesh(geo, mat)
    mesh.name = name || `mesh-${generateId()}`

    const { x: px, y: py, z: pz } = position
    const { x: rx, y: ry, z: rz } = rotation
    mesh.position.set(px, py, pz)
    mesh.rotation.set(rx, ry, rz)

    mesh.receiveShadow = shadow

    meshes.current = {
      ...meshes.current,
      [mesh.name]: Object.assign(mesh, props, { animate }),
    }
  })

  return <Fragment>{updatedChildren}</Fragment>
}

export const Geometry = ({
  meshProps,
  type,
  width = 25,
  height = 25,
  depth = 25,
  ...props
}) => {
  // different types of geometry
  const plane = new PlaneGeometry(width, height, depth)
  const box = new BoxGeometry(width, height, depth)
  const sphere = new SphereGeometry(width, height, depth)

  const geometry =
    (type === 'plane' && plane) ||
    (type === 'cube' && box) ||
    (type === 'sphere' && sphere) ||
    type

  meshProps.current = {
    ...meshProps.current,
    geometry: Object.assign(geometry, props),
  }
  return null
}

export const Material = ({
  meshProps,
  type = 'normal',
  color = 'lightblue',
  texture,
  ...props
}) => {
  // different types of material
  const normalMaterial = new MeshNormalMaterial()
  const basicMaterial = new MeshBasicMaterial({ color, side: DoubleSide })
  const phongMaterial = new MeshPhongMaterial({ color, side: DoubleSide })

  const material =
    (type === 'normal' && normalMaterial) ||
    (type === 'basic' && basicMaterial) ||
    (type === 'phong' && phongMaterial) ||
    type

  if (texture) {
    const loader = new TextureLoader().load(texture)
    material.map = loader
  }

  meshProps.current = {
    ...meshProps.current,
    material: Object.assign(material, props),
  }
  return null
}

export const Text = ({
  meshProps,
  text = 'kikoo',
  size = 10,
  depth = 5,
  typeface = Murmure,
  center,
  ...props
}) => {
  const loader = new FontLoader()
  const font = loader.parse(typeface)
  const geometry = new TextGeometry(text, {
    font,
    size,
    height: depth,
    ...props,
  })

  center && geometry.center()

  meshProps.current = {
    ...meshProps.current,
    geometry,
  }
  return null
}

export const SpotLight = ({
  meshes,
  name,
  color = 'white',
  position = coords,
  ...props
}) => {
  const { x, y, z } = position
  const spotLight = new SetSpotLight(color)
  spotLight.position.set(x, y, z)
  spotLight.name = name || `spotlight-${generateId()}`
  spotLight.castShadow = true

  meshes.current = {
    ...meshes.current,
    [spotLight.name]: Object.assign(spotLight, props),
  }
  return null
}
