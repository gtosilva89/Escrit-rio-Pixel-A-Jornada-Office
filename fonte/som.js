// ===================== SOM (8 bits, gerado no navegador) =====================
const SOM={gesto:false,querida:'mapa',ctx:null,master:null,musG:null,fx:true,mus:true,faixa:null,passo:0,prox:0,timer:null};
try{const p=JSON.parse(localStorage.getItem('escritorioPixel_som')||'{}');if(p.fx===false)SOM.fx=false;if(p.mus===false)SOM.mus=false}catch(e){}
function somSalvar(){try{localStorage.setItem('escritorioPixel_som',JSON.stringify({fx:SOM.fx,mus:SOM.mus}))}catch(e){}}
function audio(){if(!SOM.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{SOM.ctx=new C()}catch(e){return null}
  SOM.master=SOM.ctx.createGain();SOM.master.gain.value=.6;SOM.master.connect(SOM.ctx.destination);SOM.musG=SOM.ctx.createGain();SOM.musG.gain.value=.35;SOM.musG.connect(SOM.master)}
 if(SOM.ctx.state==='suspended')SOM.ctx.resume();return SOM.ctx}
const hz=n=>440*Math.pow(2,(n-69)/12);
function tom(f,dur,tipo,vol,quando,dest){const c=audio();if(!c)return;const t=Math.max(c.currentTime,quando||c.currentTime);const o=c.createOscillator(),g=c.createGain();
 o.type=tipo||'square';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(vol||.12,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 o.connect(g);g.connect(dest||SOM.master);o.start(t);o.stop(t+dur+.03)}
function seq(notas,passo,tipo,vol,dur){const c=audio();if(!c)return;const t0=c.currentTime+.01;notas.forEach((n,i)=>{if(n)tom(hz(n),dur||passo*1.6,tipo,vol,t0+i*passo)})}
const SFX={
 clique:()=>tom(880,.04,'square',.04),
 passo:()=>tom(140+Math.random()*40,.05,'triangle',.05),
 pagina:()=>tom(1175,.05,'triangle',.05),
 acerto:()=>seq([72,76,79,84],.06,'square',.09),
 erro:()=>{seq([55,50],.12,'sawtooth',.08,.22)},
 vitoria:()=>seq([72,0,72,76,79,0,76,79,84],.09,'square',.1,.16),
 fanfarra:()=>{seq([67,72,76,79,84,79,84,88],.11,'square',.1,.2);seq([48,0,55,0,60,0,55,60],.11,'triangle',.12,.25)},
 nivel:()=>seq([76,79,84,88,91],.07,'triangle',.12),
 selo:()=>seq([88,91,96],.08,'triangle',.1),
 porta:()=>seq([60,64,67,72],.08,'triangle',.12),
 chefe:()=>seq([45,44,43,42],.18,'sawtooth',.1,.3),
 desmaio:()=>seq([67,64,60,55,48],.14,'triangle',.12)};
function sfx(n){if(!SOM.gesto||!SOM.fx||!SFX[n])return;try{SFX[n]()}catch(e){}}
// músicas: [melodia (16 avos), baixo por compasso, duração do passo]
const FAIXAS={
 mapa:[[72,0,76,0,79,0,76,0,74,0,77,0,81,0,77,0,76,0,79,0,84,0,79,0,77,76,74,0,72,0,0,0],[48,53,55,48],.16],
 batalha:[[69,0,72,69,76,0,74,72,71,0,74,71,79,0,77,76,69,0,72,69,76,0,81,79,77,76,74,72,71,0,69,0],[45,43,41,40],.12],
 chefe:[[57,57,60,57,63,0,62,60,57,57,60,57,64,0,63,62,57,57,60,57,63,0,67,66,65,63,62,60,59,0,57,0],[33,33,31,32],.11]};
function agendar(){const c=SOM.ctx;if(!c||!SOM.faixa)return;const[mel,bx,dt]=FAIXAS[SOM.faixa];
 while(SOM.prox<c.currentTime+.15){const i=SOM.passo%mel.length;if(mel[i])tom(hz(mel[i]),dt*1.5,'square',.05,SOM.prox,SOM.musG);
  if(i%8===0)tom(hz(bx[(i/8)|0]),dt*3,'triangle',.12,SOM.prox,SOM.musG);if(i%8===4)tom(hz(bx[(i/8)|0]+7),dt*2,'triangle',.08,SOM.prox,SOM.musG);
  if(SOM.faixa!=='mapa'&&i%4===2)tom(2000,.02,'square',.015,SOM.prox,SOM.musG);
  SOM.passo++;SOM.prox+=dt}}
function musica(f){if(f)SOM.querida=f;const alvo=SOM.mus?SOM.querida:null;if(alvo===SOM.faixa)return;
 if(!SOM.gesto)return;SOM.faixa=alvo;clearInterval(SOM.timer);SOM.timer=null;if(!alvo)return;const c=audio();if(!c)return;SOM.passo=0;SOM.prox=c.currentTime+.05;SOM.timer=setInterval(agendar,40);agendar()}
function botoesSom(){const a=$('btnFx'),b=$('btnMus');if(!a)return;a.textContent='Efeitos: '+(SOM.fx?'sim':'não');a.setAttribute('aria-pressed',SOM.fx);b.textContent='Música: '+(SOM.mus?'sim':'não');b.setAttribute('aria-pressed',SOM.mus)}
document.addEventListener('pointerdown',()=>{SOM.gesto=true;audio();if(SOM.mus&&!SOM.faixa)musica()},true);
document.addEventListener('keydown',()=>{if(!SOM.gesto){SOM.gesto=true;audio();if(SOM.mus)musica()}},true);
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('button');if(b&&b.id!=='btnFx')sfx(document.querySelector('#cena .historia')&&!$('veu').hidden?'pagina':'clique')},true);
