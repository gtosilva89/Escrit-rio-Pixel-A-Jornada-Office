// ===================== MOTOR =====================
const KEY='escritorioPixel_v1';
const OFF=[[0,0],[320,0],[320,184],[0,184]];
const W=640,H=368,VW=320,VH=184;
let S=null, LV=null, NOD={}, EDG=[], visao=false;
const $=id=>document.getElementById(id);
const el=(tag,attrs={},...kids)=>{const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs)){if(k==='on')for(const[ev,f]of Object.entries(v))e.addEventListener(ev,f);else if(v!=null)e.setAttribute(k,v)}for(const k of kids)if(k!=null&&k!==false)e.append(k.nodeType?k:document.createTextNode(k));return e};
// v2: o progresso NÃO fica salvo sozinho. O aluno salva gerando um código (codigo.js).
let sujo=false, ultimoCod='';
function salvar(){sujo=true}
window.addEventListener('beforeunload',e=>{if(S&&sujo){e.preventDefault();e.returnValue=''}});
const PR=()=>S.P[LV.id]||(S.P[LV.id]={feito:{},erros:{},abertos:{},missao:{},hist:{},pos:null});
function nivel(xp){let n=NIVEIS_XP[0];for(const x of NIVEIS_XP)if(xp>=x[0])n=x;return n}
function proxNivel(xp){for(const x of NIVEIS_XP)if(xp<x[0])return x[0];return null}
function toast(t){const e=$('toast');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2600)}
function ganharXP(n,m){const a=nivel(S.xp)[1];S.xp+=n;const d=nivel(S.xp)[1];toast(`+${n} XP ${m||''}`);if(a!==d)setTimeout(()=>{sfx('nivel');toast('NOVO NÍVEL: '+d.toUpperCase()+'!')},1400);salvar();hud()}
function darSelo(k){if(k&&SELOS[k]&&!S.selos.includes(k)){S.selos.push(k);salvar();hud();setTimeout(()=>{sfx('selo');toast('SELO: '+SELOS[k][0])},2800)}}
function errar(id){sfx('erro');const p=PR();p.erros[id]=(p.erros[id]||0)+1;S.vida=Math.max(0,S.vida-1);salvar();hud()}

// ---------- mundo do nível ----------
function montarNivel(lv){LV=lv;NOD={};EDG=[];
 lv.fases.forEach((f,k)=>{const[ox,oy]=OFF[k];for(const[id,n]of Object.entries(f.lugares))NOD[id]={...n,id,x:n.x+ox,y:n.y+oy,fase:k,pre:f.pre[id]||[]};
  f.edges.forEach(e=>EDG.push(e));
  if(k<lv.fases.length-1){const prox=Object.keys(lv.fases[k+1].lugares)[0];EDG.push([f.saida,prox])}});
 terreno(lv.bioma);criarLabels()}
const primeiro=k=>Object.keys(LV.fases[k].lugares)[0];
function faseLiberada(k){return k===0||faseCompleta(k-1)}
function faseCompleta(k){return Object.entries(LV.fases[k].lugares).every(([id,n])=>n.extra||PR().feito[id])}
function nivelCompleto(lv){const p=S.P[lv.id];if(!p)return false;return lv.fases.every(f=>Object.entries(f.lugares).every(([id,n])=>n.extra||p.feito[id]))}
function disponivel(id){const n=NOD[id];return faseLiberada(n.fase)&&n.pre.every(p=>PR().feito[p])}
function estado(id){return PR().feito[id]?'feito':disponivel(id)?'disp':'trava'}

// ---------- pixel art ----------
const cv=$('cv'),cx=cv.getContext('2d');cx.imageSmoothingEnabled=false;
const R=(x,y,w,h,c,g=cx)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
const HERO=['..kkkk..','.kHHHHk.','kHHHHHHk','kSSSSSSk','kSkSSkSk','.kSSSSk.','kCCCCCCk','SkCCCCkS','.kPPPPk.','.kPkkPk.','.kk..kk.'];
const AVS=[{H:'#5a3825',C:'#2a9d8f',P:'#264653',S:'#f1c27d'},{H:'#f4d35e',C:'#e63946',P:'#1d3557',S:'#e0ac69'},{H:'#1b1b1b',C:'#9b5de5',P:'#3d348b',S:'#8d5524'},{H:'#c1440e',C:'#f77f00',P:'#3c2a21',S:'#ffdbac'}];
function spr(g,s,pal,x,y,k=1){s.forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch==='.')return;const c=ch==='k'?'#14112a':pal[ch];if(c)R(x+i*k,y+j*k,k,k,c,g)}))}
const BIOMAS={
 campo:{g:['#3d8547','#4f9a55','#2f6e3b'],fl:['#ffd166','#ef476f','#ffffff'],agua:'#2b5d9c',brilho:'#5f9ad8',marg:'#c9b57a',cam:'#d2ad6d',camB:'#8f6f3e',arv:['#25683a','#3a9a55','#1d5230'],tronco:'#5b3a1e'},
 savana:{g:['#b59f45','#c7b45a','#9c8a35'],fl:['#e76f51','#f4a261','#ffffff'],agua:'#2a7f9e',brilho:'#5fb7d4',marg:'#e9d8a6',cam:'#e3c08a',camB:'#9a6b3a',arv:['#bc4b1b','#e07a2f','#8f3a15'],tronco:'#4a2c17'},
 neve:{g:['#dfe8f0','#eef4f8','#c9d6e3'],fl:['#a8dadc','#ffffff','#bde0fe'],agua:'#3a6ea5',brilho:'#a2d2ff',marg:'#b8c4d0',cam:'#a39074',camB:'#6b5a45',arv:['#1f4e4a','#2f6f68','#163b38'],tronco:'#3e2a1c'},
 cristal:{g:['#2a2440','#332b52','#221d36'],fl:['#5ec8ff','#c77dff','#ffd166'],agua:'#3a0ca3',brilho:'#7b2ff7',marg:'#4a3f6b',cam:'#5b4d8a',camB:'#2c2350',arv:['#4cc9f0','#a2e7ff','#3a86ff'],tronco:'#1b1530'}};
let B=BIOMAS.campo;
const base=document.createElement('canvas');base.width=W;base.height=H;const bg=base.getContext('2d');
const rioX=y=>318+Math.sin(y/17)*6;
function distSeg(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy;let t=l?((px-ax)*dx+(py-ay)*dy)/l:0;t=Math.max(0,Math.min(1,t));return Math.hypot(px-ax-t*dx,py-ay-t*dy)}
const pertoCam=(x,y,m)=>EDG.some(([a,b])=>distSeg(x,y,NOD[a].x,NOD[a].y,NOD[b].x,NOD[b].y)<m);
function arvore(x,y,esc){const[c,h,d]=B.arv;R(x-1,y+2,2,3,B.tronco,bg);
 if(LV&&LV.bioma==='cristal'){R(x-1,y-6,3,9,esc?d:c,bg);R(x-3,y-2,2,5,h,bg);R(x+2,y-3,2,6,c,bg);return}
 if(LV&&LV.bioma==='neve'){R(x-1,y-7,3,2,c,bg);R(x-2,y-5,5,2,c,bg);R(x-3,y-3,7,2,esc?d:c,bg);R(x-4,y-1,9,3,esc?d:c,bg);R(x-1,y-7,1,1,'#fff',bg);R(x-3,y-3,2,1,'#fff',bg);return}
 R(x-3,y-3,7,5,esc?d:c,bg);R(x-2,y-5,5,2,esc?d:c,bg);R(x-2,y-3,2,2,h,bg)}
function terreno(bioma){B=BIOMAS[bioma];seed=11;
 for(let y=0;y<H;y+=2)for(let x=0;x<W;x+=2){const r=rnd();R(x,y,2,2,r<.08?B.g[1]:r<.16?B.g[2]:B.g[0],bg)}
 for(let i=0;i<220;i++)R(rnd()*W|0,rnd()*H|0,1,1,B.fl[i%3],bg);
 for(let y=0;y<H;y++){const c=rioX(y);R(c-7,y,15,1,B.agua,bg);R(c-8,y,1,1,B.marg,bg);R(c+8,y,1,1,B.marg,bg);if(y%7===0)R(c-3+(y%3),y,4,1,B.brilho,bg)}
 for(const pass of[0,1])for(const[a,b]of EDG){const A=NOD[a],Bn=NOD[b],n=Math.ceil(Math.hypot(Bn.x-A.x,Bn.y-A.y));
  for(let i=0;i<=n;i++){const x=A.x+(Bn.x-A.x)*i/n,y=A.y+(Bn.y-A.y)*i/n;const naAgua=Math.abs(x-rioX(y))<9;
   if(pass===0)R(x-3,y-3,7,7,naAgua?'#5b3a1e':B.camB,bg);else R(x-2,y-2,5,5,naAgua?((i>>1)%2?'#a0703c':'#8a5e30'):B.cam,bg)}}
 for(let i=0;i<420;i++){const x=6+rnd()*(W-12),y=8+rnd()*(H-16);if(Math.abs(x-rioX(y))<14||pertoCam(x,y,10)||Object.values(NOD).some(n=>Math.hypot(n.x-x,n.y-y)<20))continue;arvore(x,y,rnd()<.3)}
 // divisas das regiões
 for(let x=0;x<W;x+=6)if(Math.abs(x-rioX(184))>10&&!pertoCam(x,184,8))R(x,184,3,1,'rgba(0,0,0,.18)',bg);
}
function casa(x,y,par,tel){R(x-6,y-5,12,8,par);R(x-7,y-9,14,4,tel);R(x-5,y-11,10,2,tel);R(x-1,y-1,3,4,'#5b3a1e');R(x-5,y-3,3,2,'#a8dadc');R(x+3,y-3,3,2,'#a8dadc')}
function icone(n,x,y,t){switch(n.ic){
 case'vila':casa(x-9,y,'#e8d5b0','#b5442e');casa(x+8,y+3,'#d9c29a','#7a4f9e');break;
 case'mercado':R(x-8,y-2,16,6,'#8d6e63');for(let i=0;i<8;i++)R(x-9+i*2,y-7,2,5,i%2?'#e63946':'#fff');R(x-6,y-1,3,2,'#ffd166');R(x+2,y-1,3,2,'#90be6d');break;
 case'planilha':R(x-10,y-12,20,15,'#14112a');R(x-9,y-11,18,13,'#e9f5db');R(x-9,y-11,18,3,'#38b000');for(let i=-3;i<9;i+=6)R(x+i,y-8,1,10,'#95d5b2');for(let j=-5;j<2;j+=3)R(x-9,y+j,18,1,'#95d5b2');R(x-2,y-4,5,2,(t%50<25)?'#ff006e':'#ffadad');break;
 case'torre':R(x-5,y-16,10,20,'#8a8fa8');R(x-5,y-16,2,20,'#a9aec4');R(x-7,y-20,14,4,'#6b3fa0');R(x-4,y-24,8,4,'#6b3fa0');R(x-1,y-27,3,3,'#6b3fa0');R(x-1,y-10,3,4,(t%60<30)?'#ffd166':'#ffb703');R(x-2,y,4,4,'#3d2b56');break;
 case'floresta':for(const[a,b]of[[-7,-2],[6,-1],[0,-6],[-3,4],[5,5]]){R(x+a-3,y+b-3,7,5,'#1d5230');R(x+a-2,y+b-5,5,2,'#1d5230')}R(x-1,y,2,2,(t%50<25)?'#e9ff70':'#b8f25b');break;
 case'templo':R(x-8,y-2,16,6,'#e9e3d5');for(let i=-7;i<8;i+=4)R(x+i,y-2,2,6,'#c9c1ad');R(x-9,y-6,18,4,'#e0b03a');R(x-6,y-9,12,3,'#e0b03a');R(x-1,y-1,3,5,'#6b5b3a');break;
 case'biblioteca':R(x-9,y-6,18,10,'#8d6e63');R(x-10,y-9,20,3,'#5d4037');for(let i=0;i<5;i++)R(x-7+i*3,y-4,2,5,['#e63946','#457b9d','#f4a261','#2a9d8f','#ffd166'][i]);break;
 case'caverna':R(x-10,y-4,20,8,'#6d6a75');R(x-8,y-8,16,4,'#6d6a75');R(x-5,y-10,10,2,'#85818f');R(x-3,y-3,6,7,'#14112a');if(t%80<40)R(x+5,y-6,2,2,'#ffd166');break;
 case'ponte':R(x-11,y-3,22,7,B.agua);for(let i=-10;i<=10;i+=2)R(x+i,y-4,2,9,i%4?'#a0703c':'#8a5e30');R(x-11,y-5,23,1,'#5b3a1e');R(x-11,y+5,23,1,'#5b3a1e');break;
 case'portao':R(x-9,y-10,4,14,'#7b7b86');R(x+5,y-10,4,14,'#7b7b86');R(x-9,y-13,18,4,'#5c5c66');if(!PR().feito[n.id])for(let i=-4;i<5;i+=3)R(x+i,y-9,1,13,'#2b2b33');break;
 case'barbearia':{casa(x,y,'#f1e3c6','#264653');const f=(t>>3)%3;for(let j=0;j<8;j++)R(x+8,y-6+j,2,1,['#d62828','#ffffff','#1d4e89'][(j+f)%3]);break}
 case'castelo':R(x-12,y-8,24,12,'#3d3550');R(x-12,y-12,5,4,'#3d3550');R(x+7,y-12,5,4,'#3d3550');R(x-3,y-14,6,6,'#3d3550');R(x-2,y-1,4,5,'#14112a');R(x-11,y-17,1,5,'#ddd');R(x-10,y-17,4,2,'#d62828');R(x+8,y-17,1,5,'#ddd');R(x+9,y-17,4,2,'#d62828');break;
 case'campo':for(let i=-9;i<10;i+=3)R(x+i,y-4,1,7,'#e9c46a');R(x-1,y-12,3,10,'#6b4226');R(x-4,y-9,9,1,'#6b4226');R(x-2,y-14,5,3,'#f4a261');break;
 case'poco':R(x-6,y-3,12,7,'#7b7b86');R(x-4,y-2,8,3,'#1d3557');R(x-7,y-12,1,9,'#5b3a1e');R(x+6,y-12,1,9,'#5b3a1e');R(x-8,y-14,17,3,'#9c2a2a');break;
 case'moinho':R(x-4,y-12,8,16,'#e9d8a6');R(x-5,y-15,10,3,'#9c2a2a');{const a=(t>>3)%2;if(a){R(x-10,y-12,20,2,'#6b4226');R(x-1,y-21,2,20,'#6b4226')}else{for(let i=-8;i<9;i++){R(x+i,y-11+i,1,1,'#6b4226');R(x+i,y-11-i,1,1,'#6b4226')}}}break;
 case'montanha':for(let i=0;i<12;i++)R(x-12+i,y+4-i,24-2*i,1,'#6c757d');R(x-3,y-8,6,3,'#fff');break;
 case'cartorio':casa(x,y,'#e5e5e5','#5a189a');R(x-2,y-9,4,3,'#ffd166');break;
 case'atelie':casa(x,y,'#ffe8d6','#ff7b00');R(x+8,y-6,1,9,'#6b4226');R(x+7,y-7,5,4,'#fff');R(x+8,y-6,2,1,'#e63946');break;
 case'covil':R(x-12,y-4,24,8,'#3a3a46');R(x-9,y-8,18,4,'#3a3a46');R(x-5,y-3,10,7,'#0a0818');if(t%70<50){R(x-3,y-1,2,1,'#ff0054');R(x+2,y-1,2,1,'#ff0054')}break;
 case'porto':R(x-12,y+1,24,3,'#8a5e30');for(let i=-11;i<12;i+=5)R(x+i,y+1,1,5,'#5b3a1e');R(x-4,y-5,10,4,'#e63946');R(x,y-13,1,8,'#ddd');R(x+1,y-12,5,5,'#fff');break;
 case'farol':for(let j=0;j<18;j++)R(x-3,y-14+j,6,1,j%6<3?'#e63946':'#fff');R(x-4,y-18,8,4,'#264653');if(t%60<30){R(x+4,y-17,8,2,'rgba(255,209,102,.7)')}break;
 case'forja':casa(x,y,'#a0a0a8','#4a4e69');R(x+3,y-15,3,6,'#4a4e69');R(x+3,y-17-((t>>3)%3),3,2,'#adb5bd');R(x-1,y-1,3,4,(t%30<15)?'#f48c06':'#e85d04');break;
 case'muralha':R(x-14,y-8,28,12,'#8a8fa8');for(let i=-14;i<14;i+=4)R(x+i,y-11,2,3,'#8a8fa8');for(let j=-6;j<4;j+=3)R(x-14,y+j,28,1,'#6c7086');R(x-3,y-2,6,6,'#3d3550');break;
 case'lab':casa(x,y,'#e0fbfc','#3d5a80');R(x+8,y-4,3,5,'#90e0ef');R(x+8,y-3,3,2,(t%40<20)?'#80ed99':'#38b000');break;
 case'cofre':R(x-9,y-8,18,14,'#adb5bd');R(x-7,y-6,14,10,'#6c757d');R(x-2,y-3,4,4,'#ffd166');R(x,y-1,1,1,'#14112a');break;
 case'estadio':R(x-13,y-6,26,10,'#2d6a4f');R(x-13,y-6,26,1,'#fff');R(x,y-6,1,10,'#fff');R(x-15,y-10,30,4,'#adb5bd');for(let i=-14;i<15;i+=3)R(x+i,y-12,2,2,['#e63946','#457b9d','#ffd166'][((i+15)/3|0)%3]);R(x-2+((t>>3)%5),y-1,2,2,'#fff');break;
 case'placar':R(x-9,y-12,18,12,'#14112a');R(x-8,y-11,16,10,'#1d3557');R(x-6,y-9,4,6,(t%40<20)?'#ffd166':'#e63946');R(x+2,y-9,4,6,(t%40<20)?'#ffd166':'#457b9d');R(x-1,y,2,4,'#6c757d');break;
 default:casa(x,y,'#e8d5b0','#7a4f9e')}}
let heroi={x:0,y:0},rota=null,tick=0,cam={x:0,y:0};
function desenha(){tick++;
 if(S&&LV){
  if(rota){const[a,b]=rota.seg;const A=NOD[a],Bn=NOD[b];rota.t+=1.7/Math.max(1,Math.hypot(Bn.x-A.x,Bn.y-A.y));
   if(rota.t>=1){rota.i++;if(rota.i>=rota.path.length-1){const fim=rota.path[rota.path.length-1];PR().pos=fim;salvar();rota=null;heroi={x:NOD[fim].x,y:NOD[fim].y};abrir(fim)}else{rota.seg=[rota.path[rota.i],rota.path[rota.i+1]];rota.t=0}}
   if(rota){if(tick%14===0)sfx('passo');const[a2,b2]=rota.seg;const A2=NOD[a2],B2=NOD[b2];heroi={x:A2.x+(B2.x-A2.x)*rota.t,y:A2.y+(B2.y-A2.y)*rota.t}}}
  const tx=Math.max(0,Math.min(W-VW,heroi.x-VW/2)),ty=Math.max(0,Math.min(H-VH,heroi.y-VH/2));cam.x+= (tx-cam.x)*.12;cam.y+=(ty-cam.y)*.12;
  if(visao){cv.width!==W&&(cv.width=W,cv.height=H,cx.imageSmoothingEnabled=false);cx.drawImage(base,0,0);desenhaCamada(0,0)}
  else{cv.width!==VW&&(cv.width=VW,cv.height=VH,cx.imageSmoothingEnabled=false);const ox=Math.round(cam.x),oy=Math.round(cam.y);cx.drawImage(base,ox,oy,VW,VH,0,0,VW,VH);desenhaCamada(ox,oy)}
  posLabels()}
 requestAnimationFrame(desenha)}
function desenhaCamada(ox,oy){cx.save();cx.translate(-ox,-oy);
 for(const id in NOD){const n=NOD[id];icone(n,n.x,n.y,tick);const st=estado(id);
  if(st==='feito'){R(n.x+9,n.y-14,1,9,'#ddd');R(n.x+10,n.y-14,5,3,'#7ae582')}
  else if(st==='disp'){const b=Math.round(Math.sin(tick/8)*2);R(n.x-2,n.y-22+b,5,2,'#ffcf4a');R(n.x-1,n.y-20+b,3,2,'#ffcf4a');R(n.x,n.y-18+b,1,1,'#ffcf4a')}}
 // névoa nas regiões bloqueadas
 LV.fases.forEach((f,k)=>{if(faseLiberada(k))return;const[x0,y0]=OFF[k];R(x0,y0,320,184,'rgba(20,17,42,.86)');
  for(let i=0;i<40;i++){const px=x0+((i*53+tick*0.3)%320),py=y0+((i*37)%184);R(px,py,14,3,'rgba(184,176,214,.10)')}
  R(x0+150,y0+82,20,16,'#8a84a8');R(x0+154,y0+76,12,6,'#8a84a8');R(x0+157,y0+79,6,3,'rgba(20,17,42,1)');R(x0+158,y0+88,4,5,'#14112a')});
 const pul=rota?((tick>>2)%2):0;R(heroi.x-4,heroi.y+3,9,2,'rgba(0,0,0,.3)');spr(cx,HERO,AVS[S.av],heroi.x-4,heroi.y-9-pul);cx.restore()}
let LBL=[];
function criarLabels(){const m=$('mapa');m.querySelectorAll('.lbl').forEach(e=>e.remove());LBL=[];
 for(const id in NOD){const e=el('div',{class:'lbl'},NOD[id].nome);m.append(e);LBL.push([id,e])}
 LV.fases.forEach((f,k)=>{const e=el('div',{class:'lbl regiao'},`Região ${k+1}: ${f.nome}`);m.append(e);LBL.push(['@'+k,e])})}
function posLabels(){const ox=visao?0:cam.x,oy=visao?0:cam.y,vw=visao?W:VW,vh=visao?H:VH;
 for(const[id,e]of LBL){let x,y,show;
  if(id[0]==='@'){const k=+id.slice(1);x=OFF[k][0]+160;y=OFF[k][1]+92;show=visao;e.className='lbl regiao'+(faseLiberada(k)?(faseCompleta(k)?' feito':' disp'):' trava')}
  else{const n=NOD[id];x=n.x;y=n.y+8;show=!visao&&faseLiberada(n.fase);e.className='lbl '+estado(id)}
  const px=(x-ox)/vw*100,py=(y-oy)/vh*100;show=show&&px>2&&px<98&&py>0&&py<96;e.hidden=!show;if(show){e.style.left=px+'%';e.style.top=py+'%'}}}

// ---------- HUD, diário, viagem ----------
function hud(){if(!S)return;$('hNome').textContent=S.nome;$('hVida').textContent='♥'.repeat(S.vida)+'♡'.repeat(5-S.vida);
 const n=nivel(S.xp);$('hNivel').textContent=n[1];$('hXp').textContent=S.xp;const pn=proxNivel(S.xp);$('hXpBar').style.width=pn?((S.xp-n[0])/(pn-n[0])*100)+'%':'100%';
 $('hDif').textContent=LV?LV.nome.toUpperCase():'—';
 $('hSelos').replaceChildren(...S.selos.map(k=>el('span',{class:'selo',title:SELOS[k][1]},SELOS[k][0])));if(LV)diario()}
function diario(){const L=$('lista');L.replaceChildren();$('dTit').textContent=LV.titulo.toUpperCase();
 LV.fases.forEach((f,k)=>{const lib=faseLiberada(k);L.append(el('div',{class:'reg'+(lib?'':' trava')},`Região ${k+1} • ${f.nome}`,lib&&PR().hist[k]?el('button',{class:'mini',type:'button',on:{click:()=>historia(k,fechar)}},'história'):null));
  if(!lib){L.append(el('div',{class:'dica'},'Região coberta pela névoa.'));return}
  for(const id of Object.keys(f.lugares)){const n=NOD[id],st=estado(id);const b=el('button',{class:'lugar '+st,type:'button',on:{click:()=>viajar(id)}},n.nome+(n.extra?' (opcional)':''),el('small',{},st==='feito'?'concluído':st==='disp'?'disponível':'bloqueado'));if(st==='trava')b.disabled=true;L.append(b)}})}
function caminho(de,para){const fila=[[de]],vis=new Set([de]);while(fila.length){const p=fila.shift(),u=p[p.length-1];if(u===para)return p;
 for(const[a,b]of EDG){const v=a===u?b:b===u?a:null;if(v&&!vis.has(v)&&(PR().feito[v]||disponivel(v))){vis.add(v);fila.push([...p,v])}}}return null}
function viajar(id){if(rota||!$('veu').hidden)return;if(visao)alternarVisao();if(estado(id)==='trava'){toast('Bloqueado: vença os lugares anteriores.');return}
 const pos=PR().pos||primeiro(0);if(id===pos){abrir(id);return}const p=caminho(pos,id);if(!p){heroi={x:NOD[id].x,y:NOD[id].y};PR().pos=id;abrir(id);return}rota={path:p,i:0,seg:[p[0],p[1]],t:0}}
cv.addEventListener('click',ev=>{if(!S||!LV)return;if(visao){alternarVisao();return}const r=cv.getBoundingClientRect();const x=(ev.clientX-r.left)/r.width*VW+cam.x,y=(ev.clientY-r.top)/r.height*VH+cam.y;
 let best=null,bd=18;for(const id in NOD){const d=Math.hypot(NOD[id].x-x,NOD[id].y-y);if(d<bd){bd=d;best=id}}if(best)viajar(best)});
function alternarVisao(){visao=!visao;$('btnVisao').textContent=visao?'Voltar ao herói':'Mapa completo';$('btnVisao').setAttribute('aria-pressed',visao)}

// ---------- cenas ----------
function cena(...kids){$('cena').classList.remove('largo');$('cena').replaceChildren(...kids.filter(Boolean));$('veu').hidden=false;$('cena').scrollTop=0;const f=$('cena').querySelector('.acoes button:last-child,input');if(f)f.focus()}
function fechar(){$('veu').hidden=true;hud();musica('mapa')}
function retrato(cor){const c=el('canvas',{width:16,height:16});spr(c.getContext('2d'),['....kkkkkk......','...kHHHHHHk.....','..kHHHHHHHHk....','..kFFFFFFFFk....','..kFkFFFkFFk....','..kFFFFFFFFk....','..kFFFkkFFFk....','...kFFFFFFk.....','..kCCCCCCCCk....','.kCCCCCCCCCCk...','.kCCCCCCCCCCk...','.kCCCCCCCCCCk...'],{H:cor,F:'#f1c27d',C:cor},2,2);return c}
function monstro(cor,olho){const c=el('canvas',{width:24,height:24});spr(c.getContext('2d'),['........kkkkkkkk........','......kkMMMMMMMMkk......','.....kMMMMMMMMMMMMk.....','....kMMMMMMMMMMMMMMk....','...kMMMLLMMMMMMLLMMMk...','...kMMMLOkMMMMLOkMMMk...','..kMMMMLkkMMMMLkkMMMMk..','..kMMMMMMMMMMMMMMMMMMk..','..kMMMMMMMMMMMMMMMMMMk..','..kMMMkwkwkwkwkwkMMMMk..','..kMMMMkkkkkkkkkkMMMMk..','..kMMMMMMMMMMMMMMMMMMk..','.kMMMMMMMMMMMMMMMMMMMMk.','.kMMMMMMMMMMMMMMMMMMMMk.','kMMkMMMMMMkMMMMMMMMkMMMk','kkk.kkkkkk.kkkkkkk..kkk.'],{M:cor,L:'#ffffff',O:olho,w:'#ffffff'},0,4);return c}
function tabelaEl(rows){return el('div',{class:'tbw'},el('table',{class:'tb'},...rows.map((r,i)=>el('tr',{},...r.map(c=>el(i?'td':'th',{},c))))))}
function arte(key){const c=el('canvas',{width:96,height:54,class:'arte'});const g=c.getContext('2d');const r=(x,y,w,h,col)=>R(x,y,w,h,col,g);
 const ceu=LV&&LV.bioma==='cristal'?'#1b1536':LV&&LV.bioma==='neve'?'#9fc5e8':LV&&LV.bioma==='savana'?'#f6bd60':'#8ecae6';r(0,0,96,54,ceu);r(0,40,96,14,B.g[0]);for(let i=0;i<96;i+=7)r(i,40,3,1,B.g[2]);
 const lin=(x,y,w,n,col)=>{for(let i=0;i<n;i++)r(x,y+i*3,w,1,col)};
 const caixa=(x,y,w,h,col,txt)=>{r(x,y,w,h,'#14112a');r(x+1,y+1,w-2,h-2,col)};
 switch(key){
  case'caderno':r(30,12,36,26,'#f6ecd0');r(47,12,2,26,'#c9a46a');lin(33,16,12,6,'#7aa6c2');lin(51,16,12,6,'#7aa6c2');r(66,20,3,14,'#e63946');break;
  case'chuva':r(30,22,36,16,'#c9d6df');lin(33,25,28,4,'#7aa6c2');r(44,26,10,8,'#5c7c99');for(let i=0;i<14;i++)r((i*13+tick)%96,(i*7+tick*2)%40,1,3,'#3a86ff');r(0,0,96,6,'#6c757d');break;
  case'pc':r(28,10,40,26,'#14112a');r(30,12,36,20,'#023047');lin(33,15,20,5,'#80ed99');r(44,36,8,4,'#495057');r(36,40,24,2,'#495057');break;
  case'ram':r(10,18,34,12,'#2d6a4f');for(let i=0;i<5;i++)r(13+i*6,21,4,6,'#14112a');for(let i=0;i<8;i++)r(11+i*4,30,2,3,'#ffd166');r(48,22,8,3,'#ffcf4a');r(54,20,2,7,'#ffcf4a');r(60,14,26,22,'#6c757d');r(64,18,18,14,'#adb5bd');r(72,24,3,3,'#14112a');break;
  case'servidor':for(let j=0;j<3;j++){r(34,8+j*10,28,8,'#343a40');r(37,11+j*10,10,2,'#6c757d');r(55,11+j*10,2,2,(tick+j*10)%40<20?'#80ed99':'#38b000')}r(12,26,14,10,'#023047');r(26,30,8,1,'#ffcf4a');r(62,30,10,1,'#ffcf4a');r(72,26,14,10,'#023047');break;
  case'mapa':r(18,8,60,32,'#f6ecd0');r(18,8,60,2,'#c9a46a');for(let i=0;i<40;i+=4)r(24+i,20+Math.round(Math.sin(i/6)*6),2,2,'#b5442e');r(70,14,4,4,'#e63946');r(22,30,4,4,'#2a9d8f');break;
  case'tabela':case'tipos':caixa(14,8,68,30,'#f8f9fa');r(15,9,66,6,'#004f8b');for(let i=1;i<4;i++)r(14+i*17,9,1,28,'#adb5bd');for(let j=1;j<4;j++)r(15,15+j*7,66,1,'#adb5bd');if(key==='tipos'){r(17,17,12,2,'#e63946');r(34,17,12,2,'#2a9d8f');r(51,17,12,2,'#f4a261')}break;
  case'livro':r(22,12,24,26,'#e63946');r(46,12,24,26,'#457b9d');r(45,12,2,26,'#14112a');lin(25,16,18,6,'#ffe5ec');lin(49,16,18,6,'#e0fbfc');break;
  case'cadeado':r(38,8,20,4,'#adb5bd');r(38,8,4,16,'#adb5bd');r(54,8,4,16,'#adb5bd');r(32,20,32,20,'#ffd166');r(46,26,4,8,'#14112a');break;
  case'dupla':for(const x of[24,58]){r(x,12,14,12,'#f1c27d');r(x-1,9,16,5,'#5a3825');r(x+3,16,2,2,'#14112a');r(x+9,16,2,2,'#14112a');r(x-2,24,18,16,'#e63946')}r(44,18,8,8,'#ffd166');r(47,20,2,3,'#14112a');r(47,24,2,1,'#14112a');break;
  case'chave':r(24,20,14,14,'#ffd166');r(28,24,6,6,ceu);r(38,25,30,4,'#ffd166');r(60,29,3,5,'#ffd166');r(66,29,3,5,'#ffd166');break;
  case'mer':caixa(8,14,28,14,'#e0fbfc');caixa(60,14,28,14,'#e0fbfc');r(36,21,24,1,'#14112a');r(38,17,2,4,'#14112a');r(56,17,1,4,'#14112a');r(55,17,3,1,'#14112a');lin(12,18,20,2,'#457b9d');lin(64,18,20,2,'#457b9d');break;
  case'portao':r(26,8,8,32,'#7b7b86');r(62,8,8,32,'#7b7b86');r(26,6,44,6,'#5c5c66');for(let i=36;i<62;i+=5)r(i,12,2,28,'#2b2b33');break;
  case'barbearia':r(24,16,44,24,'#f1e3c6');r(22,10,48,7,'#264653');r(42,28,8,12,'#5b3a1e');r(28,22,10,6,'#a8dadc');for(let j=0;j<16;j++)r(72,16+j,4,1,['#d62828','#fff','#1d4e89'][(j+(tick>>3))%3]);break;
  case'dragao':r(30,16,36,18,'#d62828');r(60,10,16,12,'#d62828');r(70,13,3,3,'#ffd166');r(22,8,14,10,'#9d0208');r(76,18,14,3,(tick%30<15)?'#ffb703':'#f48c06');r(34,34,6,6,'#9d0208');r(54,34,6,6,'#9d0208');break;
  case'planilha':caixa(10,8,76,30,'#e9f5db');r(11,9,74,5,'#38b000');for(let i=1;i<5;i++)r(10+i*15,9,1,28,'#95d5b2');for(let j=1;j<4;j++)r(11,14+j*7,74,1,'#95d5b2');r(42,16,14,5,'#ffadad');break;
  case'balanca':r(47,8,2,30,'#6c757d');r(26,10,44,2,'#6c757d');r(22,18,16,3,'#ffd166');r(58,18,16,3,'#ffd166');r(28,12,1,6,'#6c757d');r(66,12,1,6,'#6c757d');r(40,38,16,3,'#6c757d');break;
  case'cartorio':r(26,10,44,28,'#e5e5e5');r(24,6,48,5,'#5a189a');r(56,24,10,10,'#e63946');r(58,26,6,6,'#ffd166');lin(30,14,22,6,'#adb5bd');break;
  case'pet':r(30,20,30,14,'#d4a373');r(56,12,14,14,'#d4a373');r(58,10,3,4,'#6f4518');r(66,10,3,4,'#6f4518');r(64,17,2,2,'#14112a');r(32,34,4,6,'#6f4518');r(52,34,4,6,'#6f4518');r(24,20,6,2,'#d4a373');break;
  case'sql':r(12,8,72,32,'#14112a');lin(16,12,40,2,'#4cc9f0');lin(20,18,50,3,'#80ed99');r(16,32,4,3,(tick%40<20)?'#f8f9fa':'#14112a');break;
  case'forja':r(30,24,36,16,'#495057');r(36,20,24,4,'#6c757d');r(40,28,16,8,(tick%20<10)?'#f48c06':'#e85d04');r(66,14,4,16,'#adb5bd');r(64,12,8,4,'#6c757d');break;
  case'muralha':r(8,14,80,26,'#8a8fa8');for(let i=8;i<88;i+=8)r(i,10,4,4,'#8a8fa8');for(let j=18;j<40;j+=5)r(8,j,80,1,'#6c7086');r(42,26,12,14,'#3d3550');break;
  case'fogo':for(let i=0;i<12;i++){const h=8+((i*7+tick)%14);r(20+i*5,40-h,4,h,i%2?'#f48c06':'#e85d04')}r(36,14,24,8,'#14112a');r(39,16,18,1,'#ef233c');break;
  case'java':r(34,18,26,18,'#f8f9fa');r(36,20,22,6,'#6f4518');r(60,22,6,8,'#f8f9fa');r(62,24,2,4,ceu);r(30,36,34,3,'#adb5bd');for(let i=0;i<3;i++)r(40+i*6,6+((tick>>3)+i)%4,2,8,'rgba(255,255,255,.7)');break;
  case'pipoca':r(34,14,28,26,'#e63946');for(let i=0;i<4;i++)r(36+i*7,14,3,26,'#fff');for(let i=0;i<7;i++)r(32+i*5,8+(i%2)*3,6,6,'#fff3b0');r(44,6,6,5,'#ffd166');break;
  case'cinema':r(8,6,80,28,'#14112a');r(10,8,76,24,(tick%60<30)?'#3a86ff':'#4cc9f0');r(30,14,36,10,'#ffd166');r(34,17,28,4,'#14112a');for(let i=0;i<8;i++)r(10+i*10,38,6,6,'#9d0208');break;
  case'claquete':r(26,18,44,22,'#14112a');for(let i=0;i<5;i++)r(28+i*9,(tick%40<20)?10:14,6,6,i%2?'#fff':'#14112a');r(26,14,44,4,'#fff');r(30,24,20,2,'#fff');r(30,30,30,2,'#fff');break;
  case'classe':r(14,6,32,34,'#1d3557');r(16,8,28,30,'#457b9d');r(18,11,24,3,'#fff');r(18,18,20,1,'#a8dadc');r(18,22,20,1,'#a8dadc');r(18,28,16,1,'#a8dadc');r(50,20,6,2,'#ffd166');r(56,18,2,6,'#ffd166');for(const x of[62,78]){r(x-2,12,12,26,'#e63946');r(x,15,8,8,'#ffd166');r(x,26,8,2,'#fff')}break;
  case'heranca':r(46,24,4,16,'#5b3a1e');r(30,10,36,14,'#2d6a4f');r(36,4,24,8,'#40916c');r(20,28,12,10,'#ffd166');r(64,28,12,10,'#4cc9f0');r(32,30,14,1,'#5b3a1e');r(50,30,14,1,'#5b3a1e');break;
  case'interface':r(18,16,24,14,'#adb5bd');r(42,19,8,2,'#adb5bd');r(42,25,8,2,'#adb5bd');r(54,14,26,18,'#ffd166');r(56,18,6,3,'#14112a');r(56,25,6,3,'#14112a');if(tick%40<20)r(50,22,4,2,'#80ed99');break;
  case'lista':for(let i=0;i<5;i++){r(8+i*17,16,15,16,'#14112a');r(9+i*17,17,13,14,['#e63946','#457b9d','#ffd166','#2a9d8f','#9b5de5'][i]);r(13+i*17,34,4,3,'#fff')}if(tick%40<20)r(8+((tick>>4)%5)*17,12,15,2,'#fff');break;
  case'excecao':r(30,8,36,30,'#ffd166');r(32,10,32,26,'#14112a');r(46,14,4,12,'#ffd166');r(46,29,4,4,'#ffd166');if(tick%30<15)r(26,4,44,2,'#ef233c');break;
  case'arquivo':r(20,14,56,26,'#e9c46a');r(20,10,22,6,'#e9c46a');r(26,18,44,18,'#f8f9fa');for(let j=0;j<4;j++)r(29,21+j*4,30,1,'#adb5bd');break;
  case'relogio':r(32,6,32,32,'#f8f9fa');r(34,8,28,28,'#e0fbfc');r(47,10,2,12,'#14112a');{const a=tick/20;r(48+Math.round(Math.cos(a)*10),22+Math.round(Math.sin(a)*10),2,2,'#e63946')}r(46,21,4,4,'#14112a');break;
  case'threads':for(let k=0;k<3;k++){const y=10+k*10;r(8,y,80,2,'#495057');r(8+((tick*(k+1))%76),y-2,6,6,['#e63946','#ffd166','#4cc9f0'][k])}break;
  case'vilao':r(34,8,28,30,'#3a0ca3');r(30,4,36,8,'#14112a');r(40,16,5,4,(tick%30<15)?'#ff006e':'#ffd166');r(52,16,5,4,(tick%30<15)?'#ff006e':'#ffd166');r(42,26,12,2,'#ff006e');r(26,38,44,4,'#14112a');break;
  case'cofre':r(26,8,44,32,'#adb5bd');r(30,12,36,24,'#6c757d');r(44,20,8,8,'#ffd166');r(47,23,2,2,'#14112a');r(66,16,3,4,'#495057');break;
  case'robo':r(38,8,20,16,'#adb5bd');r(42,12,4,4,(tick%40<20)?'#4cc9f0':'#14112a');r(50,12,4,4,(tick%40<20)?'#4cc9f0':'#14112a');r(44,19,8,2,'#14112a');r(47,4,2,4,'#6c757d');r(46,2,4,2,'#e63946');r(36,24,24,14,'#8d99ae');r(30,26,6,3,'#8d99ae');r(60,26,6,3,'#8d99ae');r(40,38,5,2,'#495057');r(51,38,5,2,'#495057');r(42,28,12,6,'#14112a');r(43,29,(tick>>2)%10,4,'#80ed99');break;
  case'caixas':for(const[x,c,cor]of[[12,'gols',"#ffd166"],[38,'nome','#4cc9f0'],[64,'pontos','#80ed99']]){r(x,18,22,18,'#a0703c');r(x,18,22,4,'#8a5e30');r(x+3,24,16,8,'#f6ecd0');r(x+5,27,12,2,cor)}break;
  case'placar':r(14,6,68,30,'#14112a');r(16,8,64,26,'#1d3557');r(20,11,24,8,'#e63946');r(52,11,24,8,'#457b9d');r(26,23,10,9,(tick%40<20)?'#ffd166':'#ffb703');r(58,23,10,9,(tick%40<20)?'#ffd166':'#ffb703');r(45,26,6,2,'#fff');r(46,36,4,4,'#6c757d');break;
  case'laco':{const a=tick/10;for(let i=0;i<14;i++){const ang=a+i*0.45;r(48+Math.round(Math.cos(ang)*18),24+Math.round(Math.sin(ang)*12),3,3,i===0?'#ffd166':'#4cc9f0')}r(44,20,9,9,'#14112a');r(46,22,5,5,'#80ed99');break}
  case'bug':r(36,14,24,18,'#38b000');r(40,10,16,6,'#2d6a4f');r(42,12,3,3,'#ff006e');r(51,12,3,3,'#ff006e');for(let i=0;i<3;i++){r(28,17+i*5,8,1,'#14112a');r(60,17+i*5,8,1,'#14112a')}r(47,14,2,18,'#14112a');r(40,4,1,6,'#14112a');r(55,4,1,6,'#14112a');if(tick%30<15)r(64,6,14,6,'#e63946');break;
  case'trofeu':r(38,8,20,14,'#ffd166');r(32,10,6,6,'#ffd166');r(58,10,6,6,'#ffd166');r(34,12,3,3,ceu);r(59,12,3,3,ceu);r(45,22,6,8,'#e9b33b');r(38,30,20,6,'#8d6e63');r(42,12,3,6,(tick%40<20)?'#fff':'#ffe8a3');break;
  case'apito':r(26,18,30,14,'#adb5bd');r(56,22,14,6,'#adb5bd');r(30,22,10,6,'#14112a');r(18,14,8,3,'#e63946');if(tick%20<10){r(74,16,6,1,'#fff');r(74,24,8,1,'#fff');r(74,32,6,1,'#fff')}break;
  case'celular':r(38,6,20,34,'#14112a');r(40,9,16,26,'#4cc9f0');r(42,12,12,3,'#fff');r(42,18,12,2,'#ffd166');r(42,22,8,2,'#ffd166');r(46,36,4,2,'#495057');break;
  case'estadio':r(6,20,84,20,'#2d6a4f');r(6,20,84,2,'#fff');r(47,20,2,20,'#fff');r(40,26,16,8,'#2d6a4f');r(41,27,14,6,'#fff');r(42,28,12,4,'#2d6a4f');for(let i=0;i<14;i++)r(8+i*6,10,4,8,['#e63946','#457b9d','#ffd166'][i%3]);r((tick)%84+6,30,3,3,'#fff');break;
  case'escritorio':r(10,10,76,30,'#e9ecef');for(let i=0;i<4;i++){r(14+i*18,14,12,8,'#8ecae6');r(14+i*18,26,12,8,'#8ecae6')}r(40,30,16,10,'#5b3a1e');r(6,6,84,4,'#004f8b');r(36,6,24,4,'#f39200');break;
  case'word':caixa(24,6,48,34,'#f8f9fa');r(25,7,46,5,'#2b579a');r(28,8,8,3,'#fff');lin(28,16,40,7,'#adb5bd');r(28,16,20,1,'#14112a');if(tick%40<20)r(49,34,1,3,'#14112a');break;
  case'email':r(20,12,56,28,'#f8f9fa');r(20,12,56,2,'#0078d4');for(let i=0;i<14;i++){r(20+i*2,14+i,2,1,'#0078d4');r(74-i*2,14+i,2,1,'#0078d4')}r(62+((tick>>2)%8),6,10,6,'#ffd166');r(64+((tick>>2)%8),8,6,1,'#e63946');break;
  case'agenda':caixa(22,8,52,32,'#f8f9fa');r(23,9,50,6,'#0078d4');for(let j=0;j<3;j++)for(let i=0;i<5;i++)r(26+i*10,18+j*7,7,5,(i+j*5)===((tick>>4)%15)?'#ffd166':'#dee2e6');r(30,4,3,7,'#495057');r(62,4,3,7,'#495057');break;
  case'slides':r(16,6,64,32,'#14112a');r(18,8,60,28,'#d24726');r(22,12,30,4,'#fff');lin(22,20,24,4,'#ffe5d9');r(54,18,20,14,'#ffd166');r(46,38,4,6,'#495057');r(36,44,24,2,'#495057');break;
  case'grafico':caixa(12,6,72,34,'#f8f9fa');for(let i=0;i<5;i++){const hh=6+i*5+((tick>>4)%2);r(18+i*12,36-hh,8,hh,['#217346','#33a06f','#4cc9f0','#f4a261','#e63946'][i])}for(let i=0;i<4;i++)r(22+i*12,30-i*5,12,1,'#14112a');break;
  case'ia':r(36,8,24,20,'#4cc9f0');r(40,13,5,5,'#14112a');r(51,13,5,5,'#14112a');r(41,14,2,2,(tick%30<15)?'#fff':'#ffd166');r(52,14,2,2,(tick%30<15)?'#fff':'#ffd166');r(43,22,10,2,'#14112a');r(47,4,2,4,'#adb5bd');r(45,2,6,2,'#ff006e');for(let i=0;i<6;i++)r(10+i*4,30+((i*3+tick>>2)%10),2,2,'#ffd166');for(let i=0;i<6;i++)r(64+i*4,30+((i*5+tick>>2)%10),2,2,'#c77dff');break;
  case'skills':for(const[x,c]of[[22,'#2a9d8f'],[58,'#e63946']]){r(x,10,16,14,'#f1c27d');r(x-1,7,18,5,'#5a3825');r(x+3,14,2,2,'#14112a');r(x+11,14,2,2,'#14112a');r(x-2,24,20,16,c)}r(42,20,12,4,'#ffd166');r(46,16,4,12,'#ffd166');break;
  default:r(40,14,16,16,'#ffd166')}
 return c}
function historia(k,depois){musica('mapa');const f=LV.fases[k];let i=0;
 function mostra(){const p=f.hist[i];const ult=i===f.hist.length-1;
  cena(el('h2',{class:'historia'},`${LV.nome} • Região ${k+1}: ${f.nome}`),el('div',{class:'dica'},`História ${i+1} de ${f.hist.length}`),arte(p.cena),
   el('div',{class:'npc'},retrato(p.c),el('div',{class:'fala'},el('span',{class:'quem'},p.q.toUpperCase()),p.t)),
   p.tabela?tabelaEl(p.tabela):null,p.codigo?el('pre',{class:'cod'},p.codigo):null,
   el('div',{class:'acoes'},PR().hist[k]?el('button',{class:'sec',type:'button',on:{click:()=>depois()}},'Pular'):null,i>0?el('button',{class:'sec',type:'button',on:{click:()=>{i--;mostra()}}},'◀ Voltar'):null,
    el('button',{type:'button',on:{click:()=>{if(ult){PR().hist[k]=true;salvar();depois()}else{i++;mostra()}}}},ult?'Começar ▶':'Próximo ▶')))}
 mostra()}
function dialogo(id,depois){const n=NOD[id];const txt=el('span');let i=0;const tt=setInterval(()=>{i+=2;txt.textContent=n.fala.slice(0,i);if(i>=n.fala.length)clearInterval(tt)},18);
 cena(el('h2',{},n.nome),el('div',{class:'npc'},retrato(n.npcCor),el('div',{class:'fala'},el('span',{class:'quem'},n.npc.toUpperCase()),txt)),
  el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:()=>{clearInterval(tt);fechar()}}},'Voltar ao mapa'),el('button',{class:'sec',type:'button',on:{click:()=>{clearInterval(tt);historia(n.fase,()=>abrir(id))}}},'Reler a história'),el('button',{type:'button',on:{click:()=>{clearInterval(tt);depois()}}},'Continuar ▶')))}
function pergaminho(k,depois,rot){const c=CARDS[k];const d=el('div',{class:'perg'},el('h3',{},`PERGAMINHO • ${c.t.toUpperCase()}`));c.p.forEach(t=>d.append(el('p',{},t)));d.append(el('p',{class:'ex'},'Na Horizonte: '+c.ex));
 cena(el('h2',{},'Estude antes da batalha'),el('div',{class:'dica'},'Sala invertida: leia com calma. Você pode ser o especialista que vai explicar este tema para a turma.'),d,el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:fechar}},'Voltar ao mapa'),el('button',{type:'button',on:{click:depois}},rot||'Estou pronto para a batalha ⚔')))}
function abrir(id){const n=NOD[id];if(!PR().hist[n.fase])return historia(n.fase,()=>abrir(id));
 if(n.tipo==='batalha'){if(PR().feito[id])return dialogo(id,()=>n.card!=null?pergaminho(n.card,fechar,'Fechar pergaminho'):fechar());return dialogo(id,()=>n.card!=null?pergaminho(n.card,()=>batalha(id)):batalha(id))}
 if(n.tipo==='portao'){if(PR().feito[id])return toast('Portão aberto. Siga em frente!');return dialogo(id,()=>codigo(id,()=>{PR().feito[id]=true;salvar();ganharXP(10,'Portão aberto');concluiu(id)}))}
 if(n.tipo==='missoes')return dialogo(id,()=>missoes(id));
 if(n.tipo==='chefao'){if(PR().feito[id])return ficha();if(PR().abertos[id])return chefao(id);return dialogo(id,()=>codigo(id,()=>{PR().abertos[id]=true;salvar();chefao(id)}))}}
function codigo(id,ok){const n=NOD[id];const inp=el('input',{id:'cod-'+id,autocomplete:'off','aria-label':'Código do Mestre',placeholder:'CÓDIGO'});const fb=el('div',{class:'fb',hidden:''});
 const tentar=()=>{if(inp.value.trim().toUpperCase()===n.codigo){sfx('porta');ok()}else{sfx('erro');fb.hidden=false;fb.className='fb no';fb.textContent='Código errado. Peça ao Mestre (professor).';inp.classList.add('tremer');setTimeout(()=>inp.classList.remove('tremer'),400)}};
 inp.addEventListener('keydown',e=>{if(e.key==='Enter')tentar()});
 cena(el('h2',{},n.nome),el('div',{class:'fala'},'Digite o código que o Mestre falar:'),inp,fb,el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:fechar}},'Voltar'),el('button',{type:'button',on:{click:tentar}},'Abrir')))}
// conclusão de lugar / região / nível
function concluiu(id){const k=NOD[id].fase;
 if(faseCompleta(k)&&!PR().abertos['@fase'+k]){PR().abertos['@fase'+k]=true;salvar();setTimeout(()=>sfx('fanfarra'),350);
  if(nivelCompleto(LV)){darSelo(LV.id);const i=LEVELS.indexOf(LV);const prox=LEVELS[i+1];if(prox)S.lib[prox.id]=true;salvar();
   return cena(el('h2',{},`Nível ${LV.nome} concluído!`),el('div',{class:'fala'},`Você completou "${LV.titulo}". `+(prox?`O nível ${prox.nome} ("${prox.titulo}") foi liberado.`:'Você é lenda no Escritório Pixel!')),
    el('div',{class:'dica'},'Ótimo momento para salvar e anotar o código!'),botoesSSS(telaNiveis))}
  const prox=LV.fases[k+1];
  return cena(el('h2',{},'Nova região revelada!'),arte('mapa'),el('div',{class:'fala'},`A névoa se abriu. A Região ${k+2}, ${prox.nome}, agora faz parte do seu mapa. Use "Mapa completo" para ver como as regiões se encaixam.`),
   el('div',{class:'dica'},'Ótimo momento para salvar e anotar o código!'),botoesSSS(()=>historia(k+1,()=>{const f=primeiro(k+1);viajar2(f)})))}
 fechar()}
function viajar2(id){fechar();setTimeout(()=>viajar(id),50)}

// ---------- batalha ----------
function batalha(id){musica('batalha');const n=NOD[id];const[nomeI,corI,olhoI]=n.inimigo;const fila=Q[n.qs].map(q=>({...q,errou:false}));const total=fila.length;let ac=0,errosB=0;
 const mon=monstro(corI,olhoI),hp=el('i',{style:'width:100%'}),fb=el('div',{class:'fb',hidden:''}),qt=el('div',{class:'fala'}),ops=el('div',{class:'ops'}),prox=el('button',{type:'button',hidden:''},'Próximo ▶');
 function mostra(){fb.hidden=true;prox.hidden=true;const q=fila[0];qt.textContent=q.q;ops.replaceChildren(...q.o.map((t,i)=>({t,i})).sort(()=>Math.random()-.5).map(o=>el('button',{type:'button',on:{click:ev=>resp(o.i,ev.currentTarget)}},o.t)))}
 function resp(i,btn){const q=fila[0];ops.querySelectorAll('button').forEach(b=>b.disabled=true);
  if(i===q.c){sfx('acerto');btn.classList.add('certo');ac++;hp.style.width=((total-ac)/total*100)+'%';mon.classList.add('tremer');setTimeout(()=>mon.classList.remove('tremer'),400);ganharXP(q.errou?3:10,'');fb.className='fb ok';fb.replaceChildren(el('b',{},'Acertou! '),'Por quê: '+q.e);fila.shift()}
  else{btn.classList.add('errado');errosB++;q.errou=true;errar(id);fb.className='fb no';fb.replaceChildren(el('b',{},'Ai! -1 vida. '),'Por que não: '+((q.w||[])[i-1]||'essa opção não atende ao que foi pedido.'),' ',el('br'),'Pense de novo: a pergunta volta no fim da batalha.');fila.push(fila.shift())}
  fb.hidden=false;prox.hidden=false;prox.focus();
  if(S.vida<=0){prox.textContent='Você desmaiou...';prox.onclick=()=>desmaio(id);return}
  prox.textContent=fila.length?'Próximo ▶':'Vitória! ▶';prox.onclick=()=>fila.length?mostra():vitoria(id,errosB)}
 cena(el('h2',{},'Batalha: '+nomeI),el('div',{class:'arena'},mon,el('div',{},el('div',{class:'dica'},`${nomeI} • ${total} golpes para vencer`),el('div',{class:'hpb'},hp))),qt,ops,fb,el('div',{class:'acoes'},prox));mostra()}
function desmaio(id){sfx('desmaio');S.vida=5;salvar();hud();const n=NOD[id];cena(el('h2',{},'Você desmaiou!'),el('div',{class:'fala'},'O curandeiro recuperou as suas vidas. O XP continua. Releia a história ou o pergaminho e tente de novo.'),
 el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:fechar}},'Voltar ao mapa'),el('button',{type:'button',on:{click:()=>n.card!=null?pergaminho(n.card,()=>batalha(id)):batalha(id)}},'Tentar de novo')))}
function vitoria(id,errosB){sfx('vitoria');PR().feito[id]=true;S.vida=Math.min(5,S.vida+1);salvar();
 if(NOD[id].selo&&!errosB)darSelo(NOD[id].selo);hud();
 const k=NOD[id].fase;if(faseCompleta(k)&&!PR().abertos['@fase'+k])return concluiu(id);
 cena(el('h2',{},'Vitória!'),el('div',{class:'fala'},`${NOD[id].inimigo[0]} foi derrotado. Você recuperou 1 vida.`),el('div',{class:'dica'},'E agora? Seguir continua a aventura. Salvar mostra o código para você anotar. Sair fecha o jogo.'),botoesSSS())}
function botoesSSS(seguir){return el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:sair}},'Sair'),el('button',{class:'sec',type:'button',on:{click:()=>salvarCodigo(seguir)}},'Salvar 💾'),el('button',{type:'button',on:{click:seguir||fechar}},'Seguir ▶'))}
function salvarCodigo(depois){if(!S)return;const cod=gerarCodigo(S);ultimoCod=cod;sujo=false;regSalvar(S,cod,'jogo');sfx('selo');
 const env=el('div',{class:'dica',id:'envStatus'},NUVEM_URL?'Enviando para o professor…':'');if(NUVEM_URL){const x=regLer().find(y=>normNome(y.nome)===normNome(S.nome));nuvemEnviar(x).then(ok=>{env.textContent=ok?'✔ Progresso enviado para a planilha do professor.':'Sem internet agora: o envio para o professor será feito depois, sozinho.'})}
 cena(el('h2',{},'Código de salvamento'),el('div',{class:'fala'},'Anote no caderno, exatamente assim:'),el('div',{class:'codsalvo',id:'codSalvo'},cod),env,
  el('div',{class:'dica'},`Para continuar outro dia (em qualquer computador): abra o jogo, digite o nome "${S.nome}" do mesmo jeito e este código. Cada vez que você salva, sai um código novo: use sempre o último.`),
  el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:()=>{S=null;LV=null;fechar();inicio()}}},'Sair do jogo'),el('button',{type:'button',on:{click:depois||fechar}},'Já anotei, seguir ▶')))}
function sair(){if(!S)return inicio();if(!sujo){S=null;LV=null;fechar();return inicio()}sfx('erro');
 cena(el('h2',{},'⚠ Atenção!'),el('div',{class:'fala alerta'},'Você ainda não salvou o que fez desde o último código. Se sair agora, esse progresso será PERDIDO.'),
  el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:()=>{S=null;LV=null;sujo=false;fechar();inicio()}}},'Sair sem salvar'),el('button',{class:'sec',type:'button',on:{click:()=>salvarCodigo()}},'Salvar 💾'),el('button',{type:'button',on:{click:fechar}},'Voltar ao jogo')))}

// ---------- missões ----------
function regrasBox(r){return el('div',{class:'regras'},...r.map(([a,b])=>el('div',{},el('b',{},a),el('span',{},b))))}
function chipsEl(ops,sel){return el('div',{class:'chips'},...ops.map(o=>{const b=el('button',{class:'chip',type:'button','aria-pressed':'false',on:{click:()=>{sel.has(o)?sel.delete(o):sel.add(o);b.setAttribute('aria-pressed',sel.has(o))}}},o);return b}))}
function missoes(id){const M=MISSOES[NOD[id].miss];const idx=PR().missao[id]||0;
 if(idx>=M.lista.length){PR().feito[id]=true;salvar();if(faseCompleta(NOD[id].fase))return concluiu(id);return cena(el('h2',{},'Missões concluídas!'),el('div',{class:'fala'},'Missões cumpridas! Siga para o próximo lugar do mapa. Portão do Mestre e Chefão pedem o código que o Mestre libera para a turma.'),el('div',{class:'acoes'},el('button',{type:'button',on:{click:fechar}},'Voltar ao mapa')))}
 const m=M.lista[idx];let errosM=0;const fb=el('div',{class:'fb',hidden:''});let corpo,ler;
 if(m.tipo==='chips'){const sel=new Set();corpo=chipsEl(m.ops,sel);ler=()=>{const f=m.certo.filter(c=>!sel.has(c)),s=[...sel].filter(c=>!m.certo.includes(c));return{ok:!f.length&&!s.length,msg:(f.length?'Faltou: '+f.join(', ')+'. ':'')+(s.length?'Não entra: '+s.join(', ')+'. ':'')}}}
 else if(m.tipo==='escrever'){const PRt=PR();PRt.textos=PRt.textos||{};const chave=id+'#'+idx;
  const ta=el('textarea',{id:'w-'+chave,rows:String(m.linhas||8),spellcheck:'false',class:m.modo==='formula'?'cod escreve':'escreve','aria-label':'Sua resposta',placeholder:m.ph||''});ta.value=PRt.textos[chave]||(m.inicio||'');
  ta.addEventListener('input',()=>{PRt.textos[chave]=ta.value;salvar()});
  ta.addEventListener('keydown',ev=>{if(ev.key==='Tab'){ev.preventDefault();const s=ta.selectionStart;ta.value=ta.value.slice(0,s)+'    '+ta.value.slice(ta.selectionEnd);ta.selectionStart=ta.selectionEnd=s+4;PRt.textos[chave]=ta.value;salvar()}});
  const testes=(m.testes||[]).map(t=>{const c=el('input',{type:'checkbox'});return[c,el('label',{class:'teste'},c,' ',t)]});
  corpo=el('div',{style:'display:grid;gap:8px'},el('div',{class:'dica'},m.modo==='formula'?'Uma fórmula por linha, começando com = . No Excel em português: ; separa argumentos, : indica intervalo e texto vai entre aspas.':m.modo==='email'?'Escreva como num e-mail de verdade: Assunto na primeira linha, depois saudação, texto, despedida e assinatura.':'Escreva em português, com as suas palavras.'),ta,
   testes.length?el('div',{class:'dica'},'Agora faça no Office (Word, Excel ou Outlook) e marque só o que deu certo:'):null,...testes.map(t=>t[1]));
  ler=()=>{const v=ta.value;const linhas=v.split('\n').filter(l=>l.trim()).length;const f=[];
   if(linhas<(m.min||1))f.push(`escreva pelo menos ${m.min} linhas`);
   for(const[desc,re,fl]of(m.regras||[]))if(!new RegExp(re,fl||'i').test(v))f.push(desc);
   if(testes.some(t=>!t[0].checked))f.push('rode e marque todos os testes');
   return{ok:!f.length,msg:f.length?'Faltou: '+f.join('; ')+'.':''}}}
 else{const ss=m.itens.map(([rot,ops],k)=>[rot,el('select',{id:`m-${id}-${idx}-${k}`},el('option',{value:''},'escolha...'),...ops.map(o=>el('option',{value:o},o)))]);
  corpo=el('div',{style:'display:grid;gap:8px'},...ss.map(([rot,s])=>el('label',{class:'linha'},el('span',{},rot),s)));
  ler=()=>{const e=m.itens.filter((it,k)=>ss[k][1].value!==it[2]).map(it=>it[0]);return{ok:!e.length,msg:e.length?'Revise: '+e.join('; ')+'.':''}}}
 const btnC=el('button',{type:'button'},'Conferir ✓'),btnP=el('button',{type:'button',hidden:''},idx<M.lista.length-1?'Próxima missão ▶':'Concluir ▶');
 btnC.onclick=()=>{const r=ler();fb.hidden=false;if(r.ok){sfx('acerto');fb.className='fb ok';fb.textContent='Checkpoint aprovado! '+m.e;PR().missao[id]=idx+1;salvar();ganharXP(errosM?Math.round(m.xp/2):m.xp,m.t.split('•')[0]);btnC.hidden=true;btnP.hidden=false;btnP.focus()}
  else{errosM++;if(m.tipo!=='escrever')errar(id);fb.className='fb no';fb.textContent='Ainda não. '+r.msg+(m.tipo==='escrever'?'':' (-1 vida)');if(S.vida<=0){S.vida=5;salvar();hud();fb.textContent+=' Você desmaiou, mas recuperou as vidas.'}}};
 btnP.onclick=()=>missoes(id);
 cena(el('h2',{},`${m.t} • ${m.xp} XP`),el('details',{open:''},el('summary',{},'Regras de negócio'),regrasBox(M.regras)),el('div',{class:'fala'},m.txt),corpo,fb,el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:fechar}},'Pausar'),btnC,btnP))}

// ---------- chefão ----------
function chefao(id){musica('chefe');sfx('chefe');const C=CHEFES[NOD[id].chefe];let k=0;const total=C.etapas.length;const mon=monstro(C.cor,C.olho),hp=el('i',{style:'width:100%'});
 function mostra(){const et=C.etapas[k];const fb=el('div',{class:'fb',hidden:''});const prox=el('button',{type:'button',hidden:''},k<total-1?'Próximo golpe ▶':'Golpe final ▶');prox.onclick=()=>{k++;k<total?mostra():venceu()};let corpo,conf=null;
  const acerto=()=>{sfx('acerto');corpo.querySelectorAll('button').forEach(b=>b.disabled=true);if(conf)conf.hidden=true;hp.style.width=((total-k-1)/total*100)+'%';mon.classList.add('tremer');setTimeout(()=>mon.classList.remove('tremer'),400);fb.hidden=false;fb.className='fb ok';fb.textContent='Golpe certeiro! Por quê: '+et.e;prox.hidden=false;prox.focus()};
  const erro=t=>{errar(id);fb.hidden=false;fb.className='fb no';fb.textContent=t+' (-1 vida)';if(S.vida<=0){S.vida=3;salvar();hud()}};
  if(et.tipo==='chips'){const sel=new Set();corpo=chipsEl(et.ops,sel);conf=el('button',{type:'button',on:{click:()=>{(et.certo.every(c=>sel.has(c))&&sel.size===et.certo.length)?acerto():erro('O chefão revidou! Revise a escolha.')}}},'Atacar ⚔')}
  else corpo=el('div',{class:'ops'},...et.o.map((t,i)=>({t,i})).sort(()=>Math.random()-.5).map(o=>el('button',{type:'button',on:{click:ev=>{if(o.i===et.c){ev.currentTarget.classList.add('certo');acerto()}else{ev.currentTarget.classList.add('errado');ev.currentTarget.disabled=true;erro('O chefão revidou! Por que não: '+((et.w||[])[o.i-1]||'essa opção não resolve.')+' Tente outra.')}}}},o.t)));
  cena(el('h2',{},'Chefão: '+C.nome),regrasBox(C.regras),el('div',{class:'arena'},mon,el('div',{},el('div',{class:'dica'},'Resolvam em EQUIPE, no quadro. Depois cada um registra aqui.'),el('div',{class:'hpb'},hp))),el('div',{class:'fala'},et.q),corpo,fb,el('div',{class:'acoes'},conf,prox))}
 function venceu(){sfx('fanfarra');PR().feito[id]=true;salvar();ganharXP(50,'Chefão derrotado');darSelo(C.selo);
  cena(el('h2',{},C.nome+' foi derrotado!'),el('div',{class:'fala'},C.fim),el('div',{class:'acoes'},el('button',{type:'button',on:{click:()=>concluiu(id)}},'Continuar ▶')))}
 mostra()}

// ---------- ficha, níveis, início ----------
function ficha(){if(!S)return;const n=nivel(S.xp);
 const blocos=LEVELS.filter(lv=>S.P[lv.id]).map(lv=>{const p=S.P[lv.id];const rows=[];lv.fases.forEach((f,k)=>Object.entries(f.lugares).forEach(([id,l])=>rows.push(el('tr',{},el('td',{},`R${k+1} • ${l.nome}`),el('td',{},p.feito[id]?'✔':'—'),el('td',{class:'num'},String(p.erros[id]||0))))));
  const tx=Object.entries(p.textos||{}).filter(([k,v])=>v&&v.trim());return el('div',{class:'ficha'},el('h3',{class:'fh'},`${lv.nome} • ${lv.titulo}`),el('div',{class:'tbw'},el('table',{class:'tb'},el('tr',{},el('th',{},'LUGAR'),el('th',{},'OK'),el('th',{},'ERROS')),...rows)),...(tx.length?[el('h3',{class:'fh'},'O QUE EU ESCREVI'),...tx.map(([k,v])=>{const[pid,ix]=k.split('#');const M=MISSOES[(NOD[pid]||lv.fases.map(f=>f.lugares[pid]).find(Boolean)||{}).miss];const t=M&&M.lista[+ix]?M.lista[+ix].t:k;return el('div',{},el('div',{class:'dica'},t),el('pre',{class:'cod'},v))})]:[]))});
  cena(el('h2',{},'Ficha do Aventureiro'),el('div',{class:'fala'},`${S.nome} • ${n[1]} • ${S.xp} XP`),el('div',{class:'selos'},...(S.selos.length?S.selos.map(k=>el('span',{class:'selo'},SELOS[k][0])):[el('span',{class:'dica'},'Nenhum selo ainda.')])),...blocos,
  el('div',{class:'dica'},ultimoCod?(sujo?`Último código: ${ultimoCod} (você jogou depois dele: salve de novo).`:`Último código: ${ultimoCod}`):'Você ainda não salvou nesta sessão.'),el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:()=>salvarCodigo()}},'Salvar 💾'),el('button',{type:'button',on:{click:fechar}},'Fechar')))}
function entrarNivel(lv){montarNivel(lv);S.lv=lv.id;const p=PR();const pos=p.pos&&NOD[p.pos]?p.pos:primeiro(0);p.pos=pos;heroi={x:NOD[pos].x,y:NOD[pos].y};cam={x:Math.max(0,Math.min(W-VW,heroi.x-VW/2)),y:Math.max(0,Math.min(H-VH,heroi.y-VH/2))};visao=false;salvar();hud();
 if(!p.hist[0])historia(0,fechar);else fechar()}
function telaNiveis(){const cards=LEVELS.map((lv,i)=>{const lib=S.lib[lv.id];const p=S.P[lv.id];const tot=lv.fases.reduce((a,f)=>a+Object.values(f.lugares).filter(l=>!l.extra).length,0);const fe=p?lv.fases.reduce((a,f)=>a+Object.entries(f.lugares).filter(([id,l])=>!l.extra&&p.feito[id]).length,0):0;
  const inp=el('input',{id:'lib-'+lv.id,placeholder:'CÓDIGO','aria-label':'Código do Mestre para '+lv.nome,autocomplete:'off',style:'width:9em'});const fb=el('span',{class:'dica'});
  const lib2=()=>{if(inp.value.trim().toUpperCase()===lv.codigo){sfx('porta');S.lib[lv.id]=true;salvar();telaNiveis()}else{sfx('erro');fb.textContent='Código errado.';inp.classList.add('tremer');setTimeout(()=>inp.classList.remove('tremer'),400)}};
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')lib2()});
  return el('div',{class:'nv '+lv.id+(lib?'':' trava')},el('div',{class:'nvtop'},el('span',{class:'nvn'},`${i+1}. ${lv.nome.toUpperCase()}`),el('span',{class:'dica num'},`${fe}/${tot}`)),el('div',{class:'nvt'},lv.titulo),el('div',{class:'dica'},lv.aula),el('div',{class:'dica'},lv.ind),
   lib?el('div',{class:'acoes',style:'justify-content:flex-start'},el('button',{type:'button',on:{click:()=>entrarNivel(lv)}},nivelCompleto(lv)?'Rever ▶':fe?'Continuar ▶':'Jogar ▶'))
      :el('div',{class:'acoes',style:'justify-content:flex-start;align-items:center'},inp,el('button',{class:'sec',type:'button',on:{click:lib2}},'Liberar'),fb))});
 cena(el('h2',{},'Escolha o nível'),el('div',{class:'dica'},'Cada fase é uma etapa do curso (uma Situação de Aprendizagem) e tem 4 regiões que se encaixam num mapa só. Termine uma fase para liberar a próxima, ou peça o código ao Mestre quando a turma chegar lá.'),el('div',{class:'nvs'},...cards),
  LV?el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:fechar}},'Voltar ao mapa')):null)}
function inicio(){let av=0;sujo=false;ultimoCod='';
 const avs=el('div',{class:'avs',role:'group','aria-label':'Escolha o herói'},...AVS.map((p,i)=>{const c=el('canvas',{width:8,height:11});spr(c.getContext('2d'),HERO,p,0,0);return el('button',{type:'button','aria-pressed':i===0?'true':'false','aria-label':'Herói '+(i+1),on:{click:()=>{av=i;avs.querySelectorAll('button').forEach((x,j)=>x.setAttribute('aria-pressed',j===i))}}},c)}));
 const nome=el('input',{id:'nomeHeroi',maxlength:'24',placeholder:'Seu nome (ex.: Ana Souza)','aria-label':'Seu nome',autocomplete:'off'});
 const cod=el('input',{id:'codHeroi',maxlength:'40',placeholder:'Código de salvamento (se já jogou)','aria-label':'Código de salvamento',autocomplete:'off',style:'text-transform:uppercase;letter-spacing:2px'});
 const fb=el('div',{class:'fb no',hidden:''});
 const tremer=q=>{q.focus();q.classList.add('tremer');setTimeout(()=>q.classList.remove('tremer'),400)};
 const comecar=()=>{const v=nome.value.trim();if(!v)return tremer(nome);if(cod.value.trim())return continuar();S={nome:v,av,xp:0,vida:5,selos:[],lv:LEVELS[0].id,lib:{[LEVELS[0].id]:true},P:{}};sujo=true;telaNiveis()};
 const continuar=()=>{const v=nome.value.trim();if(!v)return tremer(nome);if(!cod.value.trim())return tremer(cod);const r=lerCodigo(cod.value,v);
  if(r.erro){sfx('erro');fb.hidden=false;fb.textContent=r.erro;return tremer(cod)}
  S=r.S;const ant=regLer().find(x=>normNome(x.nome)===normNome(v));if(ant&&ant.S&&ant.S.P)for(const k in S.P){const t=(ant.S.P[k]||{}).textos;if(t)S.P[k].textos=Object.assign({},t)}
  ultimoCod=cod.value.trim().toUpperCase();const lv=LEVELS.find(l=>l.id===S.lv)||LEVELS[0];entrarNivel(lv);sujo=false;toast('Bem-vindo de volta, '+S.nome+'!')};
 nome.addEventListener('keydown',e=>{if(e.key==='Enter')(cod.value.trim()?continuar:comecar)()});cod.addEventListener('keydown',e=>{if(e.key==='Enter')continuar()});
 cena(el('h2',{class:'tit-inicio'},'ESCRITÓRIO PIXEL'),el('div',{class:'dica'},'A JORNADA OFFICE • Senac PR • Turma 202600144'),
  el('div',{class:'fala'},'O vírus Barão Bagunça desformatou a Horizonte Distribuidora às vésperas da entrega do Edital! Atravesse o Escritório Pixel em 3 fases e '+LEVELS.reduce((t,l)=>t+l.fases.reduce((a,f)=>a+Object.values(f.lugares).filter(x=>x.tipo==="batalha").length,0),0)+' batalhas, estude os pergaminhos e salve os documentos, as planilhas, os e-mails e os slides da empresa.'),
  el('div',{class:'dica'},'Primeira vez? Escolha seu herói, digite seu nome e clique em Nova aventura. Já jogou? Digite o MESMO nome e o código que você anotou.'),avs,nome,cod,fb,
  el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:areaProfessor}},'Área do Professor 🔒'),el('button',{class:'sec',type:'button',on:{click:continuar}},'Continuar com código ▶'),el('button',{type:'button',on:{click:comecar}},'Nova aventura ▶')));setTimeout(()=>nome.focus(),50)}
$('btnFicha').addEventListener('click',ficha);$('btnSalvar').addEventListener('click',()=>S&&salvarCodigo());$('btnSair').addEventListener('click',()=>S&&sair());$('btnFx').addEventListener('click',()=>{SOM.fx=!SOM.fx;somSalvar();botoesSom();sfx('clique')});$('btnMus').addEventListener('click',()=>{SOM.mus=!SOM.mus;somSalvar();botoesSom();musica()});botoesSom();$('btnNiveis').addEventListener('click',()=>S&&telaNiveis());$('btnVisao').addEventListener('click',()=>LV&&alternarVisao());
requestAnimationFrame(desenha);inicio();
