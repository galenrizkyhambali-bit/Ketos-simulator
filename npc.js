// NPC: jadwal harian berdasarkan jam WIB, wander di zona, dialog
G.ROLE={satpam:'Satpam',kepsek:'Kepala Sekolah',guru:'Guru',kantin:'Penjaga Kantin',siswa:'Siswa',osis:'Anggota OSIS'};
G.phase=h=>{if(h<6||h>=17)return'malam';if(h<7)return'datang';if(h<9.5||h>=10&&h<12||h>=12.5&&h<14)return'belajar';if(h<10||h>=12&&h<12.5)return'istirahat';if(h<15)return'pulang';return'ekskul'};
G.spawnNPCs=()=>{
 const P=G.S.p;let k=0;
 const add=(r,n,top,bot,o={})=>{const root=G.human({top,bot,skin:'#e0ac69',hair:'#1b1b1b',hs:0,fem:0,arm:0,...o});const x={r,n,i:k++,si:-1,root,still:!!o.still};G.npcs.push(x);return x};
 add('satpam','Pak Joko','#37474f','#263238',{still:1,skin:'#c68642'});
 add('kepsek',P.head,'#455a64','#212121',{still:1,hair:'#9e9e9e'});
 add('guru','Bu Sari','#8d6e63','#4e342e',{fem:1,hs:2});add('guru','Pak Anton','#6d4c41','#212121');
 add('kantin','Bu Tini','#ef6c00','#4e342e',{fem:1,hs:2,still:1});
 G.S.mem.forEach((m,j)=>{const x=add('osis',m.n,'#f5f5f5',m.f?'#b71c1c':'#1e3a8a',{fem:m.f,hs:m.f?1:0});x.si=j;x.mem=m});
 [['Budi'],['Citra',1],['Dimas'],['Eka',1],['Fitri',1],['Gilang']].forEach(a=>add('siswa',a[0],'#f5f5f5',a[1]?'#b71c1c':'#1e3a8a',{fem:a[1]||0,hs:a[1]?1:0}));
};
G.zoneFor=(n,ph)=>{
 const r=n.r,c='kelas'+(1+n.i%3);
 if(r=='satpam')return'jaga';if(r=='kepsek')return'kepsek';
 if(G.meet&&r=='osis')return'meja';
 if(G.evOn&&r!='kantin')return'event';
 if(ph=='malam')return null;
 if(r=='kantin')return ph=='pulang'||ph=='ekskul'?null:'kantin';
 if(r=='guru')return ph=='belajar'?(n.i%2?'kelas1':'kelas2'):ph=='datang'||ph=='istirahat'?'guru':null;
 if(r=='osis')return ph=='datang'?'lapangan':ph=='belajar'?c:'osis';
 return ph=='datang'?'lapangan':ph=='belajar'?c:ph=='istirahat'?(n.i%2?'kantin':'lapangan'):ph=='pulang'?'gerbang':n.i%2?'olahraga':'basket';
};
G.updNPCs=(dt,h)=>{
 const ph=G.phase(h);
 G.npcs.forEach(n=>{
  const z=G.zoneFor(n,ph),r=n.root;
  if(z!==n.zone){n.zone=z;r.setEnabled(!!z);if(!z)return;const p=G.pt(z,n);r.position.set(p[0],0,p[1]);n.tg=null;n.w=Math.random()*2;if(z=='meja')r.rotation.y=Math.atan2(-7-p[0],-6-p[1])}
  if(!z||z=='meja'||n.busy)return;
  const pos=r.position;
  if(n.tg){const dx=n.tg[0]-pos.x,dz=n.tg[1]-pos.z,d=Math.hypot(dx,dz);
   if(d<.3){n.tg=null;n.w=n.still?6+Math.random()*10:1+Math.random()*4;G.anim(r,0,0)}
   else{const a=Math.atan2(dx,dz),df=Math.atan2(Math.sin(a-r.rotation.y),Math.cos(a-r.rotation.y));r.rotation.y+=df*Math.min(1,dt*8);pos.x+=dx/d*1.5*dt;pos.z+=dz/d*1.5*dt;n.t=(n.t||0)+dt;G.anim(r,n.t,.7)}}
  else if((n.w-=dt)<=0)n.tg=G.pt(z,n);
 });
};
const LN={satpam:['Selamat datang di {s}, Ketua!','Ingat ya, bel masuk jam 07.00.'],kepsek:['Selamat datang, Ketua OSIS. Saya tunggu program kerjamu.','Pimpin OSIS dengan jujur dan disiplin.'],guru:['Semangat memimpin OSIS. Jangan ganggu jam belajar ya.','OSIS harus jadi teladan bagi siswa lain.'],kantin:['Mau beli apa? Gorengan masih hangat!','Hari ini bakso laris banget.'],siswa:['Kak Ketua! Kapan ada acara lagi?','Kantin penuh banget kalau istirahat.','Aku nunggu Class Meeting nih!'],osis:['Siap, Ketua! Kapan kita rapat?','Anggota OSIS siap membantu.']};
const pick=a=>a[Math.random()*a.length|0];
G.talk=n=>{
 const S=G.S,p=G.col.position,pr=S.proker;
 n.busy=true;n.root.rotation.y=Math.atan2(p.x-n.root.position.x,p.z-n.root.position.z);
 const ask=()=>{const c=G.clock();
  if(n.r=='kepsek')return'Kas OSIS saat ini '+G.rp(S.kas)+'. Reputasimu '+S.rep+'/100.';
  if(n.r=='osis')return'Jabatan: '+n.mem.j+' ('+n.mem.k+'). Keaktifan '+n.mem.a+', kedisiplinan '+n.mem.d+', loyalitas '+n.mem.l+'.';
  if(n.r=='satpam')return'Gerbang buka 06.00, bel masuk 07.00, pulang 14.00, ekskul 15.00. Sekarang '+c.hour+':'+c.minute+'.';
  return'Sekarang jam '+c.hour+':'+c.minute+' ('+G.phase(c.h)+'). Mau bikin acara? Adakan rapat di Ruang OSIS.'};
 const menu=t=>{
  const o=[['Sapa',()=>menu(pick(LN[n.r]).replace('{s}',S.p.school))],['Tanya',()=>menu(ask())]];
  if(n.r=='kepsek'&&pr&&pr.st=='diajukan')o.push(['Ajukan proker '+pr.n,()=>{
   if(S.kas<pr.ang)return menu('Anggaran '+G.rp(pr.ang)+' melebihi kas OSIS ('+G.rp(S.kas)+'). Cari dana dulu ya.');
   S.kas-=pr.ang;pr.st='disetujui';G.tx('Dana '+pr.n,-pr.ang);S.rep=G.cl(S.rep+4);menu('Proker disetujui, dana '+G.rp(pr.ang)+' cair. Minta anggota OSIS memulai kegiatan.')}]);
  if(n.r=='osis'){
   o.push(['Ajak rapat',()=>{G.closeDlg();G.rapat()}]);
   o.push(['Beri tugas',()=>{n.mem.a=G.cl(n.mem.a+4);n.mem.l=G.cl(n.mem.l+2);menu(n.n+' mengerjakan tugas dengan semangat. Keaktifan naik.')}]);
   if(pr&&pr.st=='disetujui')o.push(['Mulai '+pr.n,()=>{G.closeDlg();G.startEvent()}])}
  o.push(['Tutup',()=>G.closeDlg()]);
  G.dialog(n.n+' · '+G.ROLE[n.r],t,o)};
 if(n.r=='kepsek')S.f.kep=1;
 menu(pick(LN[n.r]).replace('{s}',S.p.school));
};
