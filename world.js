// Dunia sekolah: gedung, pintu, collision, zona
var G={_m:{},doors:[],rooms:[],areas:[],R:{},npcs:[]};
G.M=c=>G._m[c]||(G._m[c]=Object.assign(new BABYLON.StandardMaterial(c,G.sc),{diffuseColor:BABYLON.Color3.FromHexString(c),specularColor:BABYLON.Color3.Black()}));
G.box=(x,y,z,w,h,d,c,col)=>{const m=BABYLON.MeshBuilder.CreateBox('b',{width:w,height:h,depth:d},G.sc);m.position.set(x,y,z);m.material=G.M(c);m.checkCollisions=col!==false;m.freezeWorldMatrix();return m};
G.sign=(t,x,y,z,w,h)=>{const B=BABYLON,tx=new B.DynamicTexture('s',{width:512,height:128},G.sc),g=tx.getContext();g.fillStyle='#0d2b5c';g.fillRect(0,0,512,128);g.fillStyle='#fff';g.font='bold 54px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,256,66,490);tx.update();const m=B.MeshBuilder.CreatePlane('sg',{width:w,height:h},G.sc),s=new B.StandardMaterial('sm',G.sc);s.emissiveTexture=tx;s.disableLighting=true;s.backFaceCulling=false;m.material=s;m.position.set(x,y,z);return m};
G.seat=i=>[-8.4+i%3*1.4,-6+(i<3?-1.8:1.8)];
G.pt=(k,n)=>{if(k=='meja')return G.seat(n.si);const r=G.R[k];return[r.x1+Math.random()*(r.x2-r.x1),r.z1+Math.random()*(r.z2-r.z1)]};
// Ruangan dengan pintu di dinding selatan (bisa dibuka/tutup), atap disembunyikan saat pemain di dalam
G.room=(k,label,cx,cz,w,d,wc,rc)=>{
 const B=BABYLON,box=G.box,h=3.4,t=.3,z0=cz-d/2,dw=2.2,sw=(w-dw)/2;
 box(cx-w/2+sw/2,h/2,z0,sw,h,t,wc);box(cx+w/2-sw/2,h/2,z0,sw,h,t,wc);box(cx,h-.4,z0,dw,.8,t,wc);
 box(cx,h/2,cz+d/2,w,h,t,wc);box(cx-w/2,h/2,cz,t,h,d,wc);box(cx+w/2,h/2,cz,t,h,d,wc);
 const roof=box(cx,h+.15,cz,w+.6,.3,d+.6,rc,false);
 const piv=new B.TransformNode('pv',G.sc),dr=B.MeshBuilder.CreateBox('dr',{width:dw,height:h-.8,depth:.15},G.sc);
 piv.position.set(cx-dw/2,0,z0);dr.parent=piv;dr.position.set(dw/2,(h-.8)/2,0);dr.material=G.M('#5d4037');dr.checkCollisions=true;
 G.doors.push({piv,x:cx,z:z0,open:false});
 G.sign(label,cx,h+1,z0-.4,6,1.5);
 G.rooms.push({k,name:label,x1:cx-w/2,x2:cx+w/2,z1:cz-d/2,z2:cz+d/2,roof,on:true});
 G.R[k]={x1:cx-w/2+1.2,x2:cx+w/2-1.2,z1:cz-d/2+1.2,z2:cz+d/2-1.2};
};
G.build=()=>{
 const B=BABYLON,sc=G.sc,box=G.box,R=G.R,P=G.S.p;
 const g=B.MeshBuilder.CreateGround('g',{width:150,height:150},sc);g.material=G.M('#6bbf59');g.checkCollisions=true;g.freezeWorldMatrix();
 const flat=(x,z,w,d,c,y)=>box(x,y||.03,z,w,.06,d,c,false);
 // pagar + gerbang utama
 box(0,1.25,50,100,2.5,.4,'#9e9e9e');box(-50,1.25,0,.4,2.5,100,'#9e9e9e');box(50,1.25,0,.4,2.5,100,'#9e9e9e');
 box(-27,1.25,-50,46,2.5,.4,'#9e9e9e');box(27,1.25,-50,46,2.5,.4,'#9e9e9e');
 box(-4.4,2,-50,.8,4,.8,'#fbc02d');box(4.4,2,-50,.8,4,.8,'#fbc02d');box(0,4.2,-50,9.6,.8,.5,'#fbc02d',false);
 G.sign(P.school.toUpperCase(),0,5.6,-50.4,8,2);
 // lapangan upacara + tiang bendera
 flat(0,-30,38,20,'#b0b0b0');box(0,4.5,-22,.2,9,.2,'#ddd');box(1.1,8.5,-22,2,.6,.05,'#e53935',false);box(1.1,7.9,-22,2,.6,.05,'#fff',false);
 // lapangan basket + lapangan olahraga
 flat(-32,40.5,22,13,'#d2691e');box(-42.5,1.5,40.5,.2,3,.2,'#333');box(-42.2,3,40.5,.1,1,1.6,'#fff',false);box(-21.5,1.5,40.5,.2,3,.2,'#333');box(-21.8,3,40.5,.1,1,1.6,'#fff',false);
 flat(12,40,46,16,'#2e7d32');flat(12,40,.3,16,'#fff',.07);box(-10.5,1.2,40,.2,2.4,5,'#eee',false);box(34.5,1.2,40,.2,2.4,5,'#eee',false);
 // parkir + taman
 flat(-34,-42,24,9,'#616161');box(-40,.7,-42,2,1.4,4,'#c62828');box(-34,.7,-42,2,1.4,4,'#1565c0');box(-28,.7,-42,2,1.4,4,'#f9a825');
 flat(34,-33,26,20,'#7cb342');
 [[24,-30],[30,-26],[36,-32],[42,-28],[28,-40],[38,-42],[45,-36],[-46,5],[-46,20],[46,5]].forEach(p=>{box(p[0],1.2,p[1],.4,2.4,.4,'#6d4c41');const l=B.MeshBuilder.CreateSphere('l',{diameter:3.4,segments:3},sc);l.position.set(p[0],3.6,p[1]);l.material=G.M('#2e7d32');l.freezeWorldMatrix()});
 // koridor berkanopi di depan deretan gedung
 flat(0,-12.6,84,3,'#cfcfcf',.05);box(0,3.3,-12.6,84,.2,3.4,'#8d6e63',false);for(let i=-40;i<=40;i+=10)box(i,1.6,-14,.3,3.2,.3,'#8d6e63',false);
 // gedung
 const W='#f5e9c8',RF='#b34a3a';
 [['kepsek','RUANG KEPALA SEKOLAH',-35,-6],['guru','RUANG GURU',-21,-6],['osis','RUANG OSIS',-7,-6],['perpus','PERPUSTAKAAN',7,-6],['uks','UKS',21,-6],['labkom','LAB KOMPUTER',35,-6],
  ['kelas1','KELAS 1',-35,12],['kelas2','KELAS 2',-21,12],['kelas3','KELAS 3',-7,12],['labipa','LAB IPA',7,12],['aula','AULA',21,12],['mushola','MUSHOLA',35,12],
  ['kantin','KANTIN',-35,27],['toilet','TOILET',-21,27]].forEach(r=>G.room(r[0],r[1],r[2],r[3],12,10,r[0]=='osis'?'#ffe082':W,RF));
 G.room('pos','POS SATPAM',10,-46,4,4,'#bdbdbd','#455a64');
 G.rooms.forEach(r=>{const cx=(r.x1+r.x2)/2,cz=(r.z1+r.z2)/2;
  if(r.k=='osis'){box(cx,.4,cz,4,.8,1.2,'#8d6e63');for(let i=0;i<6;i++){const s=G.seat(i);box(s[0],.25,s[1],.5,.5,.5,'#37474f')}}
  else if(/^kelas|labkom|labipa/.test(r.k)){for(let a=0;a<3;a++)for(let b=0;b<2;b++)box(cx-3.6+a*3.6,.4,cz-1.5+b*3,1.4,.8,.6,'#a1887f');box(cx,1.8,r.z2-.2,6,1.6,.06,'#eceff1',false)}
  else if(r.k=='kantin')box(cx,.55,cz+3,8,1.1,1,'#ef6c00');
  else if(r.k!='pos')box(cx,.4,cz+2,3,.8,1,'#6d4c41')});
 // zona NPC dan nama area
 R.jaga={x1:5.5,x2:6.5,z1:-47,z2:-45.5};R.gerbang={x1:-3,x2:3,z1:-47,z2:-44};R.lapangan={x1:-17,x2:17,z1:-39,z2:-21};R.event=R.lapangan;
 R.basket={x1:-41,x2:-23,z1:36,z2:45};R.olahraga={x1:-9,x2:33,z1:35,z2:46};
 G.areas=[['Lapangan Upacara',R.lapangan],['Lapangan Basket',R.basket],['Lapangan Olahraga',R.olahraga],['Area Parkir',{x1:-46,x2:-22,z1:-47,z2:-37}],['Taman Sekolah',{x1:21,x2:47,z1:-43,z2:-23}],['Gerbang Utama',{x1:-5,x2:5,z1:-51,z2:-43}],['Koridor Sekolah',{x1:-42,x2:42,z1:-14.2,z2:-11}]];
};
