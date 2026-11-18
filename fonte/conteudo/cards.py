# Pergaminhos (teoria curta antes de cada batalha). Exemplo sempre na empresa fictícia Horizonte Distribuidora.
def c(k,t,p,ex): return (k,{"t":t,"p":p,"ex":ex})
LISTA=[
# ---------------- FASE 1 • Word e competências ----------------
c("layout","Layout da página",[
 "A guia LAYOUT muda a página inteira: Margens, Orientação (Retrato = em pé; Paisagem = deitada), Tamanho (A4 é o padrão no Brasil) e Colunas.",
 "QUEBRAS: a Quebra de Página (Ctrl+Enter) começa uma página nova. A Quebra de Seção divide o documento em partes com configuração própria, por exemplo uma página em Paisagem no meio de um relatório em Retrato.",
 "Nunca use vários Enter para pular de página: qualquer mudança no texto desalinha tudo."],
 "o ofício para a prefeitura vai em A4, Retrato, margens de 2,5 cm; a tabela de preços larga fica numa seção em Paisagem."),
c("fonte","Formatação de texto",[
 "FONTE muda as letras: tipo, tamanho, cor, Negrito (Ctrl+N), Itálico (Ctrl+I) e Sublinhado (Ctrl+S). Atenção: no Office em português, Ctrl+B é SALVAR.",
 "PARÁGRAFO muda o bloco: alinhamento (Esquerda Ctrl+Q, Centralizar Ctrl+E, Direita Ctrl+G, Justificar Ctrl+J), recuos e espaçamento entre linhas.",
 "O PINCEL DE FORMATAÇÃO copia só a aparência de um texto para outro. Duplo clique no pincel aplica várias vezes."],
 "o título do comunicado é centralizado e em negrito; o corpo é justificado, com espaçamento 1,15."),
c("revisao","Ortografia, gramática e idioma",[
 "Sublinhado ondulado VERMELHO = possível erro de ortografia. AZUL (linha dupla) = gramática ou estilo. F7 revisa o documento inteiro.",
 "Nome próprio correto marcado como erro? Botão direito > Adicionar ao Dicionário.",
 "Texto colado da internet todo marcado? Pode estar com outro idioma de revisão: Revisão > Idioma > Definir Idioma de Revisão > Português (Brasil).",
 "O corretor não vê palavra certa no lugar errado (concerto x conserto). Sempre releia."],
 "antes de enviar a proposta, a equipe passa o F7 e lê em voz alta o texto final."),
c("estrutura","Elementos estruturais",[
 "CABEÇALHO e RODAPÉ (Inserir) se repetem em todas as páginas: logo, nome da empresa, número de página.",
 "NÚMERO DE PÁGINA é automático: recalcula sozinho. NOTA DE RODAPÉ (Referências) explica um termo no pé da página, com numeração automática.",
 "TABELA (Inserir > Tabela) organiza dados em linhas e colunas. FOLHA DE ROSTO (Inserir) cria uma capa pronta."],
 "a proposta técnica tem capa, cabeçalho com o logo, rodapé com página X de Y e tabela de equipamentos."),
c("estilos","Estilos",[
 "ESTILO é formatação com significado: Normal (texto comum), Título 1 (capítulo), Título 2 (subtítulo).",
 "Para mudar TODOS os títulos de uma vez: botão direito no estilo > Modificar.",
 "Os estilos alimentam o PAINEL DE NAVEGAÇÃO (Exibir) e o SUMÁRIO automático. Formatar à mão (só negrito e fonte grande) não marca o texto como título."],
 "as 11 seções da proposta técnica estão em Título 1; os itens de cada seção, em Título 2."),
c("sumario","Sumário automático",[
 "Referências > Sumário cria a lista de títulos com as páginas, a partir dos estilos de Título.",
 "Mudou o texto? Referências > Atualizar Sumário > Atualizar o índice inteiro.",
 "Sumário vazio quase sempre quer dizer: os títulos não estão com estilo de Título. Em Sumário Personalizado você escolhe quantos níveis aparecem."],
 "o sumário da proposta é atualizado logo antes de exportar o PDF."),
c("exportar","Conversão, importação e exportação",[
 ".docx é o formato do Word. .doc é o formato antigo (Word 97-2003), para quem tem versão velha.",
 "PDF: Arquivo > Salvar como (tipo PDF) ou Exportar > Criar PDF/XPS. Mantém a aparência e não é feito para edição. Guarde sempre o .docx para poder alterar.",
 "O Word abre PDF e converte em texto editável, mas o layout pode mudar: revise. Renomear .docx para .pdf NÃO converte o arquivo."],
 "a equipe envia Proposta_Tecnica_Comercial_Horizonte.pdf e guarda o .docx para a alteração surpresa."),
c("skills","Hard skills e soft skills",[
 "HARD SKILLS são técnicas, aprendidas e comprováveis: Excel, digitação, idioma, operar um sistema.",
 "SOFT SKILLS são comportamentais: comunicação, trabalho em equipe, empatia, organização, gestão do tempo, ética, resiliência.",
 "Uma completa a outra. Em entrevista, mostre com um exemplo real: situação, o que você fez e o resultado."],
 "no Edital, montar a planilha usou hard skills; dividir tarefas e cumprir o prazo usou soft skills."),
c("fontes","Pesquisa e fontes confiáveis",[
 "Fonte confiável tem responsável identificado (instituição, autor), data e objetivo claro. Desconfie de páginas sem autor, posts virais e comentários.",
 "Confira em mais de uma fonte séria. Escreva com suas palavras: copiar e colar como seu é plágio.",
 "No documento, coloque o link completo (https://...) clicável (Inserir > Link) e, no fim, a lista de Fontes: título, quem publicou, link e data de acesso."],
 "a pesquisa sobre soft skills usa um site institucional e uma reportagem de veículo reconhecido, com links."),
# ---------------- FASE 2 • Excel ----------------
c("operacoes","Fórmulas e operações",[
 "Toda fórmula começa com = . Operadores: + soma, - subtração, * multiplicação, / divisão.",
 "Ordem: parênteses primeiro, depois * e /, depois + e -. =10+2*3 dá 16; =(10+2)*3 dá 36.",
 "A ALÇA DE PREENCHIMENTO (quadradinho no canto da célula) copia a fórmula para as linhas de baixo, ajustando as referências."],
 "Total do produto = Quantidade × Preço unitário: =B8*C8, arrastado para todos os itens do pedido."),
c("funcoes","SOMA, MÉDIA, MÍNIMO e MÁXIMO",[
 "=SOMA(B2:B13) soma de B2 ATÉ B13. Os dois-pontos ( : ) indicam intervalo.",
 "No Excel em português, argumentos são separados por ponto e vírgula ( ; ), porque a vírgula é decimal.",
 "MÉDIA (com acento), MÍNIMO e MÁXIMO funcionam igual: =MÉDIA(B2:B13). Nome errado dá #NOME?."],
 "o resumo de vendas mostra total do ano, média mensal, pior mês e melhor mês de cada vendedor."),
c("porcento","Porcentagem",[
 "10% é o mesmo que 0,10. O formato Porcentagem só muda a aparência.",
 "Aumento: =preço*(1+10%). Desconto: =preço*(1-15%). Só o valor do desconto: =preço*15%.",
 "Percentual de uma meta: =realizado/meta, formatado em %."],
 "a margem de lucro da tabela de preços e o desconto da proposta do Edital usam porcentagem."),
c("absoluta","Referência absoluta ($)",[
 "Referência RELATIVA (B7) muda quando a fórmula é copiada. ABSOLUTA ($B$7) fica fixa.",
 "Use $ quando todas as linhas dependem de UMA célula: cotação do dólar, margem, taxa.",
 "F4 alterna B7 → $B$7 → B$7 → $B7. O $ trava o que vem logo depois dele."],
 "=C10/$B$7 converte todos os preços para dólar usando a cotação fixa em B7."),
c("arred","ARRED, CONCATENAR e HOJE",[
 "=ARRED(número;casas) arredonda de verdade o valor. O botão de casas decimais só muda a aparência.",
 "=CONCATENAR(A2;\" \";B2) junta textos; o & faz o mesmo: =A2&\" \"&B2.",
 "=HOJE() mostra a data atual e se atualiza sozinha. =AGORA() mostra data e hora."],
 "a parcela =ARRED(B2/3;2) e o código do pedido =CONCATENAR(\"PED-\";A2)."),
c("erros","Mensagens de erro",[
 "#DIV/0! divisão por zero ou célula vazia. #NOME? nome de função errado (ex.: MEDIA sem acento).",
 "##### coluna estreita (o valor está certo). #N/D valor não encontrado (PROCV).",
 "#VALOR! tipo errado (texto numa conta). #REF! a fórmula aponta para célula que foi apagada."],
 "na revisão da planilha da proposta, cada erro é lido como pista do que consertar."),
c("se","Função SE",[
 "=SE(teste;valor se verdadeiro;valor se falso).",
 "Comparadores: > maior, < menor, >= maior ou igual, <= menor ou igual, = igual, <> diferente.",
 "Texto vai entre aspas: \"Aprovado\". \"\" (aspas sem nada) deixa a célula em branco."],
 "=SE(C2=\"Concluído\";D2*5%;0) calcula a comissão só das vendas concluídas."),
c("eou","E, OU e SE aninhado",[
 "E(cond1;cond2) é verdadeiro se TODAS forem verdadeiras. OU(cond1;cond2) é verdadeiro se PELO MENOS UMA for.",
 "Use dentro do SE: =SE(E(B2>50000;C2<2);\"Bônus\";\"\").",
 "SE aninhado testa faixas: =SE(F2>=9;\"Ótimo\";SE(F2>=7;\"Bom\";\"Recuperação\")). Teste da maior faixa para a menor; feche um parêntese para cada SE."],
 "frete grátis =SE(OU(B2=\"VIP\";C2>300);0;25)."),
c("contse","CONT.SE e SOMASE",[
 "=CONT.SE(intervalo;critério) CONTA quantas células atendem ao critério.",
 "=SOMASE(intervalo;critério;intervalo_soma) SOMA os valores das linhas que atendem ao critério.",
 "Critério com comparação vai entre aspas (\">1000\"). Critério pode ser uma célula (H2, sem aspas). Trave os intervalos com $ antes de arrastar."],
 "=SOMASE($B$2:$B$40;\"Transporte\";$C$2:$C$40) soma o gasto com transporte."),
c("procv","PROCV",[
 "=PROCV(valor procurado;tabela;número da coluna;FALSO) procura o valor na PRIMEIRA coluna da tabela e traz a coluna pedida da mesma linha.",
 "FALSO = exato (códigos). VERDADEIRO = aproximado (faixas), com a primeira coluna em ordem crescente.",
 "Trave a tabela com $ e lembre: #N/D = não encontrou."],
 "digitando o código do equipamento, o PROCV traz o modelo e o preço da guia 01_PESQUISA."),
c("graficos","Gráficos e dashboard",[
 "Selecione os dados com os títulos e vá em Inserir > Gráficos.",
 "LINHA: evolução no tempo. COLUNAS: comparar categorias (Faturamento x Meta). PIZZA: partes de um todo, com poucas fatias.",
 "Todo gráfico precisa de título claro e unidade (R$, %). Dashboard = indicadores + gráficos numa tela só."],
 "a guia 04_EVOLUCAO tem um gráfico de linha de 2022 a 2026 e a 05_RESUMO uma pizza da composição do valor."),
c("organizar","Organizar dados",[
 "Dados > Classificar ordena as linhas inteiras. Dados > Filtro mostra só o que interessa, sem apagar.",
 "Formatação Condicional pinta sozinha (ex.: notas abaixo de 7 em vermelho) e acompanha a mudança dos valores.",
 "Exibir > Congelar Painéis deixa o cabeçalho visível. Guias com nome claro organizam a pasta de trabalho."],
 "a planilha da proposta tem guias 01 a 05, filtro na pesquisa e destaque nos itens fora do orçamento."),
# ---------------- FASE 3 • Outlook, PowerPoint, IA e Edital ----------------
c("outlook","Outlook: conceitos e área de trabalho",[
 "O Outlook reúne E-mail, Calendário, Pessoas (contatos) e Tarefas. A barra de navegação troca entre eles.",
 "Pastas padrão: Caixa de Entrada, Rascunhos (não enviados), Itens Enviados, Itens Excluídos, Lixo Eletrônico (spam) e Caixa de Saída.",
 "A Faixa de Opções tem os comandos (barras de menus e ferramentas). O Painel de Leitura mostra a mensagem selecionada."],
 "a assistente começa o dia pela Caixa de Entrada e confere o Lixo Eletrônico para não perder o e-mail da comissão."),
c("envio","Enviar, responder, cópias e anexos",[
 "PARA: quem deve agir. CC: quem precisa saber (todos veem). CCO: cópia oculta, ninguém vê os outros endereços.",
 "RESPONDER vai só para quem enviou; RESPONDER A TODOS vai para todos; ENCAMINHAR manda para outra pessoa e leva os anexos.",
 "Anexar Arquivo (clipe). Arquivo grande (acima de 20 a 25 MB): mande o link do OneDrive/nuvem. Assunto claro e assinatura sempre."],
 "o protocolo vai Para a comissão, com Cc para o coordenador do grupo e três anexos."),
c("seguranca","Senhas e segurança",[
 "Senha forte: longa, com letras, números e símbolos, só sua, diferente em cada serviço.",
 "Nunca passe a senha, nem para colega. Ative a autenticação em dois fatores (código no celular).",
 "PHISHING: e-mail falso com urgência, link e pedido de senha ou dados. Passe o mouse sobre o link para ver o endereço real, não clique e avise o TI."],
 "um e-mail \"do banco\" pedindo senha chegou ao financeiro: foi marcado como phishing e excluído."),
c("organiza","Pastas, regras, filtros e pesquisa",[
 "Crie PASTAS por assunto (Clientes, Financeiro, Edital) e arraste as mensagens.",
 "REGRAS movem sozinhas as mensagens (ex.: tudo do fornecedor Alfa → pasta Fornecedores).",
 "FILTRO mostra só Não Lidos, Com Anexos ou Sinalizados. A BANDEIRA cria lembrete de acompanhamento. A caixa PESQUISAR encontra por remetente, assunto ou palavra."],
 "os e-mails do Edital caem sozinhos na pasta Edital por uma regra."),
c("contatos","Contatos e catálogo de endereços",[
 "Em PESSOAS você cadastra contatos (nome, e-mail, telefone, empresa).",
 "O CATÁLOGO DE ENDEREÇOS da empresa (Lista Global) traz todos os colegas. GRUPO DE CONTATOS junta várias pessoas num nome só.",
 "Para passar contatos, compartilhe a pasta de contatos ou envie o contato por e-mail. Guarde só os dados pessoais necessários (LGPD)."],
 "o grupo \"Equipe Edital\" leva o e-mail para os 5 integrantes de uma vez."),
c("agenda","Agenda, recursos e compartilhamento",[
 "COMPROMISSO é só seu. REUNIÃO convida pessoas, que aceitam ou recusam. RECORRÊNCIA repete (toda segunda às 9h).",
 "RECURSOS: salas e equipamentos (projetor) entram no convite e ficam reservados. O ASSISTENTE DE AGENDAMENTO mostra quem está livre.",
 "COMPARTILHAR CALENDÁRIO: você escolhe a permissão (só disponibilidade, detalhes ou editar)."],
 "a defesa da proposta foi marcada como reunião, com a Sala 2 e o projetor como recursos."),
c("ppt","PowerPoint: modos e layout",[
 "Modos de exibição: Normal (editar), Classificação de Slides (reorganizar), Anotações, Leitura e Apresentação de Slides.",
 "Ctrl+M cria um slide. Página Inicial > Layout muda a organização das caixas.",
 "Exibir > SLIDE MESTRE é o modelo de todos os slides: logo, fontes e cores entram ali uma vez só. As Anotações são lembretes que o público não vê."],
 "o logo da Horizonte está no Slide Mestre e aparece nos 6 slides da defesa."),
c("pptobj","Figuras, objetos e boas práticas",[
 "Inserir: Imagens, Formas, Ícones, SmartArt (diagramas prontos), Gráfico, Tabela e Vídeo.",
 "Alinhar > Distribuir deixa objetos com espaços iguais. Gráfico copiado do Excel mantém qualidade: confira os valores.",
 "Pouco texto, imagens e a paleta de 2 a 3 cores. Não use imagens de pessoas reais nem marcas existentes sem autorização."],
 "o slide 4 da defesa tem o gráfico de evolução colado do Excel e um SmartArt da implantação."),
c("transicao","Transições, impressão e apresentação",[
 "TRANSIÇÃO = efeito entre slides (Aplicar a Todos padroniza). ANIMAÇÃO = efeito em um objeto dentro do slide.",
 "Imprimir: Slides em página inteira, Anotações, Estrutura de Tópicos ou Folhetos (3 por página traz linhas para anotar).",
 "F5 começa do início; Shift+F5 do slide atual; Esc encerra. O Modo de Exibição do Apresentador mostra notas, cronômetro e próximo slide."],
 "a comissão recebeu folhetos de 3 slides por página para anotar durante a defesa."),
c("ia","Inteligência Artificial com senso crítico",[
 "A IA ajuda a gerar ideias, textos e imagens, mas pode errar e inventar dados. Revise sempre: a responsabilidade é sua.",
 "Bom prompt tem contexto, público, quantidade, formato e tom.",
 "Não cole dados sigilosos ou pessoais em IA pública. Registre os prompts e o que você corrigiu. Dado sem fonte não entra no trabalho."],
 "no Novo Produto com IA, o slogan foi gerado com IA, adaptado pela aluna e registrado no Word."),
c("edital","A proposta do Edital",[
 "Coerência: o valor total do Excel é o mesmo no Word, no PowerPoint e no e-mail.",
 "Versões: a alteração surpresa gera o v2 de todos os arquivos que mudam.",
 "Protocolo por e-mail: assunto \"Proposta Comercial - Edital Simulado 001/2026 - Nome da Empresa\", breve apresentação e os três anexos (PDF, .xlsx, .pptx)."],
 "a Horizonte entregou a proposta v2 com o mesmo total nos três arquivos."),
]
CARD_IX={k:i for i,(k,_) in enumerate(LISTA)}
CARDS=[d for _,d in LISTA]
