import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { coastlines } from './continent-outlines.js';

export function createPlanet(scene) {
  const radius = 19;
  const center = new THREE.Vector3(6, -Math.sqrt(radius * radius - 72), -6);
  const group = new THREE.Group(); group.position.copy(center); scene.add(group);
  const geometry = new THREE.SphereGeometry(radius, 96, 64);
  const material = new THREE.MeshStandardMaterial({ color: 0xf0e9dd, roughness: 1, metalness: 0 });
  // Keep the paper-colored globe neutral under the tree's warm sun, while
  // retaining soft directional shading and real cast shadows.
  material.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
      float daylight = dot(outgoingLight, vec3(.2126, .7152, .0722));
      outgoingLight = diffuseColor.rgb * clamp(.94 + daylight * .04, .94, 1.025);
      #include <opaque_fragment>`);
  };
  const globe = new THREE.Mesh(geometry, material);
  globe.receiveShadow = true; group.add(globe);
  const lineGeometries = [];
  const gridMaterial = new THREE.LineBasicMaterial({ color: 0xa68f75, transparent: true, opacity: .09, depthWrite: false });
  const coastMaterial = new THREE.LineBasicMaterial({ color: 0x9d856b, transparent: true, opacity: .43, depthWrite: false });
  function lines(points, lineMaterial) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    lineGeometries.push(geometry); group.add(new THREE.LineSegments(geometry, lineMaterial));
  }
  const r = radius + .035, grid = [], outlines = [];
  function point(longitude, latitude) {
    // Present the Americas on the near shoulder at the initial orientation.
    const a = THREE.MathUtils.degToRad(longitude + 205), b = THREE.MathUtils.degToRad(latitude);
    return new THREE.Vector3(r * Math.cos(b) * Math.cos(a), r * Math.sin(b), r * Math.cos(b) * Math.sin(a));
  }
  for (const latitude of [-60, -30, 0, 30, 60]) {
    for (let i=0;i<180;i++) grid.push(point(i*2,latitude),point((i+1)*2,latitude));
  }
  for (let longitude=0;longitude<360;longitude+=45) {
    for (let latitude=-90;latitude<90;latitude+=2) grid.push(point(longitude,latitude),point(longitude,latitude+2));
  }
  coastlines.forEach(arc => {
    for (let i=1;i<arc.length;i++) {
      const a=point(...arc[i-1]), b=point(...arc[i]);
      // Subdivide long stretches so the outline follows the sphere, not a chord.
      const steps=Math.max(1,Math.ceil(a.angleTo(b)/.025));
      let previous=a;
      for(let j=1;j<=steps;j++) {
        const next=a.clone().lerp(b,j/steps).normalize().multiplyScalar(r);
        outlines.push(previous,next);previous=next;
      }
    }
  });
  lines(grid,gridMaterial); lines(outlines,coastMaterial);
  function height(x,z) { return center.y + Math.sqrt(Math.max(0,radius*radius-(x-center.x)**2-(z-center.z)**2)); }
  const normal = new THREE.Vector3();
  return {
    group, globe, radius, center, height,
    normal(x,z) { return normal.set(x-center.x,height(x,z)-center.y,z-center.z).normalize(); },
    dispose() { geometry.dispose();material.dispose();lineGeometries.forEach(g=>g.dispose());gridMaterial.dispose();coastMaterial.dispose(); },
  };
}
