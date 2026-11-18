// ===================== ÁREA DO PROFESSOR (com senha) =====================
// Mostra quem salvou NESTE computador (registro local) e quem o professor adicionar por nome + código.
// Proteção simples, para a sala de aula: a senha não aparece no arquivo, só um "resumo" dela.
const SENHA_H=1992223358;
function senhaOk(t){let h=2166136261>>>0;const s='ep|'+normNome(t);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h===SENHA_H}
let profAberto=false,senhaProf='',profNuvemFeito=false;
function areaProfessor(){if(profAberto)return painelProf();
 const inp=el('input',{id:'senhaProf',type:'password',autocomplete:'off','aria-label':'Senha do professor',placeholder:'Senha'});const fb=el('div',{class:'fb no',hidden:''});
 const ok=()=>{if(senhaOk(inp.value)){senhaProf=inp.value;profAberto=true;sfx('porta');painelProf()}else{sfx('erro');fb.hidden=false;fb.textContent='Senha errada.';inp.value='';inp.classList.add('tremer');setTimeout(()=>inp.classList.remove('tremer'),400)}};
 inp.addEventListener('keydown',e=>{if(e.key==='Enter')ok()});
 cena(el('h2',{},'Área do Professor 🔒'),el('div',{class:'fala'},'Digite a senha do professor:'),inp,fb,el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:()=>{fechar();inicio()}}},'Voltar'),el('button',{type:'button',on:{click:ok}},'Entrar')))}
const BAT=LEVELS.flatMap(lv=>lv.fases.flatMap(f=>Object.entries(f.lugares).filter(([id,l])=>l.tipo==='batalha').map(([id,l])=>({lv:lv.id,id,nome:l.nome,conceito:CARDS[l.card].t}))));
const corSug={A:'#1b7f3b',PA:'#b7791f',NA:'#c53030','—':'#555'};
function alunosProf(){return regLer().map(x=>Object.assign({},x.S,{nome:x.nome,_cod:x.codigo,_data:x.data,_origem:x.origem})).sort((a,b)=>a.nome.localeCompare(b.nome))}
function adicionarCodigos(txt){let ok=0;const ruins=[];
 for(const linha of txt.split(/\n/)){const t=linha.trim();if(!t)continue;const m=t.split(/[;\t]|\s{2,}|\s[-–]\s(?=[0-9A-Z]{4}-)/);let nome,cod;
  if(m.length>=2){cod=m.pop().trim();nome=m.join(' ').trim()}else{const mm=t.match(/^(.*?)\s+([0-9A-Za-z]{4}(?:-[0-9A-Za-z]{1,4})+)$/);if(mm){nome=mm[1];cod=mm[2]}}
  if(!nome||!cod){ruins.push(t+' (use: Nome ; CÓDIGO)');continue}
  const r=lerCodigo(cod,nome);if(r.erro){ruins.push(nome+': '+r.erro);continue}
  const ant=regLer().find(x=>normNome(x.nome)===normNome(nome));if(ant&&ant.S&&ant.S.P)for(const k in r.S.P){const tx=(ant.S.P[k]||{}).textos;if(tx)r.S.P[k].textos=tx}
  regSalvar(r.S,cod.toUpperCase(),'professor');ok++}
 return{ok,ruins}}
function baixarArq(nome,conteudo,tipo){const b=new Blob([conteudo],{type:tipo});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=nome;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function csvProf(AL){const q=v=>'"'+String(v).replace(/"/g,'""')+'"';const cab=['Aluno','Salvo em','Codigo','XP','Nivel','Nota sugerida',...LEVELS.map(l=>l.nome),...IND_K.map(k=>'C'+k),'Atencao',...BAT.map(b=>'Erros '+b.nome)];
 const rows=AL.map(S=>{const a=analisar(S);return[S.nome,S._data||'',S._cod||'',S.xp,nivel(S.xp)[1],a.nota.toFixed(1).replace('.',','),...a.fases.map(f=>f.jogou?f.feitos+'/'+f.total:''),...IND_K.map(k=>a.sug[k]),a.atencao.map(x=>x.conceito).join('; '),...BAT.map(b=>{const p=(S.P||{})[b.lv];if(!p)return'';return p.feito[b.id]?((p.erros||{})[b.id]||0):'não fez'})]});
 baixarArq('escritorio-pixel_turma.csv','﻿'+[cab,...rows].map(r=>r.map(q).join(';')).join('\r\n'),'text/csv')}
// Ranking geral: XP das 5 fases (sem o XP-bônus do desafio) + pontos do Grande Desafio
function xpFases(S){const d=S.dsf&&S.dsf.st==='fim'?S.dsf:null;return Math.max(0,(S.xp||0)-(d?100+d.ac*10:0))}
function rankGeral(AL){return AL.map(S=>{const d=S.dsf&&S.dsf.st==='fim'?S.dsf:null;const a=analisar(S);const feitos=a.fases.reduce((t,f)=>t+f.feitos,0),total=a.fases.reduce((t,f)=>t+f.total,0);
  return{S,xf:xpFases(S),dp:d?d.pts:0,tot:xpFases(S)+(d?d.pts:0),feitos,total,seg:d?d.seg:1e9}}).sort((x,y)=>y.tot-x.tot||y.feitos-x.feitos||x.seg-y.seg)}
function csvGeral(AL){const q=v=>'"'+String(v).replace(/"/g,'""')+'"';const R=rankGeral(AL);
 const rows=[['Posicao','Aluno','XP das fases','Pontos do desafio','Pontuacao geral','Lugares concluidos','Nivel'],...R.map((r,i)=>[i+1,r.S.nome,r.xf,r.dp,r.tot,r.feitos+'/'+r.total,nivel(r.S.xp)[1]])];
 baixarArq('escritorio-pixel_ranking-geral.csv','\ufeff'+rows.map(r=>r.map(q).join(';')).join('\r\n'),'text/csv')}
function codigosJogo(){const L=[['Fase','Liberar a fase','Portão','Chefão']];L.push(['0 • Grande Desafio',DSF_COD,'—','—']);
 LEVELS.forEach((lv,i)=>{const lug=lv.fases.flatMap(f=>Object.values(f.lugares));const por=lug.filter(l=>l.tipo==='portao').map(l=>l.codigo).join(', ')||'—';const ch=lug.filter(l=>l.tipo==='chefao').map(l=>l.codigo).join(', ')||'—';
  L.push([`${i+1} • ${lv.titulo}`,i===0?'(já vem aberta)':lv.codigo,por,ch])});
 return el('details',{class:'perg',style:'background:#1a1533;color:inherit'},el('summary',{style:'cursor:pointer;font-size:19px'},'🔑 Códigos do jogo e senha (não mostrar aos alunos)'),
  el('div',{class:'dica'},'Senha da Área do Professor e da planilha: '+senhaProf+'. Maiúsculas e minúsculas não fazem diferença. Quem termina uma fase libera a próxima sozinho; o código da fase serve para quem ficou para trás.'),tabelaEl(L))}
function csvDesafio(AL){const q=v=>'"'+String(v).replace(/"/g,'""')+'"';const RK=AL.filter(S=>S.dsf&&S.dsf.st==='fim').sort((a,b)=>b.dsf.pts-a.dsf.pts||a.dsf.seg-b.dsf.seg);
 const rows=[['Posicao','Aluno','Acertos (de 30)','Pontos','Tempo (s)','Medalha','Concluido em',...Object.values(DESAFIO_AREA)],...RK.map((S,i)=>{const d=S.dsf;const pa={};for(const[id,ok]of d.r||[]){const a=(DSF_ID[id]||{}).a;pa[a]=pa[a]||[0,0];pa[a][1]++;if(ok)pa[a][0]++}
  return[i+1,S.nome,d.ac,d.pts,Math.round(d.seg),dsfMedalha(d.ac)[0],d.fim||'',...Object.keys(DESAFIO_AREA).map(a=>pa[a]?pa[a][0]+'/'+pa[a][1]:'')]})];
 baixarArq('escritorio-pixel_ranking-desafio.csv','\ufeff'+rows.map(r=>r.map(q).join(';')).join('\r\n'),'text/csv')}
function relTurmaProf(AL){const partes=AL.map(S=>relatorioHTML(S).replace(/^[\s\S]*<body>/,'').replace(/<\/body>[\s\S]*$/,'')).join('<div style="page-break-after:always"></div>');
 const h=relatorioHTML(AL[0]);const head=h.slice(0,h.indexOf('<body>'));baixarArq('escritorio-pixel_relatorios_turma.html',head.replace(/<title>.*<\/title>/,'<title>Relatórios da turma</title>')+'<body>'+partes+'</body></html>','text/html')}
function abrirRelProf(S){const w=window.open('','_blank');if(!w){baixarArq('relatorio_'+S.nome.replace(/\s+/g,'-')+'.html',relatorioHTML(S),'text/html');toast('Pop-up bloqueado: o relatório foi baixado.');return}w.document.write(relatorioHTML(S));w.document.close()}
function painelProf(){const AL=alunosProf();const saida=el('div',{});
 const nst=el('div',{class:'dica',id:'nuvemStatus'},NUVEM_URL?(profNuvemFeito?'Planilha conferida. Clique em Atualizar da planilha para buscar salvamentos novos.':'Buscando os salvamentos na planilha…'):'Planilha do professor não configurada: aparecem só os salvamentos deste computador.');
 const atualizar=()=>{nst.textContent='Buscando os salvamentos na planilha…';nuvemBaixar(senhaProf).then(r=>{profNuvemFeito=true;if(r.erro){nst.textContent=r.erro;return}painelProf();setTimeout(()=>{const z=$('nuvemStatus');if(z)z.textContent=`Planilha: ${r.total} aluno(s) lá, ${r.n} atualizado(s) agora (${new Date().toLocaleTimeString('pt-BR')}).`},30)})};
 if(NUVEM_URL&&!profNuvemFeito)setTimeout(atualizar,50);
 const ta=el('textarea',{class:'cod',rows:'4',placeholder:'Um aluno por linha:  Nome ; CÓDIGO\nAna Souza ; 7KQ2-M9XA-...','aria-label':'Alunos e códigos'});const fbA=el('div',{class:'fb',hidden:''});
 const add=()=>{const r=adicionarCodigos(ta.value);painelProf();setTimeout(()=>toast(`${r.ok} aluno(s) adicionado(s)`+(r.ruins.length?' • com problema: '+r.ruins.length:'')),60);if(r.ruins.length)setTimeout(()=>{const f=$('fbProf');if(f){f.hidden=false;f.className='fb no';f.textContent='Não deu certo: '+r.ruins.join(' | ')}},80)};
 const imp=()=>{const inp=document.createElement('input');inp.type='file';inp.accept='.json,application/json';inp.onchange=()=>{const f=inp.files[0];if(!f)return;f.text().then(t=>{try{const d=JSON.parse(t);if(!Array.isArray(d))throw 0;const r=regLer();let n=0;for(const x of d){if(!x||!x.nome||!x.S)continue;const i=r.findIndex(y=>normNome(y.nome)===normNome(x.nome));if(i<0){r.push(x);n++}else if(!r[i].ts||(x.ts||0)>=r[i].ts){r[i]=x;n++}}regGravar(r);painelProf();toast(n+' registro(s) juntados')}catch(e){toast('Arquivo inválido.')}})};inp.click()};
 const barra=el('div',{class:'acoes',style:'justify-content:flex-start;flex-wrap:wrap'},
  NUVEM_URL?el('button',{type:'button',on:{click:atualizar}},'Atualizar da planilha ⟳'):null,
  el('button',{class:'sec',type:'button',disabled:AL.length?null:'',on:{click:()=>csvProf(AL)}},'Baixar planilha (CSV)'),
  el('button',{class:'sec',type:'button',disabled:AL.some(S=>S.dsf)?null:'',on:{click:()=>csvDesafio(AL)}},'Ranking do desafio (CSV)'),
  el('button',{class:'sec',type:'button',disabled:AL.length?null:'',on:{click:()=>csvGeral(AL)}},'Ranking geral (CSV)'),
  el('button',{class:'sec',type:'button',disabled:AL.length?null:'',on:{click:()=>relTurmaProf(AL)}},'Relatório da turma'),
  el('button',{class:'sec',type:'button',disabled:AL.length?null:'',on:{click:()=>baixarArq('escritorio-pixel_registro.json',JSON.stringify(regLer()),'application/json')}},'Exportar registro'),
  el('button',{class:'sec',type:'button',on:{click:imp}},'Juntar registro de outro PC'));
 if(AL.length){
  const linhas=AL.map((S,i)=>{const a=analisar(S);
   return `<tr><td>${escH(S.nome)}</td><td>${escH(S._data||'')}<br><span class="dica">${S._origem==='professor'?'adicionado por você':S._origem==='nuvem'?'veio da planilha':'salvo neste PC'}</span></td><td><code>${escH(S._cod||'')}</code></td><td class="num">${S.xp}</td><td class="num">${a.nota.toFixed(1).replace('.',',')}</td>${a.fases.map(f=>`<td>${f.jogou?f.feitos+'/'+f.total:'—'}</td>`).join('')}${IND_K.map(k=>`<td><span class="tag" style="background:${corSug[a.sug[k]]}">${a.sug[k]}</span></td>`).join('')}<td>${a.atencao.map(x=>escH(x.conceito)).join(', ')||'—'}</td><td><button class="mini" type="button" data-i="${i}">abrir</button> <button class="mini sec" type="button" data-x="${i}">remover</button></td></tr>`}).join('');
  const cel=(t,c)=>`<td${c?` style="background:${c}"`:''}>${t}</td>`;
  const calor=AL.map(S=>`<tr><td>${escH(S.nome)}</td>${BAT.map(b=>{const p=(S.P||{})[b.lv];if(!p)return cel('','#1a1533');const e=(p.erros||{})[b.id]||0,f=p.feito&&p.feito[b.id];return cel(f?(e>=4?'4+':e):'·',!f?'#3d3550':e===0?'#2d6a4f':e<=1?'#55a630':e<=3?'#e09f3e':'#9e2a2b')}).join('')}</tr>`).join('');
  const soma=BAT.map(b=>AL.reduce((t,S)=>t+((((S.P||{})[b.lv]||{}).erros||{})[b.id]||0),0));
  const top=BAT.map((b,i)=>[b,soma[i]]).filter(x=>x[1]>0).sort((x,y)=>y[1]-x[1]).slice(0,6);
  const RK=AL.filter(S=>S.dsf).sort((a,b)=>(b.dsf.st==='fim')-(a.dsf.st==='fim')||b.dsf.pts-a.dsf.pts||a.dsf.seg-b.dsf.seg);
  const rk=RK.map((S,i)=>{const d=S.dsf,f=d.st==='fim';return `<tr><td class="num">${f?i+1+'º':'—'}</td><td>${escH(S.nome)}</td><td class="num">${f?d.ac+'/30':'jogando ('+d.i+'/30)'}</td><td class="num">${d.pts}</td><td>${dsfTempo(d.seg)}</td><td>${f?dsfMedalha(d.ac)[0]:'—'}</td><td>${escH(d.fim||'')}</td></tr>`}).join('');
  const errQ={};for(const S of RK)for(const[id,ok]of S.dsf.r||[]){errQ[id]=errQ[id]||[0,0];errQ[id][1]++;if(!ok)errQ[id][0]++}
  const topQ=Object.entries(errQ).filter(x=>x[1][0]>0).sort((x,y)=>y[1][0]-x[1][0]).slice(0,6);
  const blocoDsf=`<h3 class="ph">🏆 RANKING DO GRANDE DESAFIO (${RK.filter(S=>S.dsf.st==='fim').length} concluíram)</h3>`+(RK.length?`<div class="dica">Ordem: mais pontos; empate vai para o menor tempo de resposta. Pontos = 100 por acerto + bônus de rapidez (até 50 por questão).</div><div class="tbw"><table class="tb"><tr><th>#</th><th>Aluno</th><th>Acertos</th><th>Pontos</th><th>Tempo</th><th>Medalha</th><th>Concluído em</th></tr>${rk}</table></div>`+(topQ.length?'<div class="dica">Questões do desafio que a turma mais errou:</div><ol>'+topQ.map(([id,[e,t]])=>`<li>${escH((DSF_ID[id]||{}).q||id)} <span class="dica">(${e} de ${t} erraram)</span></li>`).join('')+'</ol>':''):'<p class="dica">Ninguém fez o desafio ainda.</p>');
  const RG=rankGeral(AL);
  const blocoGeral=`<h3 class="ph">🥇 RANKING GERAL (fases + desafio)</h3><div class="dica">Pontuação geral = XP ganho nas 5 fases (sem o bônus de XP do desafio, para não contar duas vezes) + pontos do Grande Desafio. Empate: mais lugares concluídos; depois, menor tempo no desafio.</div><div class="tbw"><table class="tb"><tr><th>#</th><th>Aluno</th><th>XP das fases</th><th>Pontos do desafio</th><th>Pontuação geral</th><th>Lugares concluídos</th></tr>${RG.map((r,i)=>`<tr><td class="num">${i+1}º</td><td>${escH(r.S.nome)}</td><td class="num">${r.xf}</td><td class="num">${r.S.dsf&&r.S.dsf.st==='fim'?r.dp:'não fez'}</td><td class="num"><b>${r.tot}</b></td><td class="num">${r.feitos}/${r.total}</td></tr>`).join('')}</table></div>`;
  saida.innerHTML=blocoGeral+blocoDsf+`<h3 class="ph">TURMA (${AL.length} alunos)</h3><div class="tbw"><table class="tb"><tr><th>Aluno</th><th>Salvo em</th><th>Último código</th><th>XP</th><th>Nota</th>${LEVELS.map(l=>`<th>${l.nome}</th>`).join('')}${IND_K.map(k=>`<th>C${k}</th>`).join('')}<th>Atenção</th><th></th></tr>${linhas}</table></div>
  <h3 class="ph">BATALHAS QUE MAIS DERRUBARAM A TURMA</h3>${top.length?'<ol>'+top.map(([b,n])=>`<li>${escH(b.nome)} (${escH(b.conceito)}): ${n} erro(s) somados</li>`).join('')+'</ol>':'<p class="dica">Nenhum erro registrado.</p>'}
  <h3 class="ph">MAPA DE CALOR (erros por batalha)</h3><div class="dica">Verde = 0 ou 1 erro; laranja = 2 ou 3; vermelho = 4 ou mais; · = não concluída; escuro = fase não começada. Quem voltou por código aparece com 0, 2 ou 4+ (o código guarda a faixa).</div>
  <div class="tbw"><table class="tb calor"><tr><th>Aluno</th>${BAT.map(b=>`<th title="${escH(b.conceito)}">${escH(b.nome)}</th>`).join('')}</tr>${calor}</table></div>
  <div class="dica" style="margin-top:8px">A sugestão A/PA/NA vem do jogo. A menção é sua: confirme com a observação em sala e com o que o aluno escreveu (botão abrir). Os textos escritos só aparecem para quem salvou neste computador.</div>`;
  saida.querySelectorAll('button[data-i]').forEach(b=>b.onclick=()=>abrirRelProf(AL[+b.dataset.i]));
  saida.querySelectorAll('button[data-x]').forEach(b=>b.onclick=()=>{const S=AL[+b.dataset.x];if(b.dataset.ok){regGravar(regLer().filter(x=>normNome(x.nome)!==normNome(S.nome)));painelProf()}else{b.dataset.ok='1';b.textContent='confirmar?'}})}
 else saida.append(el('div',{class:'fala'},'Ninguém salvou neste computador ainda. Cole abaixo os nomes e códigos que os alunos anotaram.'));
 cena(el('h2',{},'Área do Professor • progresso da turma'),
  el('div',{class:'dica'},'Aparecem aqui os alunos da planilha online e os que salvaram neste computador. Para ver quem jogou em outro PC, cole o nome e o código que ele anotou (um por linha). Para juntar PCs: Exportar registro em cada um e Juntar registro no seu.'),
  barra,nst,codigosJogo(),saida,el('h3',{class:'ph'},'ADICIONAR ALUNOS PELO CÓDIGO'),ta,el('div',{class:'fb',id:'fbProf',hidden:''}),
  el('div',{class:'acoes'},el('button',{class:'sec',type:'button',on:{click:()=>{profAberto=false;fechar();inicio()}}},'Sair da área (trancar)'),el('button',{type:'button',on:{click:add}},'Adicionar')));
 $('cena').classList.add('largo')}
