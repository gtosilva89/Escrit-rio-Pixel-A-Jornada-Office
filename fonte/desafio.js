// ===================== FASE 0: GRANDE DESAFIO OFFICE (com premiação) =====================
// 30 questões mais difíceis, sorteadas sem repetir do banco DESAFIO (cotas por área em DESAFIO_COTA).
// Uma chance por questão, sem vidas. Pontos: 100 por acerto + bônus de rapidez (até 50).
// Só o tempo até responder conta; ler a explicação não conta. Uma tentativa oficial por aluno.
// O andamento fica guardado neste navegador (recarregar a página não sorteia de novo),
// e o resultado vai para a planilha do professor junto com o salvamento (S.dsf).
const DSF_KEY='escritorioPixel_desafio', DSF_COD='DESAFIO';
const DSF_ID=Object.fromEntries(DESAFIO.map(x=>[x.id,x]));
function dsfLocal(){try{return JSON.parse(localStorage.getItem(DSF_KEY)||'{}')}catch(e){return{}}}
function dsfGuardar(){try{const m=dsfLocal();m[normNome(S.nome)]=S.dsf;localStorage.setItem(DSF_KEY,JSON.stringify(m))}catch(e){}}
function dsfEstado(){const d=dsfLocal()[normNome(S.nome)];if(d&&(!S.dsf||(S.dsf.doCodigo&&d.st==='fim')))S.dsf=d;return S.dsf}
const embaralhar=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function dsfSortear(){const ids=[];for(const[k,n]of Object.entries(DESAFIO_COTA))ids.push(...embaralhar(DESAFIO.filter(x=>x.a===k).map(x=>x.id)).slice(0,n));return embaralhar(ids)}
function dsfBonus(seg){return Math.max(0,Math.min(50,Math.round(60-seg)))}
function dsfMedalha(ac){return ac>=27?['OURO','#f4d35e']:ac>=22?['PRATA','#c0c7d1']:ac>=15?['BRONZE','#cd7f32']:['PARTICIPAÇÃO','#7ec8e3']}
const dsfTempo=s=>{s=Math.round(s||0);return Math.floor(s/60)+' min '+String(s%60).padStart(2,'0')+' s'};

function cardDesafio(){const d=dsfEstado();const lib=S.lib.desafio||d;
 const inp=el('input',{id:'lib-desafio',placeholder:'CÓDIGO','aria-label':'Código do Mestre para o Desafio',autocomplete:'off',style:'width:9em'});const fb=el('span',{class:'dica'});
 const lib2=()=>{if(inp.value.trim().toUpperCase()===DSF_COD){sfx('porta');S.lib.desafio=true;salvar();telaNiveis()}else{sfx('erro');fb.textContent='Código errado.';inp.classList.add('tremer');setTimeout(()=>inp.classList.remove('tremer'),400)}};
 inp.addEventListener('keydown',e=>{if(e.key==='Enter')lib2()});
 const st=!d?'30 questões sorteadas • vale prêmio':d.st==='fim'?`Concluído: ${d.ac}/30 acertos • ${d.pts} pontos`:`Em andamento: questão ${d.i+1} de 30`;
 return el('div',{class:'nv desafio'+(lib?'':' trava')},el('div',{class:'nvtop'},el('span',{class:'nvn'},'0. DESAFIO 🏆'),el('span',{class:'dica num'},d&&d.st==='fim'?'✔':'')),
  el('div',{class:'nvt'},'Grande Desafio Office'),el('div',{class:'dica'},'Antes das 5 fases • questões mais difíceis de Word, Excel, Outlook, PowerPoint e competências, com explicação'),el('div',{class:'dica'},st),
  lib?el('div',{class:'acoes',style:'justify-content:flex-start'},el('button',{type:'button',on:{click:desafio}},!d?'Ver as regras ▶':d.st==='fim'?'Ver meu resultado 🏆':'Continuar o desafio ▶'))
     :el('div',{class:'acoes',style:'justify-content:flex-start;align-items:center'},inp,el('button',{class:'sec',type:'button',on:{click:lib2}},'Liberar'),fb))}

function desafio(){hud();const d=dsfEstado();if(d&&d.st==='fim')return dsfResultado();if(d)return dsfQuestao();musica('chefe');
 cena(el('h2',{},'🏆 Grande Desafio Office'),arte('escritorio'),
  el('div',{class:'fala'},'A Gerente Célia abriu o Grande Desafio da Horizonte Distribuidora. São 30 questões sorteadas de todo o jogo, só que mais difíceis. Quem participar ganha o selo Desafiante e concorre aos prêmios do Mestre.'),
  regrasBox([['30 questões','sorteadas para você, sem repetir: Word 6, Excel 9, Outlook 5, PowerPoint 5 e Competências 5'],['1 chance','cada questão vale uma resposta só. Não perde vida.'],['Pontos','100 por acerto + bônus de rapidez de até 50 (até 10 s vale 50; perde 1 por segundo; 60 s ou mais, 0)'],['Explicação','depois de cada resposta você lê por que está certa ou errada. Esse tempo NÃO conta.'],['Uma tentativa','o desafio vale uma vez. Se a página fechar, ele continua de onde parou.'],['Desempate','mais pontos; depois, menor tempo total']]),
  el('div',{class:'dica'},'Sem consulta ao Office nem à internet: é para ver o que você domina. No fim, o resultado vai para o professor.'),
  el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:telaNiveis}},'Agora não'),el('button',{type:'button',on:{click:()=>{S.dsf={st:'jogando',ids:dsfSortear(),i:0,r:[],pts:0,ac:0,seg:0,ini:Date.now()};salvar();dsfGuardar();dsfQuestao()}}},'Começar o desafio ▶')))}

function dsfQuestao(){const d=S.dsf;if(d.i>=d.ids.length)return dsfFim();musica('batalha');const q=DSF_ID[d.ids[d.i]];
 const fb=el('div',{class:'fb',hidden:''}),ops=el('div',{class:'ops'}),prox=el('button',{type:'button',hidden:''},'Próxima ▶'),rel=el('span',{class:'num'},'0 s');
 const t0=performance.now();const tt=setInterval(()=>{const s=(performance.now()-t0)/1000;rel.textContent=Math.floor(s)+' s • bônus '+dsfBonus(s)},250);
 const resp=(i,btn)=>{clearInterval(tt);const seg=Math.min(600,(performance.now()-t0)/1000);ops.querySelectorAll('button').forEach(b=>b.disabled=true);const ok=i===q.c;const b=ok?dsfBonus(seg):0;
  d.r.push([q.id,ok?1:0,Math.round(seg*10)/10]);d.seg=Math.round((d.seg+seg)*10)/10;if(ok){d.ac++;d.pts+=100+b}d.i++;salvar();dsfGuardar();
  if(ok){sfx('acerto');btn.classList.add('certo');fb.className='fb ok';fb.replaceChildren(el('b',{},`Acertou! +${100+b} pontos (bônus ${b}). `),'Por quê: '+q.e)}
  else{sfx('erro');btn.classList.add('errado');const c=[...ops.querySelectorAll('button')].find(x=>x.textContent===q.o[q.c]);if(c)c.classList.add('certo');fb.className='fb no';
   fb.replaceChildren(el('b',{},'Errou. '),'Por que não: '+((q.w||[])[i-1]||'essa opção não atende ao que foi pedido.'),el('br'),el('b',{},'Certa: '),q.o[q.c]+'. Por quê: '+q.e)}
  fb.hidden=false;prox.hidden=false;prox.textContent=d.i>=d.ids.length?'Ver resultado 🏆':'Próxima ▶';prox.onclick=()=>d.i>=d.ids.length?dsfFim():dsfQuestao();prox.focus()};
 cena(el('h2',{},`Desafio • Questão ${d.i+1} de ${d.ids.length}`),el('div',{class:'hpb'},el('i',{style:`width:${d.i/d.ids.length*100}%`})),
  el('div',{class:'dica'},`${DESAFIO_AREA[q.a]} • ${d.pts} pontos • ${d.ac} acerto(s) • tempo: `,rel),el('div',{class:'fala'},q.q),ops,fb,el('div',{class:'acoes'},prox));
 ops.replaceChildren(...q.o.map((t,i)=>({t,i})).sort(()=>Math.random()-.5).map(o=>el('button',{type:'button',on:{click:ev=>resp(o.i,ev.currentTarget)}},o.t)))}

function dsfFim(){const d=S.dsf;if(d.st!=='fim'){d.st='fim';d.fim=new Date().toLocaleString('pt-BR');salvar();dsfGuardar();sfx('vitoria');ganharXP(100+d.ac*10,'do Desafio');darSelo('desafiante');
  // envia já para a planilha, mesmo que o aluno não clique em Salvar
  try{const cod=gerarCodigo(S);ultimoCod=cod;regSalvar(S,cod,'jogo');sujo=false;if(NUVEM_URL){const x=regLer().find(y=>normNome(y.nome)===normNome(S.nome));nuvemEnviar(x).then(ok=>{const e=$('dsfEnv');if(e)e.textContent=ok?'✔ Resultado enviado para a planilha do professor.':'Sem internet agora: o resultado será enviado depois, sozinho.'})}}catch(e){}}
 dsfResultado()}

function dsfResultado(){const d=S.dsf;const[m,cor]=dsfMedalha(d.ac);musica('mapa');
 const porArea={};for(const[id,ok]of d.r||[]){const a=(DSF_ID[id]||{}).a;if(!a)continue;porArea[a]=porArea[a]||[0,0];porArea[a][1]++;if(ok)porArea[a][0]++}
 const rows=[['Área','Acertos'],...Object.keys(DESAFIO_COTA).filter(a=>porArea[a]).map(a=>[DESAFIO_AREA[a],porArea[a][0]+' de '+porArea[a][1]])];
 const errs=(d.r||[]).filter(x=>!x[1]).map(x=>DSF_ID[x[0]]).filter(Boolean);
 cena(el('h2',{},'🏆 Resultado do Grande Desafio'),
  el('div',{class:'medalha',style:`border-color:${cor};color:${cor}`},el('div',{},'MEDALHA'),el('b',{},m)),
  el('div',{class:'fala'},`${S.nome}: ${d.ac} de 30 acertos • ${d.pts} pontos • tempo de resposta ${dsfTempo(d.seg)}${d.fim?' • '+d.fim:''}`),
  el('div',{class:'dica'},'Ouro: 27 ou mais acertos • Prata: 22 a 26 • Bronze: 15 a 21 • Participação: até 14. Todos que concluem ganham o selo Desafiante. Os prêmios são definidos pelo Mestre a partir do ranking.'),
  rows.length>1?tabelaEl(rows):null,
  errs.length?el('div',{class:'perg'},el('h3',{},'PARA REVISAR (as que você errou)'),...errs.map(q=>el('p',{},el('b',{},q.q),el('br'),'Certa: '+q.o[q.c]+'. '+q.e))):null,
  el('div',{class:'dica',id:'dsfEnv'},''),
  el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:()=>salvarCodigo(telaNiveis)}},'Salvar 💾'),el('button',{type:'button',on:{click:telaNiveis}},'Ir para as fases ▶')));setTimeout(()=>{$('cena').scrollTop=0},40)}
