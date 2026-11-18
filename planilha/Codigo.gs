// Escritório Pixel – A Jornada Office (turma 202600144): recebe os salvamentos dos alunos e entrega para a Área do Professor.
// Instalação: Planilha Google > Extensões > Apps Script > cole este código > Implantar >
// Nova implantação > Tipo: App da Web > Executar como: Eu > Quem pode acessar: Qualquer pessoa.
const CHAVE = 'pixel2026'; // a mesma senha da Área do Professor

function doPost(e) {
  const trava = LockService.getScriptLock();
  trava.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d || !d.nome || !d.S) return saida({ erro: 'dados' });
    const aba = pegarAba();
    const id = norm(d.nome);
    const v = aba.getDataRange().getValues();
    let linha = -1;
    for (let i = 1; i < v.length; i++) if (v[i][0] === id) { linha = i + 1; break; }
    if (linha > 0 && Number(v[linha - 1][4]) > Number(d.ts || 0)) return saida({ ok: true, antigo: true });
    const valores = [id, d.nome, d.codigo || '', d.data || '', Number(d.ts || 0), d.xp || 0, JSON.stringify(d)];
    if (linha > 0) aba.getRange(linha, 1, 1, valores.length).setValues([valores]);
    else aba.appendRow(valores);
    return saida({ ok: true });
  } finally {
    trava.releaseLock();
  }
}

function doGet(e) {
  if (norm(e.parameter.chave) !== norm(CHAVE)) return saida({ erro: 'senha' });
  const v = pegarAba().getDataRange().getValues().slice(1);
  const lista = [];
  for (const r of v) { try { lista.push(JSON.parse(r[6])); } catch (err) {} }
  return saida({ ok: true, lista: lista });
}

function pegarAba() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName('Salvamentos');
  if (!aba) {
    aba = ss.insertSheet('Salvamentos');
    aba.appendRow(['id', 'Aluno', 'Último código', 'Salvo em', 'ts', 'XP', 'dados (não editar)']);
  }
  return aba;
}

function norm(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function saida(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
