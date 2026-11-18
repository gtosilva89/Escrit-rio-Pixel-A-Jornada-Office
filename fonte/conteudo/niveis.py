# Fases, regiões, histórias e lugares do Escritório Pixel – A Jornada Office (turma 202600144).
# Revisão final do curso em 3 encontros: Fase 1 = Word + competências • Fase 2 = Excel • Fase 3 = Outlook, PowerPoint, IA e Edital.
from cards import CARD_IX
G='Gerente Célia'; GC='#e63946'      # gerente da Horizonte Distribuidora
M='Mestra Fórmula'; MC='#7b4fc9'     # a sábia das planilhas
R='Robô Bit'; RC='#8d99ae'           # robô estagiário que faz tudo ao pé da letra
N='Narrador'; NC='#c9b28a'
V='Barão Bagunça'; VC='#3a0ca3'      # o vírus que desformatou a empresa
def h(q,c,cena,t,**k): d={"q":q,"c":c,"cena":cena,"t":t}; d.update(k); return d
def B(id,nome,ic,card,npc,cor,fala,inim,ind,selo=None):
    d={"nome":nome,"ic":ic,"tipo":"batalha","card":CARD_IX[card],"npc":npc,"npcCor":cor,"fala":fala,"inimigo":inim,"qs":card,"ind":ind}
    if selo: d["selo"]=selo
    return (id,d)
def MI(id,nome,ic,miss,npc,cor,fala,ind): return (id,{"nome":nome,"ic":ic,"tipo":"missoes","miss":miss,"npc":npc,"npcCor":cor,"fala":fala,"ind":ind})
def PO(id,codigo,fala): return (id,{"nome":"Portão do Mestre","ic":"portao","tipo":"portao","codigo":codigo,"npc":"Segurança da Portaria","npcCor":"#adb5bd","fala":fala})
def CH(id,nome,chefe,codigo,fala,ind): return (id,{"nome":nome,"ic":"castelo","tipo":"chefao","chefe":chefe,"codigo":codigo,"npc":"Recepcionista da Diretoria","npcCor":"#6a040f","fala":fala,"ind":ind})
POS={3:[(60,60),(170,120),(265,55)],4:[(50,50),(170,35),(255,110),(110,145)],5:[(45,45),(150,35),(255,60),(230,140),(95,145)],6:[(40,40),(135,30),(240,45),(270,125),(165,145),(55,140)]}
def regiao(nome,hist,lista):
    lug={};ids=[]
    for (x,y),(id,d) in zip(POS[len(lista)],lista):
        d=dict(d);d["x"]=x;d["y"]=y;lug[id]=d;ids.append(id)
    return {"nome":nome,"hist":hist,"lugares":lug,"pre":{ids[i]:([ids[i-1]] if i else []) for i in range(len(ids))},
            "edges":[[ids[i],ids[i+1]] for i in range(len(ids)-1)],"saida":ids[-1]}
WD,XL,OU,PP,CP=[1],[2],[3],[4],[5]
# =============================== FASE 1 ===============================
L1={"id":"facil","nome":"Fase 1","titulo":"O Vale dos Documentos","aula":"Encontro 1 de 3 • Word e competências profissionais","bioma":"campo","codigo":None,
 "ind":"Word (layout, formatação, revisão, estrutura, estilos, PDF) • Hard e soft skills • Fontes confiáveis",
 "fases":[
 regiao("Vila da Página",[
  h(N,NC,'escritorio','Na cidade de Pixelândia fica a Horizonte Distribuidora, empresa de equipamentos de tecnologia. Ela vai disputar o Edital Simulado 001/2026: fornecer computadores, TVs e impressoras para 8 escolas.'),
  h(G,GC,'vilao','Desastre! O vírus Barão Bagunça invadiu a rede: desformatou os documentos, quebrou as fórmulas, embaralhou os e-mails e apagou os slides. A entrega é em 3 dias!'),
  h(G,GC,'word','Você é a nova pessoa da equipe e já fez o curso de Office. Primeira missão: salvar os documentos do Word. Comece pela página: margens, orientação e texto.'),
  h(R,RC,'robo','Olá! Eu sou o Bit, estagiário. Faço exatamente o que mandam, nem mais nem menos. Por isso, preciso que você saiba o comando certo!'),
  h(N,NC,'mapa','Como jogar: clique nos lugares que brilham. Antes de cada batalha há um PERGAMINHO com a teoria. Errou? Perde 1 vida e lê a explicação de por que a resposta não serve. A pergunta volta no fim.')],
  [B("vila",'Sala das Margens','vila','layout',G,GC,'O Fantasma Torto entortou as páginas do ofício. Mostre que você domina a guia Layout.',['Fantasma Torto','#e0fbfc','#7b2ff7'],WD),
   B("atelie",'Ateliê da Fonte','atelie','fonte',G,GC,'A Gosma Sem Formato apagou negritos e alinhamentos. Devolva a cara profissional ao texto.',['Gosma Sem Formato','#80ed99','#14112a'],WD),
   B("biblioteca",'Biblioteca do Revisor','biblioteca','revisao',R,RC,'O Bicho-Erro espalhou palavras erradas pela proposta. Use o corretor com inteligência.',['Bicho-Erro','#e63946','#ffd166'],WD,'revisor'),
   MI("cartorio",'Cartório do Ofício','cartorio','oficio',G,GC,'Agora é com você: configure o ofício para a prefeitura e corrija o texto que o Barão bagunçou.',WD)]),
 regiao("Torre dos Estilos",[
  h(G,GC,'livro','A proposta técnica tem 11 seções e de 5 a 8 páginas. Sem cabeçalho, sem números de página e sem sumário, a comissão vai se perder.'),
  h(M,MC,'tabela','Documento grande se organiza com ESTRUTURA (cabeçalho, rodapé, tabelas, notas) e com ESTILOS. Estilo é o segredo do sumário que se monta sozinho.'),
  h(V,VC,'vilao','HA HA HA! Formatei todos os títulos à mão. Quero ver o seu sumário sair do vazio!')],
  [B("torre",'Torre do Cabeçalho','torre','estrutura',G,GC,'A Coruja Sem Página arrancou cabeçalhos e números. Reconstrua a estrutura.',['Coruja Sem Página','#9c6644','#ffd166'],WD),
   B("templo",'Templo dos Estilos','templo','estilos',M,MC,'O Camaleão Desformatado muda a cara dos títulos a cada página. Domine os estilos.',['Camaleão Desformatado','#2a9d8f','#e63946'],WD,'estilo'),
   B("farol",'Farol do Sumário','farol','sumario',M,MC,'O Sumário está apagado e o farol não acende. Faça o sumário automático funcionar.',['Sombra do Índice','#495057','#4cc9f0'],WD),
   B("porto",'Porto do PDF','porto','exportar',G,GC,'O Polvo dos Formatos embaralha .docx, .pdf e .doc. Mostre o formato certo de cada entrega.',['Polvo dos Formatos','#b5179e','#ffd166'],WD),
   PO("portao1",'ESTILO','Alto lá! O código deste portão só o Mestre (seu professor) sabe. Ele fala quando a turma terminar a Torre dos Estilos.')]),
 regiao("Praça das Competências",[
  h(G,GC,'skills','Documento pronto não basta. A comissão quer conhecer a EQUIPE: o que vocês sabem fazer (hard skills) e como trabalham juntos (soft skills).'),
  h(M,MC,'livro','Lembra da pesquisa sobre hard e soft skills? Fonte confiável, link completo e texto com as suas palavras. É isso que separa pesquisa de copiar e colar.'),
  h(V,VC,'vilao','Vou espalhar notícias falsas e sites sem autor! Quero ver vocês acharem a verdade...')],
  [B("mercado",'Mercado das Skills','mercado','skills',G,GC,'O Mercador Confuso mistura habilidades técnicas e de comportamento. Separe cada uma.',['Mercador Confuso','#f4a261','#14112a'],CP),
   B("lab",'Laboratório da Fonte','lab','fontes',M,MC,'O Boato Viral se espalha mais rápido que a verdade. Mostre como se confere uma fonte.',['Boato Viral','#ff006e','#ffd166'],CP,'pesquisa'),
   MI("campo",'Campo da Pesquisa','campo','pesquisa',M,MC,'Hora de mostrar a sua pesquisa: separe as skills e escreva com fonte confiável.',CP),
   CH("castelo1",'Castelo do Barão Bagunça','word','NEGRITO','O Barão Bagunça trancou o último documento no castelo. Chefão se enfrenta em EQUIPE, no quadro. Peça o código ao Mestre.',[1,5])]),
 ]}
# =============================== FASE 2 ===============================
L2={"id":"medio","nome":"Fase 2","titulo":"A Torre das Planilhas","aula":"Encontro 2 de 3 • Excel (listas de exercícios e proposta comercial)","bioma":"savana","codigo":'PLANILHA',
 "ind":"Fórmulas, funções, porcentagem, referência absoluta, SE, CONT.SE, SOMASE, PROCV, erros e gráficos",
 "fases":[
 regiao("Mercado das Contas",[
  h(G,GC,'planilha','Os documentos voltaram! Mas o Barão fugiu para a planilha da proposta comercial: totais zerados, fórmulas apagadas, gráficos sumidos.'),
  h(M,MC,'planilha','Eu sou a Mestra Fórmula. Toda fórmula começa com = e o Excel em português separa argumentos com ; (ponto e vírgula). Vamos do básico ao PROCV, como nas listas de exercícios.'),
  h(R,RC,'robo','Eu calculo tudo na hora... desde que a fórmula esteja certa. Se escrever errado, eu calculo errado mais rápido ainda!')],
  [B("mercado2",'Feira das Operações','mercado','operacoes',M,MC,'O Duende do Sinal trocou os + pelos x. Ponha ordem nas contas do pedido da papelaria.',['Duende do Sinal','#ffd166','#14112a'],XL),
   B("planilha2",'Banca das Funções','planilha','funcoes',M,MC,'A Lesma Somadora soma célula por célula. Mostre o poder de SOMA, MÉDIA, MÍNIMO e MÁXIMO.',['Lesma Somadora','#90be6d','#e63946'],XL),
   B("moinho2",'Moinho do Percentual','moinho','porcento',G,GC,'O Gnomo do Desconto dá aumentos no lugar de descontos. Acerte os percentuais.',['Gnomo do Desconto','#e76f51','#ffd166'],XL),
   MI("cartorio2",'Caixa da Papelaria','cartorio','caixa',M,MC,'Agora é com você: escreva as fórmulas da papelaria e confira no Excel.',XL)]),
 regiao("Cofre do Cifrão",[
  h(G,GC,'cofre','A planilha converte preços pelo dólar e aplica margem. Mas, ao arrastar as fórmulas, as linhas de baixo deram erro!'),
  h(M,MC,'chave','A chave do cofre é o cifrão: $B$7 não sai do lugar quando a fórmula é copiada. E cada mensagem de erro é uma pista.')],
  [B("cofre2",'Cofre do Dólar','cofre','absoluta',M,MC,'O Ladrão de Referências faz a fórmula escorregar ao arrastar. Trave o que precisa ficar fixo.',['Ladrão de Referências','#6c757d','#ffd166'],XL,'cifrao'),
   B("forja2",'Forja do ARRED','forja','arred',M,MC,'O Ferreiro das Dízimas deixou parcelas com 7 casas decimais. Arredonde e junte textos.',['Ferreiro das Dízimas','#9d0208','#ffb703'],XL),
   B("caverna2",'Caverna dos Erros','caverna','erros',R,RC,'Cada morcego da caverna é uma mensagem de erro. Diga o que cada uma quer dizer.',['Morcego #DIV/0!','#3a3a46','#ff0054'],XL),
   PO("portao2",'CIFRAO','Alto lá! O código deste portão só o Mestre sabe. Ele libera quando a turma dominar o $.')]),
 regiao("Templo das Decisões",[
  h(G,GC,'balanca','A comissão quer saber: quais itens estão dentro do orçamento? Quantos cumprem a garantia? Quanto custa cada categoria?'),
  h(M,MC,'balanca','Para a planilha DECIDIR sozinha, use SE, E e OU. Para contar e somar com critério, CONT.SE e SOMASE.')],
  [B("templo2",'Altar do SE','templo','se',M,MC,'A Esfinge Indecisa nunca sabe se é verdadeiro ou falso. Ensine a planilha a decidir.',['Esfinge Indecisa','#e9c46a','#14112a'],XL),
   B("ponte2",'Ponte do E e do OU','ponte','eou',M,MC,'O Troll das Condições só deixa passar quem sabe a diferença entre E e OU.',['Troll das Condições','#6b705c','#e63946'],XL,'logica'),
   B("biblioteca2",'Arquivo do CONT.SE','biblioteca','contse',M,MC,'O Contador Cego conta tudo de uma vez. Mostre como contar e somar só o que interessa.',['Contador Cego','#457b9d','#ffd166'],XL),
   MI("lab2",'Laboratório das Decisões','lab','decisao',M,MC,'Escreva as fórmulas de decisão do boletim e das despesas.',XL)]),
 regiao("Observatório dos Gráficos",[
  h(G,GC,'grafico','Última parte da planilha: buscar os preços com PROCV e montar os gráficos da evolução dos investimentos, de 2022 a 2026.'),
  h(V,VC,'vilao','Vocês podem até calcular... mas sem gráfico a comissão não vai entender NADA. HA HA HA!')],
  [B("torre2",'Telescópio do PROCV','torre','procv',M,MC,'O Buscador Perdido nunca encontra o produto na tabela. Mostre como o PROCV procura.',['Buscador Perdido','#4361ee','#ffd166'],XL,'procv'),
   B("montanha2",'Mirante dos Gráficos','montanha','graficos',G,GC,'A Névoa dos Números esconde a evolução. Escolha o gráfico certo para cada pergunta.',['Névoa dos Números','#adb5bd','#3a0ca3'],XL),
   B("farol2",'Farol da Organização','farol','organizar',G,GC,'O Tornado da Bagunça embaralhou as linhas. Classifique, filtre e destaque.',['Tornado da Bagunça','#8ecae6','#e63946'],XL),
   CH("castelo2",'Fortaleza da Planilha Quebrada','planilha','PROCV','O Barão Bagunça se escondeu na guia 05_RESUMO. Chefão em EQUIPE, no quadro. Peça o código ao Mestre.',[2])]),
 ]}
# =============================== FASE 3 ===============================
L3={"id":"dificil","nome":"Fase 3","titulo":"O Porto das Comunicações","aula":"Encontro 3 de 3 • Outlook, PowerPoint, IA e a entrega do Edital","bioma":"cristal","codigo":'OUTLOOK',
 "ind":"Outlook (e-mail, segurança, pastas, contatos, agenda) • PowerPoint (modos, objetos, transições, apresentação) • IA • Edital",
 "fases":[
 regiao("Correio Central",[
  h(G,GC,'email','A planilha está salva! Agora o Barão atacou o Outlook: e-mails para as pessoas erradas, anexos perdidos e um golpe de phishing rondando a caixa de entrada.'),
  h(R,RC,'robo','Se você mandar eu colocar 40 clientes no campo Para, eu coloco. Todos vão ver o e-mail de todos. Tem certeza?'),
  h(G,GC,'email','Primeira tarefa: mandar à comissão um e-mail profissional com um pedido de esclarecimento sobre o edital.')],
  [B("porto3",'Cais da Caixa de Entrada','porto','outlook',G,GC,'O Carteiro Perdido não sabe para que serve cada pasta. Mostre o caminho.',['Carteiro Perdido','#f4a261','#14112a'],OU),
   B("vila3",'Agência Para, Cc e Cco','vila','envio',G,GC,'O Espião do Cc expõe os endereços dos clientes. Use cada campo do jeito certo.',['Espião do Cc','#264653','#ffd166'],OU),
   B("muralha3",'Muralha das Senhas','muralha','seguranca',R,RC,'O Pescador de Senhas está jogando a isca do phishing. Proteja a empresa.',['Pescador de Senhas','#023047','#ff006e'],OU,'seguranca'),
   MI("cartorio3",'Escrivaninha do E-mail','cartorio','email',G,GC,'Escreva o e-mail de pedido de esclarecimento para a comissão.',OU)]),
 regiao("Arquivo e Agenda",[
  h(G,GC,'agenda','A caixa de entrada virou um caos e a defesa da proposta ainda não está marcada. Precisamos da sala, do projetor e da equipe inteira.'),
  h(M,MC,'agenda','Pastas e regras organizam. Contatos e grupos agilizam. A agenda, com recursos e compartilhamento, marca a reunião certa no horário certo.')],
  [B("biblioteca3",'Arquivo das Pastas','biblioteca','organiza',G,GC,'A Traça das Mensagens rói tudo o que não está organizado. Use pastas, regras e filtros.',['Traça das Mensagens','#9c6644','#e63946'],OU),
   B("mercado3",'Praça dos Contatos','mercado','contatos',G,GC,'O Esquecido nunca lembra o e-mail de ninguém. Mostre o catálogo de endereços.',['Esquecido','#b8b0d6','#14112a'],OU),
   B("moinho3",'Relógio da Agenda','moinho','agenda',G,GC,'O Atrasildo marca reunião sem sala e sem convidados. Domine o calendário.',['Atrasildo','#ffb703','#3a0ca3'],OU,'agenda'),
   PO("portao3",'AGENDA','Alto lá! O código deste portão só o Mestre sabe. Ele libera quando a reunião da defesa estiver marcada.')]),
 regiao("Palco dos Slides",[
  h(G,GC,'slides','A defesa tem 7 a 8 minutos e no máximo 6 slides. O Barão apagou o Slide Mestre e colocou 300 palavras por slide.'),
  h(M,MC,'slides','Lembre do pitch do Novo Produto com IA: pouco texto, imagens, paleta de cores, transições e a sua fala no comando.')],
  [B("estadio3",'Palco dos Modos','estadio','ppt',G,GC,'O Diretor Confuso não acha o modo certo de exibir. Mostre cada modo e o Slide Mestre.',['Diretor Confuso','#e63946','#ffd166'],PP),
   B("atelie3",'Ateliê dos Objetos','atelie','pptobj',G,GC,'O Pintor Exagerado enche os slides de texto e cores. Mostre as boas práticas.',['Pintor Exagerado','#ff7b00','#14112a'],PP),
   B("torre3",'Torre da Apresentação','torre','transicao',G,GC,'O Mágico das Transições confunde transição com animação. Ensaie a apresentação.',['Mágico das Transições','#7209b7','#4cc9f0'],PP,'palco'),
   MI("campo3",'Camarim do Pitch','campo','pitch',G,GC,'Monte a sequência dos slides da defesa e escolha os recursos certos.',PP)]),
 regiao("Sala da Comissão",[
  h(G,GC,'ia','Chegou o dia! A comissão do Edital está reunida. Cada empresa vai protocolar a proposta e defender as suas escolhas.'),
  h(M,MC,'ia','A IA ajudou a criar ideias, mas quem responde à comissão é você. Coerência entre Excel, Word, PowerPoint e e-mail vale ponto.'),
  h(V,VC,'vilao','Última chance! Se UM valor estiver diferente entre os arquivos, a proposta inteira cai. HA HA HA!')],
  [B("lab3",'Laboratório da IA','lab','ia',M,MC,'O Robô Alucinado inventa números sem fonte. Use a IA com senso crítico.',['Robô Alucinado','#4cc9f0','#ff006e'],CP),
   B("cofre3",'Mesa da Comissão','cofre','edital',G,GC,'O Fiscal Implacável confere cada regra do edital. Mostre que a proposta está coerente.',['Fiscal Implacável','#14112a','#ffd166'],CP),
   MI("cartorio4",'Protocolo da Proposta','cartorio','protocolo',G,GC,'Escreva o e-mail de protocolo com o assunto obrigatório e os três anexos.',[3,5]),
   CH("castelo3",'Sala de Defesa da Comissão','comissao','EDITAL','O Barão Bagunça se disfarçou de membro da comissão. Chefão final em EQUIPE, no quadro. Peça o código ao Mestre.',[1,2,3,4,5])]),
 ]}
LEVELS=[L1,L2,L3]
