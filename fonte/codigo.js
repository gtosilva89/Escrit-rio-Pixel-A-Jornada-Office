// ===================== CÓDIGO DE SALVAMENTO =====================
// O código guarda o progresso inteiro (sem servidor): lugares concluídos, erros por batalha,
// missões, XP, herói e fase. Cada salvamento sorteia um "sal", então o código muda a cada vez.
// Só funciona com o mesmo nome de aluno (o nome entra na conferência).
const ALFA='23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const normNome=n=>String(n||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
function lugaresCod(){const L=[];LEVELS.forEach(lv=>lv.fases.forEach(f=>Object.entries(f.lugares).forEach(([id,l])=>L.push({lv:lv.id,id,tipo:l.tipo,miss:l.miss}))));return L}
const pushN=(b,v,n)=>{for(let i=n-1;i>=0;i--)b.push((v>>i)&1)};
const readN=(b,p,n)=>{let v=0;for(let i=0;i<n;i++)v=(v<<1)|b[p.i++];return v};
function hashBits(bits,nome){let h=2166136261>>>0;const s=bits.join('')+'|'+normNome(nome);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h&2047}
function fluxo(sal){let x=(sal*7919+12345)>>>0;return()=>{x=(Math.imul(x,1103515245)+12345)>>>0;return(x>>>16)&1}}
function gerarCodigo(S){const b=[];pushN(b,3,3);pushN(b,S.av||0,2);pushN(b,Math.max(0,LEVELS.findIndex(l=>l.id===S.lv)),3);LEVELS.slice(1).forEach(l=>pushN(b,(S.lib&&S.lib[l.id])?1:0,1));pushN(b,Math.min(4095,Math.round((S.xp||0)/2)),12);
 {const d=S.dsf&&S.dsf.st==='fim'?S.dsf:null;pushN(b,d?1:0,1);pushN(b,d?Math.min(31,d.ac):0,5);pushN(b,d?Math.min(8191,d.pts):0,13);pushN(b,d?Math.min(4095,Math.round(d.seg)):0,12)}
 for(const l of lugaresCod()){const p=(S.P||{})[l.lv]||{feito:{},erros:{},missao:{}};
  if(l.tipo==='batalha'){const e=(p.erros||{})[l.id]||0;pushN(b,!p.feito[l.id]?0:e<=1?1:e<=3?2:3,2)}
  else if(l.tipo==='missoes')pushN(b,Math.min(3,(p.missao||{})[l.id]||0),2);
  else pushN(b,p.feito[l.id]?1:0,1)}
 pushN(b,hashBits(b,S.nome),11);
 const sal=Math.floor(Math.random()*32);const k=fluxo(sal);const tudo=[];pushN(tudo,sal,5);for(const x of b)tudo.push(x^k());
 while(tudo.length%5)tudo.push(0);let c='';for(let i=0;i<tudo.length;i+=5){let v=0;for(let j=0;j<5;j++)v=(v<<1)|tudo[i+j];c+=ALFA[v]}
 return c.match(/.{1,4}/g).join('-')}
function lerCodigo(cod,nome){const t=String(cod||'').toUpperCase().replace(/[^0-9A-Z]/g,'').replace(/O/g,'0').replace(/I/g,'1');
 const tudo=[];for(const ch of t){const v=ALFA.indexOf(ch);if(v<0)return{erro:'O código tem uma letra ou número que não existe (confira 0/O, 1/I).'};pushN(tudo,v,5)}
 const L=lugaresCod();const nb=3+2+3+(LEVELS.length-1)+12+31+L.reduce((s,l)=>s+(l.tipo==='batalha'||l.tipo==='missoes'?2:1),0)+11;
 if(tudo.length<5+nb)return{erro:'Código curto demais. Confira se copiou tudo.'};
 const p0={i:0};const sal=readN(tudo,p0,5);const k=fluxo(sal);const b=[];for(let i=0;i<nb;i++)b.push(tudo[5+i]^k());
 const p={i:0};const ver=readN(b,p,3);if(ver!==3)return{erro:'Código de outra versão do jogo.'};
 const S={nome:nome,av:readN(b,p,2),lv:'',lib:{[LEVELS[0].id]:true},xp:0,vida:5,selos:[],P:{}};S.lv=(LEVELS[readN(b,p,3)]||LEVELS[0]).id;LEVELS.slice(1).forEach(l=>{if(readN(b,p,1))S.lib[l.id]=true});S.xp=readN(b,p,12)*2;
 {const f=readN(b,p,1),ac=readN(b,p,5),pts=readN(b,p,13),seg=readN(b,p,12);if(f){S.dsf={st:'fim',ac,pts,seg,r:[],ids:[],i:30,doCodigo:true};S.selos.push('desafiante')}}
 const est={};for(const l of L)est[l.lv+'/'+l.id]=l.tipo==='batalha'||l.tipo==='missoes'?readN(b,p,2):readN(b,p,1);
 const ck=readN(b,p,11);if(ck!==hashBits(b.slice(0,p.i-11),nome))return{erro:'Código não confere com este nome. Confira o nome (igual ao do dia em que salvou) e cada letra do código.'};
 for(const lv of LEVELS){const pr={feito:{},erros:{},abertos:{},missao:{},hist:{},pos:null,textos:{}};let algum=false;
  lv.fases.forEach((f,kf)=>{for(const[id,l]of Object.entries(f.lugares)){const v=est[lv.id+'/'+id];
   if(l.tipo==='batalha'){if(v){pr.feito[id]=true;pr.erros[id]=v===1?0:v===2?2:4;algum=true;if(l.selo&&v===1)S.selos.push(l.selo)}}
   else if(l.tipo==='missoes'){if(v){pr.missao[id]=v;algum=true;if(v>=MISSOES[l.miss].lista.length)pr.feito[id]=true}}
   else if(v){pr.feito[id]=true;algum=true;if(l.tipo==='chefao'){pr.abertos[id]=true;S.selos.push(CHEFES[l.chefe].selo)}}}});
  if(algum||S.lv===lv.id){S.P[lv.id]=pr;lv.fases.forEach((f,kf)=>{const lib=kf===0||lv.fases[kf-1]&&Object.entries(lv.fases[kf-1].lugares).every(([id,l])=>l.extra||pr.feito[id]);if(lib&&Object.keys(f.lugares).some(id=>pr.feito[id]||pr.missao[id]))pr.hist[kf]=true});
   if(lv.fases.every(f=>Object.entries(f.lugares).every(([id,l])=>l.extra||pr.feito[id]))){S.selos.push(lv.id);const i=LEVELS.indexOf(lv);if(LEVELS[i+1])S.lib[LEVELS[i+1].id]=true}}}
 return{S}}
// ---------- registro do professor (neste computador) ----------
const REG_KEY='escritorioPixel_registro';
function regLer(){try{return JSON.parse(localStorage.getItem(REG_KEY)||'[]')}catch(e){return[]}}
function regGravar(r){try{localStorage.setItem(REG_KEY,JSON.stringify(r))}catch(e){}}
function regSalvar(S,cod,origem){const r=regLer().filter(x=>normNome(x.nome)!==normNome(S.nome));r.push({nome:S.nome,codigo:cod,data:new Date().toLocaleString('pt-BR'),origem:origem||'jogo',ts:Date.now(),S:JSON.parse(JSON.stringify(S))});regGravar(r)}
