#!/usr/bin/env bash
# ============================================================================
# od.sh — Helper CLI para Open Design (open-design.ai)
#
# Orquesta el pipeline de generación de UI de Open Design de forma
# PROGRAMÁTICA y EFICIENTE EN TOKENS: el loop de polling (5–30 min) corre
# DENTRO de este script en una sola invocación bash, NO en el contexto del
# agente. Open Design lanza su propio agente (claude BYOK) para diseñar.
#
# Subcomandos:
#   od.sh doctor                         → verifica daemon vivo + descubre puerto
#   od.sh systems [filtro]               → lista design systems disponibles
#   od.sh skills [filtro]                → lista skills de Open Design
#   od.sh agents                         → lista agentes instalados para el run
#   od.sh new <projId> <nombre> [ds] [skill]  → crea proyecto
#   od.sh run <projId> <promptFile> [skill] [agent] [model] → lanza + espera + reporta
#   od.sh pull <projId> <destDir>        → copia los archivos generados al destino
#   od.sh preview <projId>               → imprime la previewUrl del navegador
#
# Uso típico (todo el flujo):
#   ./od.sh new miapp-home "MiApp Home" [designSystemId] [skillId]
#   ./od.sh run miapp-home /ruta/prompt.md frontend-skill claude
#   ./od.sh pull miapp-home ./public/ui-generated/home
#   ./od.sh preview miapp-home
#
# Variables de entorno:
#   OD_ROOT           checkout de open-design      (default: ~/repositorios/open-design)
#   OD_DAEMON_URL     URL explícita del daemon     (default: autodescubrimiento)
#   OD_POLL_INTERVAL  segundos entre polls         (default: 45)
#   OD_MAX_WAIT       tope de espera en segundos   (default: 2400)
# ============================================================================

set -euo pipefail

OD_ROOT="${OD_ROOT:-$HOME/repositorios/open-design}"
OD_BIN="$OD_ROOT/apps/daemon/bin/od.mjs"
POLL_INTERVAL="${OD_POLL_INTERVAL:-45}"   # segundos entre polls
MAX_WAIT="${OD_MAX_WAIT:-2400}"           # tope de espera: 40 min

# ── Descubrir la URL del daemon (puerto efímero) ────────────────────────────
discover_daemon() {
  # 1) variable de entorno explícita
  if [ -n "${OD_DAEMON_URL:-}" ]; then echo "$OD_DAEMON_URL"; return 0; fi
  # 2) del log del daemon
  local log="$OD_ROOT/.tmp/tools-dev/default/logs/daemon/latest.log"
  if [ -f "$log" ]; then
    local url
    url=$(grep -oE "http://127\.0\.0\.1:[0-9]+" "$log" | tail -1 || true)
    if [ -n "$url" ] && curl -s -o /dev/null -w "%{http_code}" "$url/api/daemon/status" 2>/dev/null | grep -q 200; then
      echo "$url"; return 0
    fi
  fi
  # 3) escaneo de puertos comunes
  for port in 7456 33289 45821; do
    if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$port/api/daemon/status" 2>/dev/null | grep -q 200; then
      echo "http://127.0.0.1:$port"; return 0
    fi
  done
  echo "ERROR: no se encontró un daemon de Open Design corriendo." >&2
  echo "Arrancalo con: cd $OD_ROOT && corepack pnpm exec tools-dev start web" >&2
  return 1
}

# El daemon se descubre de forma perezosa: `pull` trabaja solo sobre el
# filesystem y debe funcionar aunque el daemon se haya caído después del run.
DAEMON=""
ensure_daemon() { [ -n "$DAEMON" ] || DAEMON="$(discover_daemon)"; }
api() { ensure_daemon; curl -s "$DAEMON$1"; }
api_post() { ensure_daemon; curl -s -X POST "$DAEMON$1" -H "Content-Type: application/json" -d "$2"; }

# ── Subcomandos ─────────────────────────────────────────────────────────────
cmd_doctor() {
  ensure_daemon
  echo "Daemon: $DAEMON"
  api "/api/daemon/status" | python3 -c "import json,sys; d=json.load(sys.stdin); print('Estado:', d.get('status','?'))" 2>/dev/null || echo "sin respuesta"
  api "/api/agents" | python3 -c "import json,sys; d=json.load(sys.stdin); items=d if isinstance(d,list) else d.get('agents',[]); avail=[a['id'] for a in items if a.get('available')]; print('Agentes instalados:', avail)" 2>/dev/null || true
}

cmd_systems() {
  local filtro="${1:-}"
  api "/api/design-systems" | python3 -c "
import json,sys
d=json.load(sys.stdin); items=d if isinstance(d,list) else d.get('items',d.get('designSystems',[]))
f='$filtro'.lower()
for s in items:
    sid=s.get('id',''); name=s.get('name',s.get('title',''))
    if not f or f in sid.lower() or f in name.lower():
        print(f\"{sid:40s} {name}\")
" 2>/dev/null
}

cmd_skills() {
  local filtro="${1:-}"
  api "/api/skills" | python3 -c "
import json,sys
d=json.load(sys.stdin); items=d if isinstance(d,list) else d.get('items',d.get('skills',[]))
f='$filtro'.lower()
for s in items:
    sid=s.get('id',''); name=s.get('name',s.get('title','')); desc=(s.get('description','') or '')[:60]
    if not f or f in sid.lower() or f in name.lower():
        print(f\"{sid:40s} {name:30s} {desc}\")
" 2>/dev/null
}

cmd_agents() {
  api "/api/agents" | python3 -c "
import json,sys
d=json.load(sys.stdin); items=d if isinstance(d,list) else d.get('agents',[])
for a in items:
    mark='✓' if a.get('available') else '·'
    print(f\"{mark} {a.get('id',''):20s} {a.get('name','')}\")
" 2>/dev/null
}

cmd_new() {
  local pid="$1" name="$2" ds="${3:-}" skill="${4:-}"
  local body="{\"id\":\"$pid\",\"name\":\"$name\",\"skipDiscoveryBrief\":true"
  [ -n "$ds" ]    && body="$body,\"designSystemId\":\"$ds\""
  [ -n "$skill" ] && body="$body,\"skillId\":\"$skill\""
  body="$body}"
  api_post "/api/projects" "$body" | python3 -c "
import json,sys
d=json.load(sys.stdin); p=d.get('project',d)
print('Proyecto creado:', p.get('id'), '|', p.get('name'))
print('resolvedDir:', p.get('metadata',{}).get('resolvedDir', '$OD_ROOT/.od/projects/'+p.get('id','')))
" 2>/dev/null
}

cmd_run() {
  local pid="$1" prompt_file="$2" skill="${3:-}" agent="${4:-claude}" model="${5:-}"
  [ -f "$prompt_file" ] || { echo "ERROR: no existe $prompt_file" >&2; return 1; }
  local prompt; prompt="$(cat "$prompt_file")"

  # Construir body con json seguro via python
  local body
  body=$(python3 -c "
import json,sys
b={'projectId':'$pid','message':sys.stdin.read(),'agentId':'$agent'}
if '$skill': b['skillId']='$skill'
if '$model': b['model']='$model'
print(json.dumps(b))
" <<< "$prompt")

  echo "▶ Lanzando run en proyecto '$pid' (agente: $agent${skill:+, skill: $skill})..."
  local resp; resp=$(api_post "/api/runs" "$body")
  local run_id; run_id=$(echo "$resp" | python3 -c "import json,sys; print(json.load(sys.stdin).get('runId',''))" 2>/dev/null)
  [ -n "$run_id" ] || { echo "ERROR: no se obtuvo runId. Respuesta:" >&2; echo "$resp" >&2; return 1; }
  echo "  runId: $run_id"

  # ── POLLING DENTRO DEL SCRIPT (no gasta tokens del agente) ────────────────
  local elapsed=0 status=""
  while [ "$elapsed" -lt "$MAX_WAIT" ]; do
    sleep "$POLL_INTERVAL"; elapsed=$((elapsed + POLL_INTERVAL))
    status=$(api "/api/runs/$run_id" | python3 -c "import json,sys; print(json.load(sys.stdin).get('status',''))" 2>/dev/null || echo "")
    printf "  [%4ds] status: %s\n" "$elapsed" "$status"
    case "$status" in
      succeeded) echo "✅ Run completado."; break ;;
      failed|canceled) echo "❌ Run terminó en estado: $status" >&2; return 1 ;;
    esac
  done
  [ "$status" = "succeeded" ] || { echo "⏱ Timeout tras ${MAX_WAIT}s (status: $status)" >&2; return 1; }

  # Reportar previewUrl
  cmd_preview "$pid"
}

# Detecta el archivo HTML de entrada escaneando el resolvedDir
# (ignora dotfiles/dirs internos de Open Design: .file-versions, .od-skills)
find_entry() {
  local dir="$1"
  # Preferir index.html; si no, el .html más reciente en la raíz del proyecto
  if [ -f "$dir/index.html" ]; then echo "index.html"; return; fi
  find "$dir" -maxdepth 1 -name "*.html" -type f 2>/dev/null \
    | xargs -r ls -t 2>/dev/null | head -1 | xargs -r basename
}

cmd_preview() {
  local pid="$1"
  local dir="$OD_ROOT/.od/projects/$pid"
  local entry; entry="$(find_entry "$dir")"
  # El daemon puede haberse caído tras el run: la previewUrl es opcional,
  # la ruta en disco no.
  DAEMON="${DAEMON:-$(discover_daemon 2>/dev/null || true)}"
  if [ -n "$entry" ]; then
    if [ -n "$DAEMON" ]; then
      echo "🔗 Preview: $DAEMON/api/projects/$pid/raw/$entry"
    else
      echo "⚠ Daemon caído — sin previewUrl. Los archivos están igual en disco."
    fi
    echo "📄 Entry file: $entry"
  else
    echo "⚠ No se encontró HTML de entrada en $dir (¿el run generó archivos?)"
  fi
  echo "📁 Archivos en: $dir"
}

cmd_pull() {
  local pid="$1" dest="$2"
  local src="$OD_ROOT/.od/projects/$pid"
  [ -d "$src" ] || { echo "ERROR: no existe $src (¿el run generó archivos?)" >&2; return 1; }
  mkdir -p "$dest"
  # Resolver dest a ruta ABSOLUTA antes del cd (si no, el subshell lo resuelve
  # respecto a $src y no copia nada al lugar correcto)
  local abs_dest; abs_dest="$(cd "$dest" && pwd)"
  # Copiar solo los archivos útiles: excluir los internos de Open Design
  # (.file-versions = historial, .od-skills = copia del skill, *.artifact.json = metadata,
  #  .playwright-mcp = logs/capturas de la auto-verificación del agente interno,
  #  check-*.png = capturas que el agente saca para revisar su propio trabajo)
  ( cd "$src" && find . -maxdepth 3 -type f \
      ! -path "./.file-versions/*" \
      ! -path "./.od-skills/*" \
      ! -path "./.playwright-mcp/*" \
      ! -path "./.qa/*" \
      ! -name "check-*.png" \
      ! -name "qa-*.png" \
      ! -name "*-390.png" ! -name "*-768.png" ! -name "*-1280.png" ! -name "*-1920.png" \
      ! -name "*.artifact.json" \
      -print0 2>/dev/null | while IFS= read -r -d '' f; do
        mkdir -p "$abs_dest/$(dirname "$f")"
        cp "$f" "$abs_dest/$f"
      done )
  echo "📦 Copiados los archivos útiles de '$pid' → $dest"
  find "$dest" -type f | head -20
}

# ── Router ──────────────────────────────────────────────────────────────────
sub="${1:-doctor}"; shift || true
case "$sub" in
  doctor)  cmd_doctor "$@" ;;
  systems) cmd_systems "$@" ;;
  skills)  cmd_skills "$@" ;;
  agents)  cmd_agents "$@" ;;
  new)     cmd_new "$@" ;;
  run)     cmd_run "$@" ;;
  pull)    cmd_pull "$@" ;;
  preview) cmd_preview "$@" ;;
  *) echo "Subcomando desconocido: $sub" >&2; exit 1 ;;
esac
