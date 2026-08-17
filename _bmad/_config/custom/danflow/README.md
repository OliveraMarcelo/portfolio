# DanFlow — módulo propio

Método propio basado en **BMAD v6.0.4**, especializado en:
- Arquitectura de **microservicios event-driven** (Go + NATS: EDA + Outbox + CQRS-ish, multitenancy por RLS).
- Diseño **UI de alta fidelidad** con Open Design (open-design.ai).

Convive junto a `core` y `bmm` sin modificarlos (upgrade-safe).

## Convención de nombres

- **Prefijo de agentes**: `dan-` (namespace personal).
- Agentes: `dan-ui-designer`, y a futuro `dan-analyst`, `dan-architect`, `dan-ux-designer`, `dan-sm`, `dan-dev`, `dan-qa`, `dan-master`.
- Agentes especializados previstos: `dan-event-storm` (event storming con zonas NATS), `dan-svc-scaffold` (scaffold del patrón `cmd/` + `internal/`).

## Estructura

```
src/danflow/
├── module.yaml          # definición del módulo (code: danflow)
├── module-help.csv      # registro de comandos/workflows
├── agents/
│   └── dan-ui-designer.agent.yaml   # agente "Luna" (UI + Open Design)
├── workflows/
│   └── create-ui-from-ux/
│       ├── workflow.md              # UX spec → pantallas de alta fidelidad
│       └── scripts/od.sh            # helper CLI de Open Design (polling fuera del contexto)
└── data/
```

## Estado

- ✅ `dan-ui-designer` (Luna) portado y generalizado desde hotel-website.
- ✅ Workflow `create-ui-from-ux` portado y generalizado (cualquier proyecto, no solo hoteles).
- ✅ Endurecido con lo aprendido en campo (portfolio, 2026-08): **contrato técnico de salida**
  obligatorio en cada prompt (§3.1b), **checklist de verificación** post-run que decide por el
  archivo y no por el `status` (§4.2b y §4.3b), y tabla de **lecciones de campo**.
- ⬜ Pendiente: el resto de agentes del ciclo (`dan-analyst`, `dan-architect`, `dan-ux-designer`, `dan-sm`, `dan-dev`, `dan-qa`, `dan-master`).

## Notas legales

Basado en BMAD-METHOD (MIT, © BMad Code, LLC) — código reutilizable. La **marca** "BMAD"
es de BMad Code, LLC: este método propio usa el nombre **DanFlow**, no la marca BMAD.
