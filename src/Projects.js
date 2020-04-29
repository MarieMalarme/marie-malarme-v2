import React, { Fragment } from 'react'
import { Div } from './lib/design'
import {
  Canvas,
  Mesh,
  Geometry,
  Material,
  Text,
  SpotLight,
} from './lib/three.js'
import { MeshPhongMaterial, MeshNormalMaterial } from 'three'
import { random } from './lib/toolbox.js'

const projects = [
  { name: 'Zone 01', img: '01-thumbnail.jpg' },
  { name: 'Atelier Rusch', img: 'atelier-rusch-thumbnailImage.png' },
  { name: 'Mikme', img: 'mikme-thumbnailImage.png' },
  { name: 'La Gaité nomade', img: 'gaite-nomade-thumbnailImage.jpg' },
  { name: 'Opéra comique', img: 'opera-comique-modaleIntroImage.jpg' },
  { name: 'Créations & Patrimoines', img: 'c-p-thumbnailImage.jpg' },
  { name: 'The Peacock Society', img: 'peacock-thumbnailImage.jpg' },
  { name: 'Plastik', img: 'plastik-thumbnailImage.jpg' },
  { name: 'Kikoo Docteur', img: 'kikoo-docteur-thumbnailImage.jpg' },
  { name: 'Laissez-nous loler!', img: 'laissez-nous-loler-thumbnailImage.jpg' },
]

const onWheel = ({ e, camera }) => {
  const scrollDown = e.deltaY > 0
  if (scrollDown) {
    camera.position.z = camera.position.z - 0.5
  } else {
    camera.position.z = camera.position.z + 0.5
  }
}

export const resize = (camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

export const Projects = () => {
  return (
    <Div fixed>
      <Canvas
        onWheel={({ e, camera }) => onWheel({ e, camera })}
        onResize={({ camera, renderer }) => resize(camera, renderer)}
      >
        {projects.map((p, i) => (
          <Fragment key={p.name}>
            <ProjectText key={`${p.name}-text`} project={p} i={i} />
            <ProjectImage key={`${p.name}-img`} project={p} i={i} />
          </Fragment>
        ))}
        <SpotLight position={{ x: 30, y: 0, z: 150 }} />
      </Canvas>
    </Div>
  )
}

const ProjectText = ({ project, i, ...props }) => (
  <Mesh
    hover={(mesh) => {
      rotate(mesh, i)
      mesh.material = new MeshPhongMaterial({ color: 0x5c5c5c })
    }}
    afterHover={(mesh) => {
      mesh.material = new MeshNormalMaterial()
    }}
    animate={(mesh) => {
      rotate(mesh, i)
    }}
    position={{ x: 0, y: 0, z: 5 - i * 150 }}
    rotation={{ x: random(0, 150), y: random(0, 150), z: 0 }}
    {...props}
  >
    <Text center text={project.name} size={20} depth={10} />
    <Material type="normal" />
  </Mesh>
)

const ProjectImage = ({ project, i, ...props }) => {
  const url = `https://raw.githubusercontent.com/MarieMalarme/marie-malarme/master/public/img/${project.img}`
  return (
    <Mesh
      name={project.name}
      position={{
        x: random(-75, 75),
        y: random(-45, 45),
        z: 5 - i * 100,
      }}
      {...props}
    >
      <Geometry type="plane" width={42} />
      <Material texture={url} type="phong" />
    </Mesh>
  )
}

const rotate = (mesh, i) => {
  if (i % 2 === 0) {
    mesh.rotation.x += 0.001
    mesh.rotation.y += 0.001
  } else {
    mesh.rotation.x += 0.001
    mesh.rotation.y += 0.001
  }
}
