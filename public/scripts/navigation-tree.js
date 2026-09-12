// Pinned browser-native CDN import, outside the initial Next.js route bundle.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { createPlanet } from './maple-planet.js?v=continents-1';

export function createNavigationTree(host, { colors, onHover, onNavigate, onProject, onError }) {
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const canvas = renderer.domElement;
  host.appendChild(canvas);
  const surface = host.parentElement;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(36,1,.1,60);
  const planet = createPlanet(scene);
  // The attachment carries the tree, fallen leaves and ripples together.
  // Its initial frame preserves the original tree silhouette and root placement.
  const attachment = new THREE.Group(); scene.add(attachment);
  const model = new THREE.Group(); attachment.add(model);
  const initialNormal = planet.center.clone().negate().normalize();
  const anchorNormal = initialNormal.clone(), worldNormal = initialNormal.clone();
  const anchorRotation = new THREE.Quaternion();
  function updateAttachment() {
    worldNormal.copy(anchorNormal).applyQuaternion(planet.group.quaternion);
    attachment.position.copy(worldNormal).multiplyScalar(planet.radius).add(planet.center);
    anchorRotation.setFromUnitVectors(initialNormal,anchorNormal);
    attachment.quaternion.copy(planet.group.quaternion).multiply(anchorRotation);
    attachment.updateMatrixWorld(true);
  }
  let renderWidth=1,renderHeight=1,bleedLeft=0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const geometries = new Set(), materials = new Set(), treePickables = [];
  const geometry = value => { geometries.add(value);return value; };
  const material = value => { materials.add(value);return value; };
  let frame = 0, lastFrame = 0, visible = false, disposed = false, failed = false, active = null, firstView = true;
  let burstStart = -Infinity, burstOrigin = 2, pointerDown = null, suppressClick = false;
  const centers = [[-1.35,3.65,.2],[1.35,3.72,.1],[0,4.87,-.3]];
  const levels = [0,0,0], groups = [], foliage = [];
  scene.add(new THREE.HemisphereLight(0xfff3d8,0x897261,1.9));
  // Turn the tree beneath a fixed, warm light in the viewer's upper right.
  const sun = new THREE.DirectionalLight(0xffe3af,3.2);sun.position.set(6,9,5);sun.target.position.set(0,2.5,0);
  sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera,{left:-5,right:5,top:7,bottom:-4,near:.5,far:24});
  sun.shadow.normalBias=.035;sun.shadow.bias=-.0002;
  scene.add(sun,sun.target);
  const fill = new THREE.DirectionalLight(0xffffff,.75);fill.position.set(-4,4,-4);scene.add(fill);
  const bark = material(new THREE.MeshStandardMaterial({color:0x72513a,roughness:1,flatShading:true}));
  const cylinder = geometry(new THREE.CylinderGeometry(.55,1,1,7));
  const axisY=new THREE.Vector3(0,1,0),axisZ=new THREE.Vector3(0,0,1),surfaceNormal=new THREE.Vector3();
  function placeBranch(mesh,a,b,radius){
    const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);
    mesh.position.copy(start).add(end).multiplyScalar(.5);mesh.scale.set(radius,start.distanceTo(end),radius);
    mesh.quaternion.setFromUnitVectors(axisY,end.sub(start).normalize());
  }
  function branch(a,b,radius,parent=model) {
    const mesh = new THREE.Mesh(cylinder,bark);mesh.castShadow=mesh.receiveShadow=true;
    placeBranch(mesh,a,b,radius);parent.add(mesh);treePickables.push(mesh);return mesh;
  }
  branch([0,0,0],[-.15,1.45,0],.23);
  branch([-.15,1.45,0],[.1,2.65,-.05],.16);
  branch([.1,2.65,-.05],[-.08,3.65,-.1],.11);
  branch([-.08,3.65,-.1],[0,4.8,-.3],.06);
  for (let i=0;i<7;i++) { const a=i*Math.PI*2/7,x=Math.cos(a)*.6,z=Math.sin(a)*.6;branch([x,planet.height(x,z)+.02,z],[0,.36,0],.07); }
  function settle(object,x,z,angle=0){
    object.position.set(x,planet.height(x,z)+.018,z);
    surfaceNormal.copy(planet.normal(x,z));
    object.quaternion.setFromUnitVectors(axisZ,surfaceNormal);object.rotateZ(angle);
  }
  const outline = [[0,-.48],[.05,-.15],[.38,-.21],[.3,-.02],[.62,.19],[.43,.25],[.46,.49],[.22,.4],[.24,.69],[.1,.59],[0,.98],[-.1,.59],[-.24,.69],[-.22,.4],[-.46,.49],[-.43,.25],[-.62,.19],[-.3,-.02],[-.38,-.21],[-.05,-.15]];
  const shape = new THREE.Shape();outline.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
  const leafGeometry = geometry(new THREE.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:false,steps:1}));leafGeometry.translate(0,-.16,0);
  let seed=31;
  function random() { seed=(seed*1664525+1013904223)>>>0;return seed/4294967296; }
  const dummy = new THREE.Object3D();
  centers.forEach(([x,y,z],index)=>{
    const group = new THREE.Group();group.position.set(x,y,z);model.add(group);groups.push(group);
    const joint=[x*.55,y-.65,z*.6];
    const stem=branch([0,index===2?2.9:1.9,0],joint,.1);stem.userData.index=index;
    branch(joint,[x,y,z],.06);
    for(let i=0;i<6;i++) { const a=i*Math.PI/3;branch([0,-.65,0],[Math.cos(a)*.76,.17,Math.sin(a)*.56],.025,group); }
    const leafMaterial=material(new THREE.MeshStandardMaterial({color:colors[index],roughness:.9,flatShading:true,side:THREE.DoubleSide}));foliage.push(leafMaterial);
    const leaves=new THREE.InstancedMesh(leafGeometry,leafMaterial,180);leaves.userData.index=index;leaves.castShadow=leaves.receiveShadow=true;
    for(let i=0;i<180;i++) {
      const a=random()*Math.PI*2,v=random()*2-1,r=Math.cbrt(random()),ring=Math.sqrt(1-v*v);
      dummy.position.set(Math.cos(a)*ring*r*1.14,v*r*.87,Math.sin(a)*ring*r*.88);
      dummy.rotation.set((random()-.5)*1.9,random()*Math.PI*2,(random()-.5)*2);
      dummy.scale.setScalar(.3+random()*.2);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix);
      leaves.setColorAt(i,new THREE.Color().setHSL(.07+random()*.025,.13+random()*.2,.65+random()*.3));
    }
    group.add(leaves);treePickables.push(leaves);
  });
  const rippleUniforms={uTime:{value:0},uImpacts:{value:Array.from({length:7},()=>new THREE.Vector4(0,0,-1000000,0))}};
  const rippleMaterial=material(new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,uniforms:rippleUniforms,
    vertexShader:`varying vec2 vGround;
      void main(){vGround=position.xz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`uniform float uTime;uniform vec4 uImpacts[7];varying vec2 vGround;
      void main(){
        float alpha=max(0.0,floor((1.0-length(vGround)/2.8)*9.0))*.016;
        for(int i=0;i<7;i++){
          float age=uTime-uImpacts[i].z;
          if(age>=0.0&&age<1.8){
            float d=distance(vGround,uImpacts[i].xy),radius=age*.48;
            float ring=exp(-pow((d-radius)*38.0,2.0));
            float echo=exp(-pow((d-max(0.0,radius-.14))*32.0,2.0))*.35;
            alpha+=(ring+echo)*smoothstep(0.0,.12,age)*pow(1.0-age/1.8,1.5)*uImpacts[i].w;
          }
        }
        gl_FragColor=vec4(.63,.4,.18,min(alpha,.5));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  const rippleGeometry=geometry(new THREE.PlaneGeometry(8,8,40,40));rippleGeometry.rotateX(-Math.PI/2);
  const groundVertices=rippleGeometry.attributes.position;
  for(let i=0;i<groundVertices.count;i++)groundVertices.setY(i,planet.height(groundVertices.getX(i),groundVertices.getZ(i))+.012);
  rippleGeometry.computeVertexNormals();
  const ripples=new THREE.Mesh(rippleGeometry,rippleMaterial);attachment.add(ripples);
  const resting=new THREE.InstancedMesh(leafGeometry,foliage[1],24);resting.frustumCulled=false;
  for(let i=0;i<24;i++) {
    const a=random()*Math.PI*2,r=.6+random()*2;
    const leaf={x:Math.cos(a)*r,z:Math.sin(a)*r,angle:a,size:.1+random()*.1};
    settle(dummy,leaf.x,leaf.z,a);dummy.scale.setScalar(leaf.size);dummy.updateMatrix();resting.setMatrixAt(i,dummy.matrix);
  }
  model.add(resting);
  const fallingMaterial=material(new THREE.MeshStandardMaterial({color:0xd18839,side:THREE.DoubleSide,roughness:1,transparent:true}));
  const falling=new THREE.InstancedMesh(leafGeometry,fallingMaterial,7);falling.visible=false;falling.castShadow=true;falling.frustumCulled=false;model.add(falling);
  const drifters=Array.from({length:7},()=>({x:(random()-.5)*1.6,z:(random()-.5)*1.4,delay:random()*.45,size:.12+random()*.09,phase:random()*6.28,landed:false,landX:0,landZ:0}));
  // Brief showers and impact rings settle, then rendering stops until the next interaction.
  function shower(index,time) {
    burstOrigin=index;burstStart=time;drifters.forEach(leaf=>{leaf.landed=false;});fallingMaterial.color.set(colors[index]);requestRender();
  }
  function highlight(index) {
    if(index===active)return;
    active=index;onHover(index);
    if(index!==null && !reducedMotion.matches)shower(index,performance.now());
    canvas.style.cursor=pointerDown?.dragged?'grabbing':index===null?'grab':'pointer';requestRender();
  }
  const turn = new THREE.Quaternion(), cameraRight = new THREE.Vector3(), cameraUp = new THREE.Vector3();
  function rotate(amount,vertical=0,moveTree=false){
    cameraRight.setFromMatrixColumn(camera.matrixWorld,0);
    cameraUp.setFromMatrixColumn(camera.matrixWorld,1);
    turn.setFromAxisAngle(cameraUp,amount).multiply(new THREE.Quaternion().setFromAxisAngle(cameraRight,vertical));
    if(moveTree){
      worldNormal.copy(anchorNormal).applyQuaternion(planet.group.quaternion).applyQuaternion(turn);
      anchorNormal.copy(worldNormal).applyQuaternion(planet.group.quaternion.clone().invert()).normalize();
    }else planet.group.quaternion.premultiply(turn).normalize();
    updateAttachment();highlight(null);requestRender();
  }
  function reset(){
    planet.group.quaternion.identity();anchorNormal.copy(initialNormal);
    updateAttachment();highlight(null);requestRender();
  }
  const target=new THREE.Vector3(0,2.8,0),projected=new THREE.Vector3();
  function positionCamera() {
    const distance=Math.max(12.8,6.25/(2*Math.tan(THREE.MathUtils.degToRad(18))*camera.aspect));
    camera.position.set(.45,4.15,distance);camera.lookAt(target);camera.updateMatrixWorld();
  }
  function render(time) {
    frame=0;if(disposed||failed||!visible||document.hidden)return;
    if(lastFrame && time-lastFrame<1000/30){requestRender();return;}
    const delta=lastFrame?Math.min((time-lastFrame)/1000,.08):1/30;lastFrame=time;
    let changing=false;
    groups.forEach((group,index)=>{
      const desired=index===active?1:0;
      levels[index]=reducedMotion.matches?desired:THREE.MathUtils.damp(levels[index],desired,9,delta);
      if(Math.abs(levels[index]-desired)<.002)levels[index]=desired;else changing=true;
      group.scale.setScalar(1+levels[index]*.055);group.position.y=centers[index][1]+levels[index]*.11;
      foliage[index].emissive.set(0xffb766);foliage[index].emissiveIntensity=levels[index]*.2;
    });
    const age=(time-burstStart)/1000;
    falling.visible=!reducedMotion.matches && age>=0 && age<5.8;
    if(falling.visible) {
      const center=centers[burstOrigin];
      fallingMaterial.opacity=Math.min(1,age*4,(5.8-age)*3);
      drifters.forEach((leaf,index)=>{
        const t=Math.max(0,age-leaf.delay);
        const x=center[0]+leaf.x+Math.sin(t*1.6+leaf.phase)*.3,z=center[2]+leaf.z+Math.cos(t+leaf.phase)*.2;
        const groundY=planet.height(x,z)+.018;
        const y=center[1]-.3-t*1.23;
        if(!leaf.landed&&age>=leaf.delay&&y<=groundY){
          leaf.landed=true;leaf.landX=x;leaf.landZ=z;
          rippleUniforms.uImpacts.value[index].set(x,z,time/1000,.48);
        }
        if(leaf.landed)settle(dummy,leaf.landX,leaf.landZ,leaf.phase);
        else{dummy.position.set(x,y,z);dummy.rotation.set(Math.sin(t*2+leaf.phase)*.6,t*.7,Math.sin(t*1.4+leaf.phase)*.5);}
        dummy.scale.setScalar(age<leaf.delay?0:leaf.size);dummy.updateMatrix();falling.setMatrixAt(index,dummy.matrix);
      });
      falling.instanceMatrix.needsUpdate=true;
    }
    rippleUniforms.uTime.value=time/1000;
    const wavesActive=!reducedMotion.matches&&rippleUniforms.uImpacts.value.some(impact=>time/1000-impact.z>=0&&time/1000-impact.z<1.8);

    updateAttachment();
    // Keep the sun direction fixed as the tree moves, and keep its shadow in range.
    sun.position.copy(attachment.position).add(new THREE.Vector3(6,9,5));
    sun.target.position.copy(attachment.position).add(new THREE.Vector3(0,2.5,0));
    scene.updateMatrixWorld(true);
    onProject(groups.map(group=>{
      projected.set(0,.05,0);group.localToWorld(projected);
      const distance=camera.position.distanceTo(projected);
      labelRay.set(camera.position,projected.clone().sub(camera.position).normalize());
      const obstruction=labelRay.intersectSphere(globeSphere,labelIntersection);
      const occluded=!!obstruction&&camera.position.distanceTo(obstruction)<distance-.05;
      projected.project(camera);
      const shown=!occluded&&projected.z>-1&&projected.z<1&&Math.abs(projected.x)<1&&Math.abs(projected.y)<1;
      return [(projected.x*.5+.5)*renderWidth-bleedLeft,(-projected.y*.5+.5)*renderHeight,shown];
    }));
    renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);
    if(changing||falling.visible||wavesActive)requestRender();
  }
  function requestRender(){if(!disposed&&!failed&&!frame&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
  function wake(){cancelAnimationFrame(frame);frame=0;lastFrame=0;requestRender();}
  function resize(){
    const width=host.clientWidth,height=host.clientHeight;if(!width||!height)return;
    const rect=host.getBoundingClientRect();
    bleedLeft=Math.max(0,rect.left);
    renderWidth=width+bleedLeft+Math.max(0,document.documentElement.clientWidth-rect.right);
    renderHeight=height+Math.max(0,window.innerHeight-rect.bottom);
    camera.clearViewOffset();camera.aspect=width/height;positionCamera();
    // Expand the drawing area without moving or shrinking the original tree.
    camera.setViewOffset(width,height,-bleedLeft,0,renderWidth,renderHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5,Math.sqrt(2500000/(renderWidth*renderHeight))));
    renderer.setSize(renderWidth,renderHeight,false);
    Object.assign(canvas.style,{position:'absolute',left:`${-bleedLeft}px`,width:`${renderWidth}px`,height:`${renderHeight}px`});
    requestRender();
  }
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  const globeSphere=new THREE.Sphere(planet.center,planet.radius);
  const labelRay=new THREE.Ray(),labelIntersection=new THREE.Vector3();
  function setRay(event){
    const rect=canvas.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    scene.updateMatrixWorld(true);raycaster.setFromCamera(pointer,camera);
  }
  function treeHit(event){
    setRay(event);
    const candidate=raycaster.intersectObjects(treePickables,false)[0];
    if(!candidate)return null;
    const ground=raycaster.ray.intersectSphere(globeSphere,new THREE.Vector3());
    return ground&&camera.position.distanceTo(ground)<candidate.distance-.03?null:candidate;
  }
  function hit(event){return treeHit(event)?.object.userData.index??null;}
  function dragNormal(event){
    setRay(event);
    const point=new THREE.Vector3();
    // Outside the silhouette, continue along its tangent instead of jumping.
    if(!raycaster.ray.intersectSphere(globeSphere,point))raycaster.ray.closestPointToPoint(planet.center,point);
    return point.sub(planet.center).normalize();
  }
  function move(event){
    if(pointerDown?.id===event.pointerId){
      const press=pointerDown,dx=event.clientX-press.lastX,dy=event.clientY-press.lastY;
      press.lastX=event.clientX;press.lastY=event.clientY;
      if(press.dragged||Math.hypot(event.clientX-press.x,event.clientY-press.y)>7){
        press.dragged=true;suppressClick=true;surface.dataset.dragging='true';
        if(!surface.hasPointerCapture(event.pointerId))surface.setPointerCapture(event.pointerId);
        if(press.mode==='tree'){
          turn.setFromUnitVectors(press.surfaceNormal,dragNormal({clientX:event.clientX+press.offsetX,clientY:event.clientY+press.offsetY}));
          worldNormal.copy(press.anchor).applyQuaternion(turn);
          anchorNormal.copy(worldNormal).applyQuaternion(planet.group.quaternion.clone().invert()).normalize();
          updateAttachment();highlight(null);requestRender();
        }else rotate(dx*.004,dy*.004);
        canvas.style.cursor='grabbing';
      }
      return;
    }
    if(event.pointerType==='mouse'&&!event.target.closest('[data-tree-link]'))highlight(hit(event));
  }
  function down(event){
    if(event.target.closest('button'))return;
    if(event.isPrimary&&event.button===0){
      suppressClick=false;
      const link=!!event.target.closest('[data-tree-link]');
      const mode=link||treeHit(event)?'tree':'planet';
      const rect=canvas.getBoundingClientRect(),root=attachment.position.clone().project(camera);
      const rootX=rect.left+(root.x*.5+.5)*rect.width,rootY=rect.top+(-root.y*.5+.5)*rect.height;
      pointerDown={x:event.clientX,y:event.clientY,lastX:event.clientX,lastY:event.clientY,id:event.pointerId,
        dragged:false,link,mode,offsetX:rootX-event.clientX,offsetY:rootY-event.clientY,
        surfaceNormal:dragNormal({clientX:rootX,clientY:rootY}),anchor:worldNormal.clone()};
    }
  }
  function up(event){
    if(pointerDown?.id!==event.pointerId)return;
    const press=pointerDown,moved=Math.hypot(event.clientX-press.x,event.clientY-press.y);
    cancel(event);
    if(press.dragged||moved>10||press.link)return;
    const index=hit(event);if(index!==null)onNavigate(index);
  }
  function cancel(event){
    if(event&&surface.hasPointerCapture(event.pointerId))surface.releasePointerCapture(event.pointerId);
    pointerDown=null;delete surface.dataset.dragging;canvas.style.cursor=active===null?'grab':'pointer';
  }
  function click(event){if(suppressClick&&event.detail!==0){event.preventDefault();event.stopPropagation();suppressClick=false;}}
  function dragStart(event){event.preventDefault();}
  function leave(){if(!pointerDown)highlight(null);}
  function lost(event){event.preventDefault();failed=true;cancelAnimationFrame(frame);frame=0;onError();}
  const handlers={pointermove:move,pointerdown:down,pointerup:up,pointercancel:cancel,pointerleave:leave,dragstart:dragStart};
  Object.entries(handlers).forEach(([event,handler])=>surface.addEventListener(event,handler));
  surface.addEventListener('click',click,true);canvas.addEventListener('webglcontextlost',lost);
  window.addEventListener('resize',resize);
  document.addEventListener('visibilitychange',wake);reducedMotion.addEventListener('change',wake);
  const resizer=new ResizeObserver(resize);resizer.observe(host);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&firstView){firstView=false;if(!reducedMotion.matches)shower(2,performance.now());}wake();});observer.observe(host);
  resize();
  return {highlight,rotate,reset,dispose(){disposed=true;cancelAnimationFrame(frame);resizer.disconnect();observer.disconnect();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',wake);reducedMotion.removeEventListener('change',wake);Object.entries(handlers).forEach(([event,handler])=>surface.removeEventListener(event,handler));surface.removeEventListener('click',click,true);canvas.removeEventListener('webglcontextlost',lost);sun.shadow.dispose();planet.dispose();scene.traverse(object=>{if(object.isInstancedMesh)object.dispose();});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.forceContextLoss();canvas.remove();}};
}
