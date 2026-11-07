// Karakter low-poly, kontrol (PC + Android), kamera third person, movement + collision
G.human=o=>{
 const B=BABYLON,sc=G.sc,r=new B.TransformNode('h',sc);
 const pv=(x,y)=>{const t=new B.TransformNode('p',sc);t.parent=r;t.position.set(x,y,0);return t};
 const bx=(w,h,d,x,y,z,c,p)=>{const m=B.MeshBuilder.CreateBox('b',{width:w,height:h,depth:d},sc);m.position.set(x,y,z);m.material=G.M(c);m.parent=p||r;return m};
 const lL=pv(-.14,.85),lR=pv(.14,.85),aL=pv(-.4,1.5),aR=pv(.4,1.5),lc=o.fem?o.skin:o.bot,ac=o.arm?o.top:o.skin;
 bx(.22,.85,.25,0,-.425,0,lc,lL);bx(.22,.85,.25,0,-.425,0,lc,lR);
 bx(.16,.6,.18,0,-.3,0,ac,aL);bx(.16,.6,.18,0,-.3,0,ac,aR);
 if(o.fem)bx(.64,.42,.38,0,.98,0,o.bot);
 bx(.6,.65,.3,0,1.2,0,o.top);
 const h=B.MeshBuilder.CreateSphere('hd',{diameter:.38,segments:4},sc);h.position.set(0,1.72,0);h.material=G.M(o.skin);h.parent=r;
 bx(.06,.06,.02,-.08,1.75,.18,'#111');bx(.06,.06,.02,.08,1.75,.18,'#111');
 bx(.42,.14,.42,0,1.9,-.01,o.hair);
 if(o.hs==1)bx(.42,.55,.1,0,1.65,-.2,o.hair);
 if(o.hs==2)bx(.2,.2,.2,0,2.03,-.08,o.hair);
 r.parts={lL,lR,aL,aR};return r};
G.anim=(r,t,s)=>{const p=r.parts,v=Math.sin(t*10)*s;p.lL.rotation.x=v;p.lR.rotation.x=-v;p.aL.rotation.x=-v;p.aR.rotation.x=v};
G.look=P=>({top:P.color,bot:P.g=='f'?'#b71c1c':'#1e3a8a',skin:'#e0ac69',hair:'#1b1b1b',hs:P.hair,fem:P.g=='f',arm:P.cl==1});
G.initPlayer=()=>{
 const B=BABYLON,sc=G.sc,P=G.S.p,col=B.MeshBuilder.CreateBox('pc',{size:.4},sc);
 col.isVisible=false;col.ellipsoid=new B.Vector3(.35,.9,.35);col.position.set(P.x,1,P.z);
 const h=G.me=G.human(G.look(P));h.parent=col;h.position.y=-.9;G.col=col;G.vy=0;G.stam=100;
 
 const cam=G.cam=new B.ArcRotateCamera('cam',-Math.PI/2,1.1,7,new B.Vector3(P.x,1.6,P.z),sc);
 cam.inputs.clear();cam.lowerRadiusLimit=1.5;cam.upperRadiusLimit=7;cam.minZ=.2;cam.maxZ=160;
 cam.checkCollisions=true;cam.collisionRadius=new B.Vector3(.4,.4,.4);sc.activeCamera=cam;
};
G.updPlayer=dt=>{
 const K=G.K,cam=G.cam,col=G.col;
 let x=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0)+(G.jx||0),z=(K.KeyW||K.ArrowUp?1:0)-(K.KeyS||K.ArrowDown?1:0)+(G.jz||0);
 if(G.dlgOpen)x=z=0;
 let l=Math.hypot(x,z);if(l>1){x/=l;z/=l;l=1}
 const run=(K.ShiftLeft||K.ShiftRight||G.runT)&&G.stam>3&&l>.1,sp=l*(run?6.5:3.4),a=cam.alpha;
 const mx=-Math.cos(a)*z-Math.sin(a)*x,mz=-Math.sin(a)*z+Math.cos(a)*x;
 G.vy-=22*dt;const py=col.position.y;
 col.moveWithCollisions(new BABYLON.Vector3(mx*sp*dt,G.vy*dt,mz*sp*dt));cam.target.copyFromFloats(col.position.x,col.position.y+.7,col.position.z);
 const gr=G.vy<=0&&col.position.y-py>G.vy*dt+1e-4;
 if(gr)G.vy=0;
 if((K.Space||G.jmp)&&gr&&!G.dlgOpen)G.vy=7.5;G.jmp=false;
 if(col.position.y<-5){col.position.set(0,1,-40);G.vy=0}
 if(l>.1){const t=Math.atan2(mx,mz),d=Math.atan2(Math.sin(t-G.me.rotation.y),Math.cos(t-G.me.rotation.y));G.me.rotation.y+=d*Math.min(1,dt*14);G.wt=(G.wt||0)+dt*(run?1.5:1);G.anim(G.me,G.wt,.9)}else G.anim(G.me,0,0);
 G.stam=Math.max(0,Math.min(100,G.stam+(run?-22:14)*dt));G.$('stamI').style.width=G.stam+'%';
};
