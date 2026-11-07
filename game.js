// Boot, loop, waktu WIB, HUD, minimap, jeda, simpan/muat
(()=>{
const B=BABYLON,$=i=>document.getElementById(i),K=G.K={},cv=$('c');
G.$=$;G.cl=v=>Math.max(0,Math.min(100,v));G.rp=n=>'Rp'+Math.round(n).toLocaleString('id-ID');
G.toast=(t,ms)=>{const e=$('toast');e.textContent=t;e.hidden=false;clearTimeout(G._t);G._t=setTimeout(()=>e.hidden=true,ms||2800)};
G.dialog=(w,t,o)=>{G.dlgOpen=true;document.exitPointerLock&&document.exitPointerLock();$('dlg').hidden=false;$('dwho').textContent=w;$('dtxt').textContent=t;const d=$('dopts');d.innerHTML='';o.forEach(a=>{const b=document.createElement('button');b.textContent=a[0];b.onclick=()=>a[1]();d.appendChild(b)})};
G.closeDlg=()=>{G.dlgOpen=false;$('dlg').hidden=true;G.npcs.forEach(n=>n.busy=false)};
const F=new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',hourCycle:'h23',hour:'2-digit',minute:'2-digit',weekday:'long',day:'numeric',month:'long',year:'numeric'});
G.clock=()=>{const o={};F.formatToParts(new Date(Date.now()+G.S.off*6e4)).forEach(p=>o[p.type]=p.value);o.h=+o.hour+ +o.minute/60;return o};
G.save=q=>{const p=G.col.position;G.S.p.x=p.x;G.S.p.z=p.z;try{localStorage.setItem('ketuaosis1',JSON.stringify(G.S));q||G.toast('Game tersimpan')}catch(e){}};
G.load=()=>{try{const s=JSON.parse(localStorage.getItem('ketuaosis1'));return s&&s.p&&s.mem?s:null}catch(e){return null}};
G.light=h=>{const d=Math.max(0,Math.sin(Math.PI*(h-6)/12)),s=B.Color3.Lerp(new B.Color3(.03,.04,.12),new B.Color3(.55,.78,.95),Math.min(1,d*2.5));G.hemi.intensity=.3+.7*d;G.sun.intensity=.05+.75*d;G.sc.clearColor=new B.Color4(s.r,s.g,s.b,1);G.sc.fogColor=s};
G.where=()=>{const p=G.col.position;let n='Halaman Sekolah',k='';
 G.rooms.forEach(r=>{const i=p.x>r.x1&&p.x<r.x2&&p.z>r.z1&&p.z<r.z2;if(i){n=r.name;k=r.k}if(r.on===i){r.on=!i;r.roof.setEnabled(!i)}});
 if(!k)G.areas.forEach(a=>{const r=a[1];if(p.x>r.x1&&p.x<r.x2&&p.z>r.z1&&p.z<r.z2)n=a[0]});
 if(n!=G.loc){G.loc=n;$('loc').textContent='📍 '+n}G.lk=k};
G.near=()=>{const p=G.col.position;let b=null,bd=3;const e=(d,o)=>{if(d<bd){bd=d;b=o}};
 G.npcs.forEach(n=>{if(n.zone)e(Math.hypot(n.root.position.x-p.x,n.root.position.z-p.z),{k:'n',n,l:'Bicara: '+n.n})});
 G.doors.forEach(d=>e(Math.hypot(d.x-p.x,d.z-p.z),{k:'d',d,l:d.open?'Tutup pintu':'Buka pintu'}));
 if(G.lk=='osis')e(Math.hypot(p.x+7,p.z+6)-.5,{k:'t',l:'Meja rapat OSIS'});
 G.tg=b;const a=$('bAct');a.hidden=!b||G.dlgOpen;if(b)a.textContent='[E] '+b.l};
G.act=()=>{if(G.paused||G.dlgOpen||!G.tg)return;const t=G.tg;if(t.k=='n')G.talk(t.n);else if(t.k=='d')t.d.open=!t.d.open;else G.rapat()};
G.mission=()=>{const S=G.S,m=G.MS[S.m];if(m&&m[1]()){S.m++;S.rep=G.cl(S.rep+3);S.kas+=50000;G.tx('Hadiah misi',50000);G.toast('Misi selesai: '+m[0]+' (+Rp50.000, +3 reputasi)',4000)}};
G.hud=()=>{const S=G.S,m=G.MS[S.m];$('rep').textContent=S.p.name+' · Ketua OSIS  ⭐'+S.rep+'  💰'+G.rp(S.kas);$('quest').textContent=m?'Misi '+(S.m+1)+'/'+G.MS.length+': '+m[0]:'Free Roam: jelajahi sekolah atau adakan proker baru'};
G.mini=()=>{if(G.fr%4)return;const x=$('mini').getContext('2d'),s=96/110,X=v=>(v+55)*s,Z=v=>96-(v+55)*s;
 x.fillStyle='#2e7d32';x.fillRect(0,0,96,96);x.fillStyle='#e0c070';G.rooms.forEach(r=>x.fillRect(X(r.x1),Z(r.z2),(r.x2-r.x1)*s,(r.z2-r.z1)*s));
 x.fillStyle='#fff';G.npcs.forEach(n=>{if(n.zone)x.fillRect(X(n.root.position.x)-1,Z(n.root.position.z)-1,2,2)});
 const p=G.col.position;x.fillStyle='#f00';x.beginPath();x.arc(X(p.x),Z(p.z),3.5,0,7);x.fill()};
G.info=()=>{const S=G.S;$('pinfo').innerHTML='<b>Reputasi:</b> '+S.rep+' · <b>Kas:</b> '+G.rp(S.kas)+'<br><b>Proker:</b> '+(S.proker?S.proker.n+' ('+S.proker.st+')':'-')+'<br><b>Anggota OSIS</b><br>'+S.mem.map(m=>m.n+' · '+m.k+' · '+m.j+' · aktif '+m.a+' · disiplin '+m.d+' · loyal '+m.l).join('<br>')+'<br><b>Transaksi terakhir</b><br>'+S.tx.slice(-5).map(t=>t[0]+': '+G.rp(t[1])).join('<br>')};
G.pause=on=>{G.paused=on;$('pause').hidden=!on;if(on){document.exitPointerLock&&document.exitPointerLock();G.info()}};
G.tick=dt=>{
 const t=G.clock();G.fr=(G.fr||0)+1;
 if(G.fr%20==1){G.light(t.h);$('clock').textContent=t.hour+':'+t.minute+' WIB · '+t.weekday+', '+t.day+' '+t.month+' '+t.year;G.hud()}
 G.updPlayer(dt);G.updNPCs(dt,t.h);
 G.doors.forEach(d=>{const a=d.open?-Math.PI/2:0;d.piv.rotation.y+=(a-d.piv.rotation.y)*Math.min(1,dt*8)});
 G.where();G.near();G.mission();G.mini();
};
G.begin=S=>{
 G.S=S;if(S.proker&&S.proker.st=='berjalan')S.proker.st='disetujui';
 $('menu').hidden=true;
 const eng=G.eng=new B.Engine(cv,false,{stencil:false},false);eng.setHardwareScalingLevel(1/Math.min(devicePixelRatio||1,1.5));
 const sc=G.sc=new B.Scene(eng);sc.collisionsEnabled=true;sc.fogMode=B.Scene.FOGMODE_LINEAR;sc.fogStart=55;sc.fogEnd=140;
 G.hemi=new B.HemisphericLight('hm',new B.Vector3(0,1,0),sc);G.hemi.groundColor=new B.Color3(.4,.4,.45);G.sun=new B.DirectionalLight('sn',new B.Vector3(-.4,-1,-.3),sc);
 G.build();G.initPlayer();G.spawnNPCs();
 $('hud').hidden=false;G.playing=true;G.paused=false;
 eng.runRenderLoop(()=>{const dt=Math.min(eng.getDeltaTime()/1000,.05);if(!G.paused)G.tick(dt);sc.render()});
 addEventListener('resize',()=>eng.resize());
 setInterval(()=>{if(!G.paused)G.save(true)},30000);
};
// menu
$('bCont').hidden=!G.load();
$('bNew').onclick=()=>{$('mainbtns').hidden=true;$('create').hidden=false};
$('bCont').onclick=()=>G.begin(G.load());
$('bStart').onclick=()=>{const v=(i,d)=>$(i).value.trim()||d;G.begin(G.def({name:v('fName','Ketua'),g:$('fG').value,hair:+$('fHair').value,cl:+$('fCl').value,color:$('fCol').value,school:v('fSchool','SMP Nusantara'),head:v('fHead','Bu Ratna')}))};
$('bPause').onclick=()=>G.pause(true);$('bRes').onclick=()=>G.pause(false);$('bSave').onclick=()=>G.save();
$('bTime').onclick=()=>{G.S.off+=60;G.toast('Waktu maju 1 jam')};
$('bMenu').onclick=()=>{G.save(true);location.reload()};
// input PC
addEventListener('keydown',e=>{K[e.code]=1;if(e.code=='KeyE')G.act();if(e.code=='Escape'&&G.playing&&!G.dlgOpen)G.pause(!G.paused);if(e.code=='Space'&&e.target==document.body)e.preventDefault()});
addEventListener('keyup',e=>K[e.code]=0);
const touch=matchMedia('(pointer:coarse)').matches;
cv.addEventListener('click',()=>{if(G.playing&&!G.paused&&!G.dlgOpen&&!touch)cv.requestPointerLock()});
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement&&G.playing&&!G.paused&&!G.dlgOpen)G.pause(true)});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement==cv&&G.cam){G.cam.alpha-=e.movementX*.003;G.cam.beta=Math.max(.35,Math.min(1.5,G.cam.beta-e.movementY*.003))}});
// input Android: joystick, geser kamera, tombol
const j=$('joy'),jk=j.firstElementChild;let jp=null;
const jm=e=>{const r=j.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const l=Math.hypot(dx,dy);if(l>50){dx*=50/l;dy*=50/l}G.jx=dx/50;G.jz=-dy/50;jk.style.transform='translate('+dx+'px,'+dy+'px)'};
j.onpointerdown=e=>{j.setPointerCapture(e.pointerId);jp=e.pointerId;jm(e)};
j.onpointermove=e=>{if(e.pointerId==jp)jm(e)};
j.onpointerup=j.onpointercancel=()=>{jp=null;G.jx=G.jz=0;jk.style.transform=''};
const L={};
cv.addEventListener('pointerdown',e=>{if(e.pointerType=='touch')L[e.pointerId]=[e.clientX,e.clientY]});
cv.addEventListener('pointermove',e=>{const l=L[e.pointerId];if(!l||!G.cam||G.paused||G.dlgOpen)return;G.cam.alpha-=(e.clientX-l[0])*.008;G.cam.beta=Math.max(.35,Math.min(1.5,G.cam.beta-(e.clientY-l[1])*.006));l[0]=e.clientX;l[1]=e.clientY});
cv.addEventListener('pointerup',e=>delete L[e.pointerId]);cv.addEventListener('pointercancel',e=>delete L[e.pointerId]);
$('bRun').onclick=function(){G.runT=!G.runT;this.style.background=G.runT?'#43a047':''};
$('bJump').onpointerdown=()=>G.jmp=true;
$('bAct').onclick=()=>G.act();
addEventListener('pagehide',()=>{if(G.playing)G.save(true)});
})();
