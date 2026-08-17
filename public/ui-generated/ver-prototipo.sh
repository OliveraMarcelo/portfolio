#!/usr/bin/env bash
# ============================================================
# Abre el prototipo servido por HTTP, que es como conviene verlo.
#
# Abrirlo con doble clic (file://) funciona, pero cada archivo es un
# origen distinto para el navegador: el tema y el idioma viajan por la
# URL y las transiciones entre pantallas quedan desactivadas.
# Servido por HTTP anda todo.
#
#   ./ver-prototipo.sh          # puerto 8899
#   ./ver-prototipo.sh 9000     # otro puerto
# ============================================================
set -euo pipefail

PUERTO="${1:-8899}"
AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC="$(dirname "$AQUI")"
URL="http://127.0.0.1:$PUERTO/ui-generated/home/index.html"

if curl -s -o /dev/null --max-time 1 "http://127.0.0.1:$PUERTO/" 2>/dev/null; then
  echo "Ya hay algo sirviendo en $PUERTO — se reutiliza."
else
  echo "Sirviendo $PUBLIC en el puerto $PUERTO..."
  (cd "$PUBLIC" && python3 -m http.server "$PUERTO" >/dev/null 2>&1 &)
  sleep 1.5
fi

echo "Prototipo: $URL"
for nav in xdg-open google-chrome firefox; do
  if command -v "$nav" >/dev/null 2>&1; then
    "$nav" "$URL" >/dev/null 2>&1 &
    break
  fi
done

echo
echo "Para detener el servidor:  pkill -f 'http.server $PUERTO'"
