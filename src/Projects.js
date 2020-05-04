import React from 'react'
import { Div } from './lib/design'
import { Canvas, Mesh, Material, Text, SpotLight } from './lib/three.js'
import { MeshPhongMaterial, MeshNormalMaterial } from 'three'

import { projects } from './projects.data.js'

export const Projects = ({ target }) => (
  <Div fixed>
    <Canvas
      onWheel={({ e, camera, hovered }) => {
        setCamera(e, camera)
        setTarget(hovered, target)
      }}
      onResize={({ camera, renderer }) => setSize(camera, renderer)}
      onMouseMove={({ hovered }) => setTarget(hovered, target)}
      onClick={({ hovered }) => setTarget(hovered, target)}
    >
      {projects.map((p, i) => (
        <ProjectText key={`${p.name}-text`} project={p} i={i} />
      ))}
      <SpotLight position={{ x: 30, y: 100, z: 200 }} />
    </Canvas>
  </Div>
)

const ProjectText = ({ project, i, ...props }) => {
  const first = i === 0
  return (
    <Mesh
      hover={(mesh, camera) => {
        const inView = camera.position.z - mesh.position.z < 175
        if (!inView) {
          mesh.hoverable = false
          return
        }
        rotate(mesh, i)
        mesh.material = new MeshNormalMaterial()
        mesh.animateAfterHover = true
        mesh.hoverable = true
      }}
      afterHover={(mesh) => {
        mesh.material = new MeshPhongMaterial({ color: 0x5c5c5c })
      }}
      animate={(mesh) => {
        if (first || mesh.animateAfterHover) {
          rotate(mesh, i)
        }
      }}
      position={{ x: 0, y: 0, z: -50 - i * 200 }}
      name={project.name}
      img={project.img}
      content={project.content}
      {...props}
    >
      <Text center text={project.name} size={20} depth={10} />
      <Material type="phong" color={0x5c5c5c} />
    </Mesh>
  )
}

const setCamera = (e, camera) => {
  const scrollDown = e.deltaY > 0
  const inViewUp = camera.position.z < 75
  const inViewDown = camera.position.z > -1750

  if (scrollDown) {
    if (!inViewDown) return
    camera.position.z = camera.position.z - 4
  } else {
    if (!inViewUp) return
    camera.position.z = camera.position.z + 4
  }
}

const setTarget = (hovered, target) => {
  if (hovered && hovered.object.hoverable) {
    target.current = {
      name: hovered.object.name,
      content: hovered.object.content,
      img: hovered.object.img,
    }
  } else {
    target.current = undefined
  }
}

export const setSize = (camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const rotate = (mesh, i) => {
  mesh.rotation.x += 0.001
  mesh.rotation.y += 0.001
  mesh.rotation.z += Math.sin(0.001)
}
