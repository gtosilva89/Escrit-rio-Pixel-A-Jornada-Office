"""Gera fonte/dados.js a partir dos arquivos de conteúdo (cards, qs, niveis, miss).
Uso: python3 gerar_dados.py   (depois rode ../../build.sh)"""
import json, os, sys, re
aqui = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, aqui)
from cards import CARDS; from qs import Q; from niveis import LEVELS; from miss import MISSOES, CHEFES, NIVEIS_XP, SELOS
ids=set(); nb=0
for L in LEVELS:
    assert L['id'] in SELOS, L['id']; assert len(L['fases'])<=4 and len(LEVELS)<=8
    for f in L['fases']:
        for k, v in f['lugares'].items():
            assert k not in ids, ('id repetido', k); ids.add(k)
            if v['tipo'] == 'batalha':
                nb+=1; assert v['qs'] in Q and v['card'] < len(CARDS), k
                if v.get('selo'): assert v['selo'] in SELOS, v['selo']
            if v['tipo'] == 'missoes': assert v['miss'] in MISSOES, k
            if v['tipo'] == 'chefao': assert v['chefe'] in CHEFES, k; assert CHEFES[v['chefe']]['selo'] in SELOS
usadas={v['qs'] for L in LEVELS for f in L['fases'] for v in f['lugares'].values() if v['tipo']=='batalha'}
assert usadas==set(Q), ('perguntas sem batalha', set(Q)-usadas)
for k,lst in Q.items():
    for x in lst: assert len(set(x['o']))==len(x['o']), (k, x['q'])
for m in MISSOES.values():
    for it in m['lista']:
        if it['tipo'] == 'sel':
            for rot, ops, c in it['itens']: assert c in ops, (rot, c)
        for r_ in it.get('regras',[]): re.compile(r_[1])
for C in CHEFES.values():
    for e in C['etapas']:
        if e.get('tipo')=='chips': assert all(c in e['ops'] for c in e['certo'])
J = lambda o: json.dumps(o, ensure_ascii=False)
js = "// ===================== DADOS: ESCRITÓRIO PIXEL (gerado por conteudo/gerar_dados.py; não edite à mão) =====================\n"
js += f"const CARDS = {J(CARDS)};\nconst LEVELS = {J(LEVELS)};\nconst Q = {J(Q)};\nconst MISSOES = {J(MISSOES)};\nconst CHEFES = {J(CHEFES)};\nconst NIVEIS_XP = {J(NIVEIS_XP)};\nconst SELOS = {J(SELOS)};\n"
open(os.path.join(aqui, '..', 'dados.js'), 'w', encoding='utf-8').write(js)
print('dados.js gerado:', nb, 'batalhas,', sum(len(v) for v in Q.values()), 'perguntas,', len(CARDS), 'pergaminhos')
