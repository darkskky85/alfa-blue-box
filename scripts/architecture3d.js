/* ALFA BLUE BOX — original procedural interactive WebGL architecture.
   Fully self-contained: no external 3D framework, fonts, CDN or API. */
(()=>{
'use strict';
function initScene(canvas){if(!canvas)return;
let gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'default',premultipliedAlpha:false});
if(!gl){canvas.style.pointerEvents="none";return;}
const vert=`attribute vec3 aPos;attribute vec3 aNormal;attribute vec3 aColor;attribute float aTag;uniform mat4 uModel;uniform mat4 uVP;uniform float uPhase;uniform float uLine;uniform float uBuild;varying vec3 vColor;varying float vFog;varying float vY;varying float vTag;void main(){vec4 wp=uModel*vec4(aPos,1.);gl_Position=uVP*wp;vec3 norm=normalize(mat3(uModel)*aNormal);float diffuse=max(dot(norm,normalize(vec3(-0.7,1.65,1.2))),0.);float halfLambert=.36 + diffuse*.76;float spec=pow(max(dot(reflect(-normalize(vec3(-0.7,1.65,1.2)),norm),normalize(vec3(0.55,0.6,1.0))),0.),28.);vec3 material=mix(aColor,vec3(.26,.29,.30),aTag*(1.0-uPhase)*0.96);vColor=material*halfLambert + vec3(.97,.80,.50)*spec*aTag*.32;vY=wp.y;vTag=aTag;vFog=clamp((gl_Position.w-7.0)/26.0,0.0,1.0);}`;
const frag=`precision mediump float;varying vec3 vColor;varying float vFog;varying float vY;varying float vTag;uniform float uLine;uniform float uBuild;uniform float uSequence;void main(){if(uSequence>.5){float progress=clamp(uBuild,0.,1.);float limitY = progress<.70 ? (-.16 + smoothstep(0.,.70,progress)*9.5) : (9.34 + smoothstep(.70,1.,progress)*5.0);if(vY>limitY)discard;if(vTag>.5 && progress<.73+.19*clamp(vY/9.3,0.,1.))discard;}vec3 c=mix(vColor,vec3(.13,.14,.14),vFog*0.28);c=pow(c,vec3(.91));gl_FragColor=vec4(c,1.0);}`;
function shader(type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn('3D shader: ',gl.getShaderInfoLog(s));return null}return s}
const vs=shader(gl.VERTEX_SHADER,vert),fs=shader(gl.FRAGMENT_SHADER,frag);if(!vs||!fs)return;const prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){console.warn(gl.getProgramInfoLog(prog));return;}gl.useProgram(prog);
const loc={pos:gl.getAttribLocation(prog,'aPos'),normal:gl.getAttribLocation(prog,'aNormal'),color:gl.getAttribLocation(prog,'aColor'),tag:gl.getAttribLocation(prog,'aTag'),model:gl.getUniformLocation(prog,'uModel'),vp:gl.getUniformLocation(prog,'uVP'),phase:gl.getUniformLocation(prog,'uPhase'),line:gl.getUniformLocation(prog,'uLine'),build:gl.getUniformLocation(prog,'uBuild'),sequence:gl.getUniformLocation(prog,'uSequence')};
const vertices=[],wireVertices=[];
const steel=[.44,.47,.49], concrete=[.60,.57,.52], pale=[.78,.74,.67], dark=[.085,.095,.105], roof=[.45,.44,.40], glass=[.08,.22,.31], glassAlt=[.12,.34,.40], gold=[.88,.57,.16], warm=[.98,.78,.42], grid=[.20,.25,.29], safety=[.96,.54,.12];
function vertex(buffer,x,y,z,n,c,tag=0){buffer.push(x,y,z,n[0],n[1],n[2],c[0],c[1],c[2],tag)}
function box(cx,cy,cz,w,h,d,c,tag=0){let x0=cx-w/2,x1=cx+w/2,y0=cy-h/2,y1=cy+h/2,z0=cz-d/2,z1=cz+d/2;
 const faces=[[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[0,0,1]],[[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],[0,0,-1]],[[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[1,0,0]],[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],[-1,0,0]],[[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],[0,1,0]],[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[0,-1,0]]];
 for(const f of faces){for(const i of [0,1,2,0,2,3]){const v=f[i];vertex(vertices,v[0],v[1],v[2],f[4],c,tag)}}}
function line(a,b,c){vertex(wireVertices,...a,[0,1,0],c);vertex(wireVertices,...b,[0,1,0],c)}
function outlineBox(cx,cy,cz,w,h,d,c){let x0=cx-w/2,x1=cx+w/2,y0=cy-h/2,y1=cy+h/2,z0=cz-d/2,z1=cz+d/2;let pts=[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]];for(let [a,b] of [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]])line(pts[a],pts[b],c)}
// Civil engineering: exposed concrete frame and construction equipment, not a completed glass tower.
const H=.88, floors=10, W=6.05, D=4.25;
box(0,-.67,0,11.7,.27,8.0,[.25,.23,.20]);box(0,-.50,0,10.9,.16,7.3,concrete);
// Concrete pile caps, grade beams, and starter bars.
for(let ix=-1;ix<=1;ix++)for(let iz=-1;iz<=1;iz++){let x=ix*W/2,z=iz*D/2;box(x,-.20,z,.92,.52,.92,concrete);for(let dx of [-.14,.14])for(let dz of [-.14,.14])box(x+dx,.20,z+dz,.035,.55,.035,steel)}
for(let i=-1;i<=1;i++){box(i*W/2,-.31,0,.47,.37,D+.4,concrete);box(0,-.31,i*D/2,W+.4,.37,.44,concrete)}
// Construction floors: very visible gaps, real columns, exposed spandrels and partial masonry.
for(let k=0;k<floors;k++){
 let y=k*H, slab=y+.10;
 box(0,slab,0,W+.15,.17,D+.15,k%3===0?pale:concrete);
 // Floor joints and form-work rails.
 box(0,slab-.14,D/2+.015,W+.20,.07,.12,steel);
 for(let ix=-1;ix<=1;ix++)for(let iz=-1;iz<=1;iz++){
   let x=ix*W/2,z=iz*D/2;
   box(x,y+H/2,z,.29,H,.29,k%4===0?pale:concrete);
   if(k>=floors-2)for(let dx of [-.065,.065])box(x+dx,y+H+.23,z,.027,.45,.028,steel);
 }
 for(let ix=-1;ix<=1;ix++)box(ix*W/2,y+H-.12,0,.22,.25,D+.2,concrete);
 for(let iz=-1;iz<=1;iz++)box(0,y+H-.12,iz*D/2,W+.2,.25,.20,concrete);
 // Safety edge guardrails in bright construction orange.
 if(k>=2){for(let z of [-D/2-.20,D/2+.20]){
    for(let ix=-1;ix<=1;ix++)box(ix*W/2,slab+.41,z,.06,.69,.07,safety);
    box(0,slab+.62,z,W+.3,.055,.06,safety);
   }}
}
// Partial glazing is restricted to 3 lower-floor bays: the remainder remains exposed and unfinished.
for(let k=1;k<=3;k++)for(let j=0;j<4;j++){
 let x=-W/2+(j+.5)*W/6, y=(k+.5)*H;
 box(x,y,D/2+.07,W/6-.12,H-.16,.04,(j+k)%2?glass:glassAlt,1);
 box(x-W/12,y,D/2+.12,.045,H-.12,.045,steel,1);
}
// Safety net mesh / scaffolding on exposed right-hand facade.
let scaffoldX=W/2+.54;
for(let x of [scaffoldX,scaffoldX+.62])for(let z=-D/2-.15;z<=D/2+.3;z+=1.05){
 box(x,3.5,z,.052,7.1,.052,steel);
 for(let k=0;k<=7;k++)box(x,k*.89,z,.06,.065,.09,pale)
}
for(let y=0;y<7.2;y+=.89){
 for(let z=-D/2;z<=D/2;z+=1.05){box(scaffoldX+.3,y,z,.7,.05,.065,steel);line([scaffoldX,y,z],[scaffoldX+.62,y+.84,z+1.05],safety)}
 box(scaffoldX+.3,y,0,.70,.055,D+.55,pale)
}
// Site objects: stacks of concrete blocks, temporary container and excavation barriers.
box(-4.6,.1,2.0,1.6,.85,1.05,[.31,.35,.33]);for(let z of [1.65,2.0,2.35])box(-4.6,.64,z,1.3,.045,.045,gold);
for(let i=0;i<10;i++){let x=-5.1+i*.6;box(x,-.31,3.1,.5,.50,.18,i%2?safety:pale)}
for(let i=0;i<7;i++)box(4.0+(i%3)*.29,-.2,-2+(Math.floor(i/3))*.36,.25,.35,.28,concrete);
// Distinct yellow structural lattice crane.
const craneX=4.3,craneZ=-2.85,craneTop=11.3;
for(let y=0;y<craneTop;y+=.75){for(let xx of [-.23,.23])for(let zz of [-.23,.23])box(craneX+xx,y+.375,craneZ+zz,.055,.75,.055,gold);for(let zz of [-.23,.23]){line([craneX-.23,y,craneZ+zz],[craneX+.23,y+.75,craneZ+zz],warm);line([craneX+.23,y,craneZ+zz],[craneX-.23,y+.75,craneZ+zz],warm)}}
box(craneX,craneTop,craneZ,.8,.26,.8,warm);box(craneX-1.1,craneTop+.20,craneZ,7,.095,.12,gold);box(craneX+2.5,craneTop+.20,craneZ,2.5,.095,.12,gold);
for(let i=0;i<14;i++){let x=craneX-4.5+i*.53;line([x,craneTop+.25,craneZ],[x+.265,craneTop+.58,craneZ],warm);line([x+.265,craneTop+.58,craneZ],[x+.53,craneTop+.25,craneZ],warm)}
line([craneX,craneTop+1.9,craneZ],[craneX-4.5,craneTop+.26,craneZ],pale);line([craneX,craneTop+1.9,craneZ],[craneX+3.75,craneTop+.26,craneZ],pale);
box(craneX,craneTop+1.0,craneZ,.1,1.7,.1,gold);line([craneX-2.9,craneTop+.25,craneZ],[craneX-2.9,6.1,craneZ],warm);box(craneX-2.9,5.95,craneZ,.18,.28,.18,safety);
// Survey grid, not a futuristic sci-fi ring.
for(let i=-12;i<=12;i++){let c=i%3===0?[.23,.26,.26]:[.12,.15,.17];line([-12,-.76,i],[12,-.76,i],c);line([i,-.76,-12],[i,-.76,12],c)}
function makeBuffer(list){let buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(list),gl.STATIC_DRAW);return{buf,count:list.length/10}}
const faceBuffer=makeBuffer(vertices),lineBuffer=makeBuffer(wireVertices);
const perspective=(fovy,aspect,near,far)=>{let f=1/Math.tan(fovy/2),nf=1/(near-far);return[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]};
const lookAt=(eye,center,up)=>{let z=[eye[0]-center[0],eye[1]-center[1],eye[2]-center[2]],len=Math.hypot(...z);z=z.map(a=>a/len);let x=[up[1]*z[2]-up[2]*z[1],up[2]*z[0]-up[0]*z[2],up[0]*z[1]-up[1]*z[0]];len=Math.hypot(...x);x=x.map(a=>a/len);let y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x[0]*eye[0]-x[1]*eye[1]-x[2]*eye[2],-y[0]*eye[0]-y[1]*eye[1]-y[2]*eye[2],-z[0]*eye[0]-z[1]*eye[1]-z[2]*eye[2],1]};
const multiply=(a,b)=>{let out=new Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){out[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3]}return out};
const rotateY=a=>{let c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]};
function bindBuffer(data){gl.bindBuffer(gl.ARRAY_BUFFER,data.buf);const stride=40;for(let [attr,size,offset] of [[loc.pos,3,0],[loc.normal,3,12],[loc.color,3,24],[loc.tag,1,36]]){if(attr<0)continue;gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,size,gl.FLOAT,false,stride,offset)}}
gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(0,0,0,0);
let phase=1,targetPhase=1,rotation=-.48,rotationTarget=-.48,tiltX=0,targetTiltX=0,mouseDown=false,startX=0,startRotation=0,active=true,last=0;
const isSequence=canvas.dataset.architecture==='sequence';let buildProgress=isSequence?0:1,targetBuild=buildProgress;const controller={setPhase:p=>{targetPhase=p==='finish'?1:.16},setProgress:p=>{targetBuild=Math.min(1,Math.max(0,p))}};if(isSequence){window.ABBSequence=controller}else{window.ABBScene=controller}
function resize(){const b=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.65),w=Math.max(1,Math.floor(b.width*dpr)),h=Math.max(1,Math.floor(b.height*dpr));if(w!==canvas.width||h!==canvas.height){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
function frame(ts){requestAnimationFrame(frame);if(!active||document.hidden)return;if(ts-last<28)return;last=ts;resize();phase+=(targetPhase-phase)*.055;buildProgress+=(targetBuild-buildProgress)*.17;rotation+=(rotationTarget-rotation)*.055;tiltX+=(targetTiltX-tiltX)*.045;
const auto=Math.sin(ts*.00016)*.055;let view=lookAt([14.6*Math.cos(tiltX),9.4,18],isSequence?[0,4.9,0]:[0,5.1,0],[0,1,0]);let proj=perspective(Math.PI/4.3,canvas.width/canvas.height,.1,85);let vp=multiply(proj,view);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(prog);gl.uniformMatrix4fv(loc.model,false,new Float32Array(rotateY(rotation+auto)));gl.uniformMatrix4fv(loc.vp,false,new Float32Array(vp));gl.uniform1f(loc.phase,isSequence?Math.max(.2,(buildProgress-.56)*2.7):phase);gl.uniform1f(loc.build,buildProgress);gl.uniform1f(loc.sequence,isSequence?1:0);gl.uniform1f(loc.line,0);bindBuffer(faceBuffer);gl.drawArrays(gl.TRIANGLES,0,faceBuffer.count);gl.uniform1f(loc.line,1);bindBuffer(lineBuffer);gl.drawArrays(gl.LINES,0,lineBuffer.count);canvas.parentElement.classList.add("has-webgl");
}
let reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!reduced)requestAnimationFrame(frame);else{requestAnimationFrame(frame)}
const sc=canvas.parentElement;sc.addEventListener('pointermove',e=>{const box=sc.getBoundingClientRect(),ratio=(e.clientX-box.left)/box.width-.5;targetTiltX=ratio*.25;if(mouseDown){rotationTarget=startRotation+(e.clientX-startX)*.008}});sc.addEventListener('pointerdown',e=>{mouseDown=true;startX=e.clientX;startRotation=rotationTarget;try{sc.setPointerCapture(e.pointerId)}catch{}});sc.addEventListener('pointerup',()=>{mouseDown=false});sc.addEventListener('pointercancel',()=>{mouseDown=false});sc.addEventListener('pointerleave',()=>{targetTiltX=0});
const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting},{threshold:0});observer.observe(sc);window.addEventListener('resize',resize,{passive:true});
}
for(const canvas of document.querySelectorAll('canvas[data-architecture]'))initScene(canvas);
})();
