// ===================== ENVIO PARA A PLANILHA DO PROFESSOR =====================
// Cada "Salvar" manda o registro completo do aluno (progresso, erros e textos escritos) para uma
// planilha Google do professor (Apps Script em jogo/planilha/Codigo.gs). A Área do Professor baixa de lá.
// Sem internet, o envio fica pendente e é refeito sozinho depois.
const NUVEM_URL='https://script.google.com/macros/s/AKfycbyupoFsaVZ1cPd8wVMxWVWK1xgLAIu311InJV9-_ofHrezehTEgV-lSD54dOuhxYE4O0A/exec';
const ENV_KEY='escritorioPixel_enviados';
function envLer(){try{return JSON.parse(localStorage.getItem(ENV_KEY)||'{}')}catch(e){return{}}}
function envGravar(o){try{localStorage.setItem(ENV_KEY,JSON.stringify(o))}catch(e){}}
async function nuvemEnviar(x){if(!NUVEM_URL)return false;
 try{await fetch(NUVEM_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({nome:x.nome,codigo:x.codigo,data:x.data,ts:x.ts||0,origem:x.origem,xp:(x.S||{}).xp,S:x.S})});
  const e=envLer();e[normNome(x.nome)]=x.ts||0;envGravar(e);return true}catch(err){return false}}
let nuvemOcupada=false;
async function nuvemPendentes(){if(!NUVEM_URL||nuvemOcupada)return;nuvemOcupada=true;
 try{const e=envLer();for(const x of regLer())if(x.origem==='jogo'&&e[normNome(x.nome)]!==(x.ts||0))await nuvemEnviar(x)}finally{nuvemOcupada=false}}
async function nuvemBaixar(chave){if(!NUVEM_URL)return{erro:'Planilha não configurada.'};
 try{const r=await fetch(NUVEM_URL+'?chave='+encodeURIComponent(chave)+'&t='+Date.now());const d=await r.json();if(!d.ok)return{erro:d.erro==='senha'?'A planilha recusou a senha.':'Erro na planilha.'};
  const reg=regLer();let n=0;for(const x of d.lista||[]){if(!x||!x.nome||!x.S)continue;const i=reg.findIndex(y=>normNome(y.nome)===normNome(x.nome));const novo={nome:x.nome,codigo:x.codigo,data:x.data,origem:'nuvem',ts:x.ts||0,S:x.S};
   if(i<0){reg.push(novo);n++}else if((x.ts||0)>(reg[i].ts||0)){reg[i]=novo;n++}}
  regGravar(reg);return{n,total:(d.lista||[]).length}}catch(err){return{erro:'Sem conexão com a planilha.'}}}
if(NUVEM_URL){setTimeout(nuvemPendentes,1500);setInterval(nuvemPendentes,60000)}
