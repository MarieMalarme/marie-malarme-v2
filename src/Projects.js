import React, { memo } from 'react'
import { Div } from './lib/design'
import {
  Canvas,
  Mesh,
  Group,
  Geometry,
  Material,
  Text,
  Light,
} from './lib/three.js'

import { projects } from './projects.data.js'

export const Projects = memo(({ setProject }) => (
  <Div fixed>
    <Canvas
      onWheel={({ e, camera, hovered, scene }) => {
        setHoveredProject(setProject, hovered)
        setCamera(e, camera, scene)
        scene.children.forEach((c) => (c.visible = true))
      }}
      onResize={({ camera, renderer }) => setSize(camera, renderer)}
      onMouseMove={({ hovered }) => {
        setHoveredProject(setProject, hovered)
      }}
      onClick={({ hovered }) => {
        setHoveredProject(setProject, hovered, true)
      }}
    >
      {projects.map((p, i) => (
        <ProjectMesh key={`${p.name}-text`} project={p} i={i} />
      ))}
      {lights.map(({ hue, x, y, z }, i) => (
        <Light
          type="directional"
          position={{ x, y, z }}
          color={`hsl(${hue * 360}, 100%, 50%)`}
          name={`light-${i}`}
          key={`light-${i}`}
        />
      ))}
    </Canvas>
  </Div>
))

const ProjectMesh = ({ project, i, ...props }) => {
  const first = i === 0
  const { name } = project

  return (
    <Group
      position={{ x: 0, y: 0, z: -50 - i * 200 }}
      rotation={(first && { x: 0.5, y: 0.5, z: 0.5 }) || { x: 0, y: 0, z: 0 }}
      animate={(mesh) => (first || mesh.animateAfterHover) && rotate(mesh)}
      name={name}
      {...props}
    >
      <Cache name={name} {...props} />
      <Name name={name} {...props} />
    </Group>
  )
}

const Name = ({ name, ...props }) => (
  <Mesh
    hover={(mesh, camera, scene) => {
      hover(mesh, camera, scene)
    }}
    afterHover={(mesh, scene) => {
      toggleVisible(mesh, scene, true)
    }}
    {...props}
  >
    <Text center text={name} size={20} depth={10} />
    <Material type="phong" />
  </Mesh>
)

const Cache = ({ name, ...props }) => (
  <Mesh
    hover={(mesh, camera, scene) => {
      hover(mesh, camera, scene)
    }}
    afterHover={(mesh, scene) => {
      toggleVisible(mesh, scene, true)
    }}
    visible={false}
    {...props}
  >
    <Geometry width={name.length * 8} type="plane" />
    <Material type="basic" />
  </Mesh>
)

const toggleVisible = (mesh, scene, toggle) => {
  const otherMeshes = scene.children.filter(
    (c) =>
      mesh &&
      mesh.parent &&
      c.uuid !== mesh.parent.uuid &&
      !c.type.includes('Light'),
  )
  otherMeshes.forEach((o) => (o.visible = toggle))
}

const hover = (mesh, camera, scene) => {
  const inView = camera.position.z - mesh.parent.position.z < 200
  if (!inView) {
    mesh.hoverable = false
    return
  }
  rotate(mesh.parent)
  mesh.parent.animateAfterHover = true
  mesh.hoverable = true
  toggleVisible(mesh, scene, false)
}

const setCamera = (e, camera, scene) => {
  const scrollDown = e.deltaY > 0
  const inViewUp = camera.position.z < 75
  const inViewDown = camera.position.z > -1750

  const sceneLights = scene.children.filter((c) => c.type.includes('Light'))

  sceneLights.forEach((light, i) => {
    const hue = lights[i].hue + count
    const saturation = 1
    const luminosity = 0.5
    light.color.setHSL(hue, saturation, luminosity)
  })
  count += 0.003

  if (scrollDown) {
    if (!inViewDown) return
    camera.position.z = camera.position.z - 4
  } else {
    if (!inViewUp) return
    camera.position.z = camera.position.z + 4
  }
}

const setHoveredProject = (setProject, hovered, modale) => {
  if (hovered && hovered.object.hoverable) {
    setProject({
      name: hovered.object.parent.name,
      modale,
    })
  } else {
    setProject(null)
  }
}

export const setSize = (camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const rotate = (mesh) => {
  mesh.rotation.x += 0.0005
  mesh.rotation.z += Math.sin(0.0005)
}

const lights = [
  { hue: 0.5, x: 0, y: 100, z: 100 },
  { hue: 0.3, x: 200, y: 200, z: 25 },
  { hue: 0, x: 100, y: 0, z: 50 },
  { hue: 0.75, x: -100, y: -100, z: 75 },
]

let count = 0
