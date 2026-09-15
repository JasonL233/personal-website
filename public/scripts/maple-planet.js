import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { coastlines } from './continent-outlines.js';
import { CITY_TRANSFER_GLSL, geographicUV, sampleCityLight } from './city-light-field.mjs';

export function createPlanet(scene,onChange=()=>{}, { maxTextureSize = 8192, anisotropy = 1 } = {}) {
  const radius = 19;
  const center = new THREE.Vector3(6, -Math.sqrt(radius * radius - 72), -6);
  const group = new THREE.Group(); group.position.copy(center);
  // Tilt the geographic surface so inhabited latitudes remain visible in the cropped globe.
  group.rotation.x=-THREE.MathUtils.degToRad(20);scene.add(group);
  const geometry = new THREE.SphereGeometry(radius, 96, 64);
  const material = new THREE.MeshStandardMaterial({ color: 0xe5ded2, roughness: 1, metalness: 0 });
  let disposed=false;
  const nightReady={value:0};
  const nightFactor={value:document.documentElement.dataset.theme === 'dark' ? 1 : 0};
  let loadedMaps=0;
  function textureReady(texture){
    if(disposed){texture.dispose();return;}
    if(++loadedMaps===2)nightReady.value=1;
    onChange();
  }
  const loader=new THREE.TextureLoader();
  const nightTexture=loader.load(maxTextureSize >= 8192 ? '/images/earth/nasa-black-marble-2016-8k.jpg' : '/images/earth/nasa-black-marble-2016.jpg',textureReady);
  const landTexture=loader.load('/images/earth/coastline-landmask.png',textureReady);
  for(const texture of [nightTexture,landTexture]){
    texture.colorSpace=THREE.NoColorSpace;texture.wrapS=THREE.RepeatWrapping;
    texture.anisotropy=Math.min(anisotropy,4);
  }
  // Keep the paper-colored globe neutral under the tree's warm sun, while
  // retaining soft directional shading and real cast shadows.
  material.onBeforeCompile = shader => {
    shader.uniforms.uNightLights={value:nightTexture};shader.uniforms.uLandMask={value:landTexture};shader.uniforms.uNightReady=nightReady;shader.uniforms.uNightFactor=nightFactor;
    shader.vertexShader='varying vec3 vGlobeLocal;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvGlobeLocal=position;');
    shader.fragmentShader='uniform sampler2D uNightLights;uniform sampler2D uLandMask;uniform float uNightReady;uniform float uNightFactor;varying vec3 vGlobeLocal;\n'+shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
      float daylight = dot(outgoingLight, vec3(.2126, .7152, .0722));
      outgoingLight = diffuseColor.rgb * clamp(.88 + daylight * .09, .88, 1.14);
      vec3 globeNormal=normalize(vGlobeLocal);
      float longitude=atan(-globeNormal.z,globeNormal.x)+2.181661565;
      vec2 cityUv=vec2(fract(longitude/6.28318530718+.5),asin(clamp(globeNormal.y,-1.0,1.0))/3.14159265359+.5);
      float observed=texture2D(uNightLights,cityUv).r*uNightReady;
      float land=texture2D(uLandMask,cityUv).r;
      // Generalized coastlines omit real coastal settlements and islands.
      // Use their mask for the surface, never to erase observed lights.
      vec3 nightSurface=mix(vec3(.008,.014,.022),vec3(.018,.027,.037),land);
      outgoingLight=mix(outgoingLight,nightSurface*(.8+daylight*.12),uNightFactor);
      float city=${CITY_TRANSFER_GLSL};
      // Identical city emission in both themes; only the surface darkens.
      outgoingLight+=vec3(1.35,1.02,.62)*city;
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
    // Geographic longitude/latitude, with east to the right (negative Z).
    // Only the prime-meridian orientation changes; continent placement is unaltered.
    const a = THREE.MathUtils.degToRad(longitude - 125), b = THREE.MathUtils.degToRad(latitude);
    return new THREE.Vector3(r * Math.cos(b) * Math.cos(a), r * Math.sin(b), -r * Math.cos(b) * Math.sin(a));
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
  let lightPixels=null,lightWidth=0,lightHeight=0;
  const samplingImage=new Image();
  samplingImage.onload=()=>{
    if(disposed)return;
    const canvas=document.createElement('canvas');
    canvas.width=samplingImage.naturalWidth;canvas.height=samplingImage.naturalHeight;
    const context=canvas.getContext('2d',{willReadFrequently:true});
    if(!context)return;
    context.drawImage(samplingImage,0,0);
    lightWidth=canvas.width;lightHeight=canvas.height;
    lightPixels=context.getImageData(0,0,lightWidth,lightHeight).data;
    onChange();
  };
  samplingImage.src='/images/earth/city-light-sampling.png';
  const localPoint=new THREE.Vector3(),samplePoint=new THREE.Vector3();
  const tangent=new THREE.Vector3(),bitangent=new THREE.Vector3(),up=new THREE.Vector3();
  const inverse=new THREE.Matrix4(),cityCenter=new THREE.Vector3();
  function nearbyLight(worldPoint,result) {
    result.intensity=0;result.position.copy(worldPoint);
    if(!lightPixels)return result;
    inverse.copy(group.matrixWorld).invert();
    up.copy(worldPoint).sub(center).normalize();
    tangent.set(Math.abs(up.y)>.9?1:0,Math.abs(up.y)>.9?0:1,0).cross(up).normalize();
    bitangent.crossVectors(up,tangent);cityCenter.set(0,0,0);
    let weight=0,falloffSum=0,peak=0;
    // Search a tree-sized patch on the curved surface, including nearby cities.
    for(let x=-4;x<=4;x++)for(let z=-4;z<=4;z++){
      const distance=Math.hypot(x,z)*.3;
      if(distance>1.3)continue;
      samplePoint.copy(up).multiplyScalar(radius).addScaledVector(tangent,x*.3).addScaledVector(bitangent,z*.3).normalize().multiplyScalar(radius).add(center);
      localPoint.copy(samplePoint).applyMatrix4(inverse);
      const [u,v]=geographicUV(localPoint.x,localPoint.y,localPoint.z);
      const falloff=Math.exp(-distance*distance/1.1);
      const value=sampleCityLight(lightPixels,lightWidth,lightHeight,u,v)*falloff;
      falloffSum+=falloff;
      cityCenter.addScaledVector(samplePoint,value);weight+=value;peak=Math.max(peak,value);
    }
    if(weight>0){
      result.position.copy(cityCenter).divideScalar(weight).sub(center).normalize().multiplyScalar(radius+.28).add(center);
      result.intensity=peak*.2+(weight/falloffSum)*.8;
    }
    return result;
  }
  return {
    group, globe, radius, center, height,
    nearbyLight,
    setNightFactor(value) { nightFactor.value=value;gridMaterial.opacity=THREE.MathUtils.lerp(.09,.1,value);coastMaterial.color.set(value>.5?0x738593:0x9d856b);coastMaterial.opacity=THREE.MathUtils.lerp(.43,.26,value); },
    normal(x,z) { return normal.set(x-center.x,height(x,z)-center.y,z-center.z).normalize(); },
    dispose() { disposed=true;samplingImage.onload=null;lightPixels=null;nightTexture.dispose();landTexture.dispose();geometry.dispose();material.dispose();lineGeometries.forEach(g=>g.dispose());gridMaterial.dispose();coastMaterial.dispose(); },
  };
}
