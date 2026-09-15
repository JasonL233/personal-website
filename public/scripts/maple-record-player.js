import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// A small, code-built turntable: shared low-poly parts, a tiny label texture,
// and one batch of groove lines. No external model or environment-map download.
export function createRecordPlayer(parent,planet) {
  const group=new THREE.Group();
  const x=.95,z=.35;
  const baseExtraHeight=.12;
  group.scale.setScalar(.34);
  group.position.set(x,planet.height(x,z)+.012,z);
  group.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),planet.normal(x,z).clone());
  group.translateY(baseExtraHeight*.34);
  group.rotateY(-.18);parent.add(group);
  const geometries=new Set(),materials=new Set();
  const ownGeometry=g=>{geometries.add(g);return g;};
  const surface=(color,roughness=.6,metalness=0)=>{
    const m=new THREE.MeshStandardMaterial({color,roughness,metalness});materials.add(m);return m;
  };
  const wood=surface(0x815039,.58),deck=surface(0x96938b,.38,.38);
  const black=surface(0x20201e,.55),silver=surface(0xa9aaa4,.26,.65);
  const vinyl=surface(0x111315,.48,.75);
  const cube=ownGeometry(new THREE.BoxGeometry(1,1,1));
  const cylinder=ownGeometry(new THREE.CylinderGeometry(1,1,1,48));
  const batches=new Map(),dummy=new THREE.Object3D();
  function part(geometry,material,position,scale,rotation=[0,0,0]){
    const key=`${geometry.uuid}/${material.uuid}`;
    if(!batches.has(key))batches.set(key,{geometry,material,matrices:[]});
    dummy.position.set(...position);dummy.scale.set(...scale);dummy.rotation.set(...rotation);dummy.updateMatrix();
    batches.get(key).matrices.push(dummy.matrix.clone());
  }
  const box=(material,p,s,r)=>part(cube,material,p,s,r);
  const drum=(material,p,radius,height,rotation)=>part(cylinder,material,p,[radius,height,radius],rotation);
  // Walnut-colored plinth, satin deck and four isolation feet.
  box(wood,[0,.2-baseExtraHeight/2,0],[2.12,.24+baseExtraHeight,1.55]);
  box(black,[0,.325,0],[1.99,.016,1.42]);
  box(deck,[0,.34,0],[1.92,.018,1.35]);
  for(const a of [-.8,.8])for(const b of [-.55,.55])drum(black,[a,.07-baseExtraHeight,b],.095,.1);
  drum(silver,[-.22,.385,-.04],.71,.072);
  drum(black,[-.22,.426,-.04],.695,.015);

  const record=new THREE.Group();record.position.set(-.22,.443,-.04);group.add(record);
  const disc=new THREE.Mesh(cylinder,vinyl);disc.scale.set(.69,.018,.69);disc.castShadow=disc.receiveShadow=true;record.add(disc);
  const groovePoints=[];
  for(let ring=0;ring<30;ring++){
    const r=.25+ring*.014;
    for(let i=0;i<128;i++){
      const a=i/128*Math.PI*2,b=(i+1)/128*Math.PI*2;
      groovePoints.push(new THREE.Vector3(Math.cos(a)*r,.0105,Math.sin(a)*r),new THREE.Vector3(Math.cos(b)*r,.0105,Math.sin(b)*r));
    }
  }
  const grooveMaterial=new THREE.LineBasicMaterial({color:0xaaa397,transparent:true,opacity:.15,depthWrite:false});materials.add(grooveMaterial);
  record.add(new THREE.LineSegments(ownGeometry(new THREE.BufferGeometry().setFromPoints(groovePoints)),grooveMaterial));
  const labelCanvas=document.createElement('canvas');labelCanvas.width=labelCanvas.height=256;
  const ctx=labelCanvas.getContext('2d');
  ctx.fillStyle='#ad4835';ctx.fillRect(0,0,256,256);
  ctx.strokeStyle='#e8c58e';ctx.lineWidth=2;ctx.beginPath();ctx.arc(128,128,113,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#f6e7c9';ctx.textAlign='center';ctx.font='19px Georgia';ctx.fillText('MAPLE SESSIONS',128,70);
  ctx.font='12px sans-serif';ctx.fillText('SIDE A',128,184);ctx.fillText('33⅓ RPM',128,204);
  // A small maple emblem instead of copying the reference's branding.
  ctx.beginPath();[[128,91],[140,116],[157,105],[154,126],[178,129],[150,145],[154,158],[131,151],[130,169],[125,169],[125,151],[103,158],[106,145],[79,129],[102,126],[99,105],[117,116]].forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.closePath();ctx.fill();
  const labelTexture=new THREE.CanvasTexture(labelCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;
  const labelMaterial=new THREE.MeshStandardMaterial({map:labelTexture,roughness:.8});materials.add(labelMaterial);
  const label=new THREE.Mesh(ownGeometry(new THREE.CircleGeometry(.215,48)),labelMaterial);label.rotation.x=-Math.PI/2;label.position.y=.013;record.add(label);
  drum(silver,[-.22,.48,-.04],.014,.07);

  // Tonearm pivot, rear counterweight, curved arm and red-tipped cartridge.
  drum(black,[.74,.4,-.46],.125,.1);
  drum(silver,[.74,.5,-.46],.038,.15);
  drum(black,[.74,.565,-.61],.075,.16,[Math.PI/2,0,0]);
  const armPath=new THREE.CatmullRomCurve3([
    new THREE.Vector3(.74,.56,-.49),new THREE.Vector3(.75,.56,-.12),
    new THREE.Vector3(.69,.54,.23),new THREE.Vector3(.4,.49,.44),
  ]);
  const arm=new THREE.Mesh(ownGeometry(new THREE.TubeGeometry(armPath,20,.019,8,false)),silver);arm.castShadow=true;group.add(arm);
  box(black,[.39,.484,.45],[.105,.055,.18],[0,.8,0]);
  const red=surface(0x9b3d2f,.65);box(red,[.345,.453,.49],[.073,.018,.08],[0,.8,0]);
  drum(silver,[-.85,.366,.57],.078,.038);drum(black,[-.85,.388,.57],.045,.01);
  drum(silver,[.86,.366,.57],.073,.038);
  box(black,[.86,.388,.57],[.065,.008,.01]);
  for(let i=0;i<2;i++)box(black,[-.66+i*.12,.358,.57],[.07,.02,.04]);
  // Transparent raised dust cover with restrained edge highlights.
  const lid=new THREE.Group();lid.position.set(0,.345,-.72);lid.rotation.x=-Math.PI/4;group.add(lid);
  const lidGeometry=ownGeometry(new THREE.BoxGeometry(2.06,.024,1.45));
  const glass=new THREE.MeshStandardMaterial({color:0xc7c4b8,transparent:true,opacity:.1,roughness:.2,metalness:.1,depthWrite:false});materials.add(glass);
  const cover=new THREE.Mesh(lidGeometry,glass);cover.position.set(0,.09,.725);lid.add(cover);
  const edgeMaterial=new THREE.LineBasicMaterial({color:0x87877e,transparent:true,opacity:.42});materials.add(edgeMaterial);
  const edges=new THREE.LineSegments(ownGeometry(new THREE.EdgesGeometry(lidGeometry)),edgeMaterial);edges.position.copy(cover.position);lid.add(edges);
  box(black,[-.72,.34,-.71],[.18,.075,.08]);box(black,[.72,.34,-.71],[.18,.075,.08]);
  for(const {geometry,material,matrices} of batches.values()){
    const mesh=new THREE.InstancedMesh(geometry,material,matrices.length);
    matrices.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
  }
  return {
    update(delta,animated){if(animated)record.rotation.y=(record.rotation.y-delta*.65)%(Math.PI*2);},
    dispose(){group.traverse(object=>{if(object.isInstancedMesh)object.dispose();});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());labelTexture.dispose();parent.remove(group);},
  };
}
