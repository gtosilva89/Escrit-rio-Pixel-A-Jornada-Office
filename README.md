# Escritório Pixel – A Jornada Office

RPG em pixel art para revisar o Pacote Office, criado para a turma 202600144 do curso **Pacote Office Corporativo – Recursos Básicos** (Senac PR).

**Jogar:** https://gtosilva89.github.io/Escrit-rio-Pixel-A-Jornada-Office/

## A história
O vírus **Barão Bagunça** desformatou a Horizonte Distribuidora (empresa fictícia) às vésperas da entrega do Edital Simulado 001/2026. O aluno é a pessoa nova da equipe e precisa salvar documentos, planilhas, e-mails e slides.

## Fases
| Fase | Tema | Regiões |
|---|---|---|
| 1 • O Vale dos Documentos | Word + hard/soft skills + fontes confiáveis | Vila da Página, Torre dos Estilos, Praça das Competências |
| 2 • A Torre das Planilhas | Excel: revisão maior do básico, depois recursos novos (PROCV, gráficos, tabela, validação, tabela dinâmica, proteção, impressão) | Mercado das Contas, Cofre do Cifrão, Templo das Decisões, Observatório dos Recursos |
| 3 • O Porto do Correio | Outlook | Correio Central, Arquivo e Agenda |
| 4 • O Palco dos Slides | PowerPoint, IA, oratória e pitch | Palco dos Modos, Bastidores |
| 5 • Mestre Final: A Sala da Comissão | Revisão de todo o conteúdo + entrega do Edital | Arquivo dos Documentos, Cofre dos Números, Torre da Comunicação, Sala da Comissão |

- 42 batalhas, 210 perguntas. Cada resposta tem explicação: por que a certa está certa e por que cada errada está errada.
- Pergaminho (teoria curta) antes de cada batalha, 8 missões (com fórmulas e e-mails conferidos pelo jogo), 5 chefões em equipe.
- XP, níveis (Estagiário até Mestre do Office), vidas e selos. Som 8 bits gerado no navegador.
- Portões e fases abrem com códigos que o professor fala em aula.

## Salvamento
Cada vez que o aluno clica em **Salvar**, o jogo mostra um código para anotar e envia o progresso para a planilha Google do professor (`planilha/Codigo.gs`, Apps Script). A **Área do Professor** (tela inicial) baixa a planilha e mostra a turma, a nota sugerida, os critérios, o mapa de calor de erros, o CSV e os relatórios.

## Para editar
O conteúdo fica em `fonte/conteudo/` (perguntas em `qs1.py` a `qs5.py`; pergaminhos em `cards.py`; fases em `niveis.py`; missões e chefões em `miss.py`).

```
python3 fonte/conteudo/gerar_dados.py
./build.sh        # gera index.html
```

Arquivo único (`index.html`), sem instalação: também funciona abrindo o arquivo direto no computador.
