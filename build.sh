#!/bin/bash
# Monta o jogo (com a Área do Professor) em HTML único a partir de fonte/
cd "$(dirname "$0")"
INI='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
{ echo "$INI"; cat fonte/head.html; echo '</head><body>'; cat fonte/body.html; echo "<script>"; cat fonte/dados.js fonte/som.js fonte/rel.js fonte/codigo.js fonte/nuvem.js fonte/engine.js fonte/professor.js; echo "</script></body></html>"; } > Escritorio_Pixel.html
cp Escritorio_Pixel.html index.html
echo "ok: Escritorio_Pixel.html"
