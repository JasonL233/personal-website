import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Screen-space trails cross the full sky, with scene depth keeping every
// foreground object in front of them, including a tree dragged into their path.
export function createMeteorShower(scene) {
  const geometry=new THREE.PlaneGeometry(1,1);
  const viewport={value:new THREE.Vector2(1,1)};
  const vertexShader=`varying vec2 vUv;
    uniform vec2 uHead;uniform vec2 uDirection;uniform vec2 uViewport;uniform float uLength;
    void main(){
      vUv=uv;
      vec2 side=vec2(-uDirection.y,uDirection.x);
      vec2 offset=(position.x-.44)*uLength*uDirection+position.y*8.0*side;
      gl_Position=vec4(uHead+offset*2.0/uViewport,.999999,1.0);
    }`;
  const fragmentShader=`varying vec2 vUv;uniform float uOpacity;uniform vec3 uColor;
    void main(){
      float width=mix(.018,.12,vUv.x);
      float trail=pow(vUv.x,1.8)*exp(-pow((vUv.y-.5)/width,2.0));
      float head=exp(-pow((vUv.x-.94)/.04,2.0)-pow((vUv.y-.5)/.22,2.0));
      float alpha=max(trail*.55,head)*uOpacity*(1.0-smoothstep(.95,1.0,vUv.x));
      gl_FragColor=vec4(uColor,alpha);
      #include <colorspace_fragment>
    }`;
  const meteors=Array.from({length:3},()=>{
    const material=new THREE.ShaderMaterial({
      uniforms:{uOpacity:{value:0},uColor:{value:new THREE.Color(0xffedda)},
        uHead:{value:new THREE.Vector2()},uDirection:{value:new THREE.Vector2()},
        uViewport:viewport,uLength:{value:80}},
      vertexShader,fragmentShader,transparent:true,depthWrite:false,depthTest:true,
    });
    const mesh=new THREE.Mesh(geometry,material);mesh.visible=false;mesh.frustumCulled=false;mesh.renderOrder=-100;scene.add(mesh);
    return {mesh,material,start:Infinity,duration:3,from:new THREE.Vector2(),to:new THREE.Vector2()};
  });
  let skyHeight=1,canvasTop=0;
  let elapsed=0,nextShower=1.5;
  const skyY=fraction=>1-2*(skyHeight*fraction-canvasTop)/viewport.value.y;

  function launch() {
    const count=2+Math.floor(Math.random()*2);
    meteors.forEach((meteor,index)=>{
      meteor.start=index<count?elapsed+index*.5+Math.random()*.18:Infinity;
      meteor.duration=2.8+Math.random()*.6;
      const lane=index*.018+Math.random()*.012;
      meteor.from.set(1.12,skyY(.27+lane));
      meteor.to.set(-1.12,skyY(.63+lane));
      meteor.material.uniforms.uDirection.value.copy(meteor.to).sub(meteor.from).multiply(viewport.value).normalize();
      meteor.material.uniforms.uLength.value=THREE.MathUtils.clamp(viewport.value.x*.085,45,100)*(.8+Math.random()*.25);
    });
  }

  return {
    resize(width,height,visibleHeight=height,top=0){
      viewport.value.set(width,height);
      // Match the wide upper-right → lower-left sky diagonal independently of
      // the globe's radius, camera position, or tree host's height.
      skyHeight=visibleHeight;canvasTop=top;
      meteors.forEach(({mesh})=>{mesh.visible=false;});
      meteors.forEach(meteor=>{meteor.start=Infinity;});
    },
    update(delta,enabled,nightLevel) {
      if(!enabled){meteors.forEach(({mesh})=>{mesh.visible=false;});return;}
      elapsed+=delta;
      if(elapsed>=nextShower){launch();nextShower=elapsed+10;}
      meteors.forEach(meteor=>{
        const age=elapsed-meteor.start,progress=age/meteor.duration;
        meteor.mesh.visible=progress>=0&&progress<1;
        if(!meteor.mesh.visible)return;
        meteor.material.uniforms.uHead.value.lerpVectors(meteor.from,meteor.to,progress);
        const fadeIn=THREE.MathUtils.smoothstep(progress,0,.08);
        const fadeOut=1-THREE.MathUtils.smoothstep(progress,.86,1);
        meteor.material.uniforms.uOpacity.value=fadeIn*fadeOut*THREE.MathUtils.lerp(.5,.82,nightLevel);
      });
    },
    dispose(){geometry.dispose();meteors.forEach(({mesh,material})=>{scene.remove(mesh);material.dispose();});},
  };
}
