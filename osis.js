// Organisasi OSIS, rapat, program kerja, event di dunia 3D, misi story
G.PK=[{k:'cm',n:'Class Meeting',ang:300000},{k:'pensi',n:'Pentas Seni',ang:500000},{k:'jb',n:'Jumat Bersih',ang:100000}];
G.def=p=>{const f=()=>55+Math.random()*25|0;return{p:Object.assign({x:0,z:-40},p),off:0,kas:1000000,rep:50,m:0,f:{},rapat:0,proker:null,tx:[['Kas awal',1000000]],
 mem:[['Aisyah','IX-A','Wakil Ketua',1],['Rizky','VIII-B','Sekretaris',0],['Dewi','VIII-A','Bendahara',1],['Fajar','IX-B','Ketua Divisi Olahraga',0],['Salsa','VII-C','Anggota Divisi Seni',1]].map(a=>({n:a[0],k:a[1],j:a[2],f:a[3],a:f(),d:f(),l:f()}))}};
G.tx=(d,a)=>{G.S.tx.push([d,a]);if(G.S.tx.length>30)G.S.tx.shift()};
G.MS=[
 ['Temui kepala sekolah di Ruang Kepala Sekolah',()=>G.S.f.kep],
 ['Kunjungi Ruang OSIS',()=>G.lk=='osis'],
 ['Adakan rapat OSIS: tekan E di meja rapat',()=>G.S.rapat>0],
 ['Minta persetujuan dana ke kepala sekolah',()=>G.S.proker&&G.S.proker.st!='diajukan'],
 ['Minta anggota OSIS memulai kegiatan',()=>G.S.proker&&G.S.proker.st!='diajukan'&&G.S.proker.st!='disetujui'],
 ['Selesaikan kegiatan dan baca laporan akhir',()=>G.S.proker&&G.S.proker.st=='selesai']];
G.rapat=()=>{
 const S=G.S;
 if(G.meet)return G.toast('Rapat sedang berlangsung');
 if(S.proker&&S.proker.st!='selesai')return G.toast('Proker '+S.proker.n+' masih berstatus: '+S.proker.st);
 G.meet=true;G.toast('Anggota OSIS berkumpul di ruang rapat...');
 const o=G.PK.map(k=>[k.n+' · '+G.rp(k.ang),()=>{
  G.closeDlg();S.proker={n:k.n,ang:k.ang,k:k.k,st:'diajukan'};G.toast('Disepakati: '+k.n+'. Ajukan ke kepala sekolah!',3500);
  setTimeout(()=>{G.meet=false;S.rapat++;S.mem.forEach(m=>{m.a=G.cl(m.a+3);m.d=G.cl(m.d+2);m.l=G.cl(m.l+3)});S.rep=G.cl(S.rep+3);G.toast('Rapat selesai: kekompakan naik, reputasi +3',3500)},12000)}]);
 o.push(['Batalkan',()=>{G.meet=false;G.closeDlg()}]);
 G.dialog('Rapat OSIS','Agenda: pilih program kerja yang akan diajukan ke kepala sekolah.',o);
};
G.startEvent=()=>{
 const S=G.S,pr=S.proker;if(!pr||pr.st!='disetujui')return;
 pr.st='berjalan';G.evOn=1;const e=G.ev=[],b=(...a)=>e.push(G.box(...a));
 e.push(G.sign(pr.n.toUpperCase(),0,5,-20.6,12,3));b(-6.2,3.2,-20.6,.3,6.4,.3,'#6d4c41');b(6.2,3.2,-20.6,.3,6.4,.3,'#6d4c41');b(-11,.5,-24,4,1,1.2,'#8d6e63');
 if(pr.k=='cm'){b(0,.07,-30,26,.1,14,'#4fc3f7',false);b(0,2.4,-39,6,2.2,.3,'#212121');b(-17,1.2,-30,.2,2.4,5,'#eee',false);b(17,1.2,-30,.2,2.4,5,'#eee',false)}
 else if(pr.k=='pensi'){b(0,.6,-36,16,1.2,6,'#6a1b9a');b(0,3.4,-38.8,16,4.4,.3,'#ce93d8',false);b(-9.5,1,-35,1.2,2,1.2,'#111');b(9.5,1,-35,1.2,2,1.2,'#111')}
 else[[-10,-30],[10,-30],[-10,-24],[10,-24]].forEach(p=>b(p[0],.5,p[1],.6,1,.6,'#2e7d32'));
 G.toast(pr.n+' dimulai di lapangan upacara! Siswa dan guru berkumpul.',4500);
 setTimeout(G.endEvent,75000);
};
G.endEvent=()=>{
 const S=G.S,pr=S.proker;if(!pr||pr.st!='berjalan')return;
 G.ev.forEach(m=>m.dispose());G.ev=[];G.evOn=0;
 const v=S.mem.reduce((a,m)=>a+m.a+m.d+m.l,0)/(S.mem.length*3),pts=Math.round(v/12+Math.random()*3);
 pr.st='selesai';pr.hasil=v>70?'Sukses besar':v>58?'Sukses':'Cukup';S.rep=G.cl(S.rep+pts);
 G.dialog('Laporan Akhir Kegiatan',pr.n+' selesai. Hasil: '+pr.hasil+'. Reputasi +'+pts+'. Sisa kas '+G.rp(S.kas)+'.',[['Tutup',()=>G.closeDlg()]]);
};
