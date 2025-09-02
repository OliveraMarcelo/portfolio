# Makefile para proyecto Vue.js - Urkupina Parking Dashboard
# Autor: EXO S.A.

# Variables
NODE_VERSION = 22.19

## Git: Switch a cuenta personal, hace deploy y vuelve a work
git-deploy-personal:
	@if [ -z "$(MSG)" ]; then \
		echo "$(RED)Error: Debes especificar un mensaje$(NC)"; \
		echo "$(YELLOW)Uso: make git-deploy-personal MSG='tu mensaje'$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)🔄 Cambiando a cuenta personal de GitHub...$(NC)"
	./switch_github.sh personal
	@echo "$(BLUE)🚀 Haciendo deploy con cuenta personal...$(NC)"
	@$(MAKE) git-add
	@$(MAKE) git-commit MSG="$(MSG)"
	@$(MAKE) git-push
	@echo "$(BLUE)🔄 Volviendo a cuenta de trabajo...$(NC)"
	./switch_github.sh work
	@echo "$(GREEN)✅ Deploy personal completado y cuenta restaurada!$(NC)"

## Git: Solo cambia a cuenta personal
git-switch-personal:
	@echo "$(BLUE)🔄 Cambiando a cuenta personal de GitHub...$(NC)"
	./switch_github.sh personal
	@echo "$(GREEN)✅ Cambiado a cuenta personal!$(NC)"

## Git: Vuelve a cuenta de trabajo
git-switch-work:
	@echo "$(BLUE)🔄 Cambiando a cuenta de trabajo...$(NC)"
	./switch_github.sh work
	@echo "$(GREEN)✅ Cambiado a cuenta de trabajo!$(NC)"

## Git: Workflow completo para proyectos personales
workflow-personal:
	@if [ -z "$(MSG)" ]; then \
		echo "$(RED)Error: Debes especificar un mensaje$(NC)"; \
		echo "$(YELLOW)Uso: make workflow-personal MSG='tu mensaje'$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)🔄 Ejecutando workflow personal completo...$(NC)"
	./switch_github.sh personal
	@$(MAKE) git-pull
	@$(MAKE) install
	@$(MAKE) lint-fix
	@$(MAKE) format
	@$(MAKE) test
	@$(MAKE) build
	@$(MAKE) git-add
	@$(MAKE) git-commit MSG="$(MSG)"
	@$(MAKE) git-push
	./switch_github.sh work
	@echo "$(GREEN)✅ Workflow personal completado!$(NC)"
PROJECT_NAME = portfolio
DOCKER_IMAGE = $(PROJECT_NAME)
DOCKER_TAG = latest

# Colores para output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

.PHONY: help setup dev build clean lint format test docker git-status git-push git-pull git-branch

# Comando por defecto
all: help

## Ayuda - Muestra todos los comandos disponibles
help:
	@echo "$(BLUE)========================================$(NC)"
	@echo "$(BLUE)  Portafolio$(NC)"
	@echo "$(BLUE)========================================$(NC)"
	@echo ""
	@echo "$(GREEN)Comandos de desarrollo:$(NC)"
	@echo "  $(YELLOW)setup$(NC)     - Configura el entorno (instala Node.js y dependencias)"
	@echo "  $(YELLOW)install$(NC)   - Instala dependencias del proyecto"
	@echo "  $(YELLOW)fix-sass$(NC)  - Corrige problemas de dependencias de Sass"
	@echo "  $(YELLOW)dev$(NC)       - Inicia servidor de desarrollo"
	@echo "  $(YELLOW)build$(NC)     - Compila para producción"
	@echo "  $(YELLOW)preview$(NC)   - Previsualiza build de producción"
	@echo ""
	@echo "$(GREEN)Comandos de calidad de código:$(NC)"
	@echo "  $(YELLOW)lint$(NC)      - Ejecuta ESLint"
	@echo "  $(YELLOW)lint-fix$(NC)  - Ejecuta ESLint y corrige errores automáticamente"
	@echo "  $(YELLOW)format$(NC)    - Formatea código con Prettier"
	@echo "  $(YELLOW)code-quality$(NC) - Ejecuta lint, lint-fix y format en secuencia"
	@echo "  $(YELLOW)test$(NC)      - Ejecuta tests"
	@echo ""
	@echo "$(GREEN)Comandos de Docker:$(NC)"
	@echo "  $(YELLOW)docker-build$(NC) - Construye imagen Docker"
	@echo "  $(YELLOW)docker-run$(NC)   - Ejecuta contenedor Docker"
	@echo "  $(YELLOW)docker-stop$(NC)  - Detiene contenedores Docker"
	@echo "  $(YELLOW)docker-clean$(NC) - Limpia imágenes y contenedores Docker"
	@echo ""
	@echo "$(GREEN)Comandos de Git:$(NC)"
	@echo "  $(YELLOW)git-status$(NC)   - Muestra estado del repositorio"
	@echo "  $(YELLOW)git-add$(NC)      - Añade todos los cambios al staging"
	@echo "  $(YELLOW)git-commit$(NC)   - Hace commit (usar: make git-commit MSG='mensaje')"
	@echo "  $(YELLOW)git-push$(NC)     - Sube cambios al repositorio remoto"
	@echo "  $(YELLOW)git-pull$(NC)     - Descarga cambios del repositorio remoto"
	@echo "  $(YELLOW)git-branch$(NC)   - Muestra ramas disponibles"
	@echo "  $(YELLOW)git-deploy$(NC)   - Deploy completo (add + commit + push)"
	@echo ""
	@echo "$(GREEN)Comandos de utilidad:$(NC)"
	@echo "  $(YELLOW)clean$(NC)     - Limpia archivos generados"
	@echo "  $(YELLOW)check-deps$(NC) - Verifica dependencias y vulnerabilidades"
	@echo "  $(YELLOW)update-deps$(NC) - Actualiza dependencias"
	@echo ""

## Configuración inicial del proyecto
setup:
	@echo "$(BLUE)🔧 Configurando entorno de desarrollo...$(NC)"
	@if ! command -v nvm &> /dev/null; then \
		echo "$(YELLOW)Instalando NVM...$(NC)"; \
		curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash; \
		export NVM_DIR="$$HOME/.nvm"; \
		[ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh"; \
	fi
	@echo "$(YELLOW)Instalando Node.js $(NODE_VERSION)...$(NC)"
	@export NVM_DIR="$$HOME/.nvm"; \
	[ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh"; \
	nvm install $(NODE_VERSION) && nvm use $(NODE_VERSION)
	@$(MAKE) install
	@echo "$(GREEN)✅ Configuración completada!$(NC)"

## Instala dependencias
install:
	@echo "$(BLUE)📦 Instalando dependencias...$(NC)"
	npm install
	@echo "$(GREEN)✅ Dependencias instaladas!$(NC)"

## Corrige problemas de dependencias de Sass
fix-sass:
	@echo "$(BLUE)🔧 Corrigiendo dependencias de Sass...$(NC)"
	npm uninstall node-sass 2>/dev/null || true
	npm install --save-dev sass
	@echo "$(GREEN)✅ Dependencias de Sass corregidas!$(NC)"

## Inicia servidor de desarrollo
dev:
	@echo "$(BLUE)🚀 Iniciando servidor de desarrollo...$(NC)"
	@echo "$(YELLOW)Servidor disponible en: http://localhost:8080$(NC)"
	npm run serve

## Compila para producción
build:
	@echo "$(BLUE)🏗️  Compilando para producción...$(NC)"
	npm run build
	@echo "$(GREEN)✅ Compilación completada! Archivos en /dist$(NC)"

## Previsualiza build de producción
preview: build
	@echo "$(BLUE)👀 Previsualizando build de producción...$(NC)"
	@if command -v python3 &> /dev/null; then \
		cd dist && python3 -m http.server 8080; \
	elif command -v python &> /dev/null; then \
		cd dist && python -m SimpleHTTPServer 8080; \
	else \
		echo "$(RED)Error: Python no está instalado$(NC)"; \
	fi

## Ejecuta linting
lint:
	@echo "$(BLUE)🔍 Ejecutando ESLint...$(NC)"
	npm run lint

## Ejecuta linting y corrige errores
lint-fix:
	@echo "$(BLUE)🔧 Ejecutando ESLint y corrigiendo errores...$(NC)"
	npm run lint:fix

## Formatea código
format:
	@echo "$(BLUE)💅 Formateando código con Prettier...$(NC)"
	npm run format

## Ejecuta linting, corrección y formato completo
code-quality: lint lint-fix format
	@echo "$(GREEN)✅ Calidad de código completada!$(NC)"

## Ejecuta tests
test:
	@echo "$(BLUE)🧪 Ejecutando tests...$(NC)"
	npm run test

## Verifica dependencias y vulnerabilidades
check-deps:
	@echo "$(BLUE)🔒 Verificando dependencias y vulnerabilidades...$(NC)"
	npm audit
	npm outdated

## Actualiza dependencias
update-deps:
	@echo "$(BLUE)⬆️  Actualizando dependencias...$(NC)"
	npm update
	npm audit fix

## Limpia archivos generados
clean:
	@echo "$(BLUE)🧹 Limpiando archivos generados...$(NC)"
	rm -rf dist/
	rm -rf node_modules/
	rm -rf .cache/
	npm cache clean --force
	@echo "$(GREEN)✅ Limpieza completada!$(NC)"

## Construye imagen Docker
docker-build:
	@echo "$(BLUE)🐳 Construyendo imagen Docker...$(NC)"
	sudo docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .
	@echo "$(GREEN)✅ Imagen Docker construida!$(NC)"

## Ejecuta contenedor Docker
docker-run:
	@echo "$(BLUE)🐳 Ejecutando contenedor Docker...$(NC)"
	sudo docker run -d -p 8080:80 --name $(PROJECT_NAME) $(DOCKER_IMAGE):$(DOCKER_TAG)
	@echo "$(GREEN)✅ Contenedor ejecutándose en http://localhost:8080$(NC)"

## Detiene contenedores Docker
docker-stop:
	@echo "$(BLUE)🐳 Deteniendo contenedores Docker...$(NC)"
	-docker stop $(PROJECT_NAME)
	-docker rm $(PROJECT_NAME)
	@echo "$(GREEN)✅ Contenedores detenidos!$(NC)"

## Limpia Docker
docker-clean: docker-stop
	@echo "$(BLUE)🐳 Limpiando imágenes Docker...$(NC)"
	-docker rmi $(DOCKER_IMAGE):$(DOCKER_TAG)
	-docker system prune -f
	@echo "$(GREEN)✅ Limpieza Docker completada!$(NC)"

## Git: Muestra estado del repositorio
git-status:
	@echo "$(BLUE)📊 Estado del repositorio:$(NC)"
	git status

## Git: Añade todos los cambios
git-add:
	@echo "$(BLUE)➕ Añadiendo cambios al staging...$(NC)"
	git add .
	@echo "$(GREEN)✅ Cambios añadidos!$(NC)"

## Git: Hace commit (usar: make git-commit MSG="mensaje")
git-commit:
	@if [ -z "$(MSG)" ]; then \
		echo "$(RED)Error: Debes especificar un mensaje$(NC)"; \
		echo "$(YELLOW)Uso: make git-commit MSG='tu mensaje'$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)💾 Haciendo commit...$(NC)"
	git commit -m "$(MSG)"
	@echo "$(GREEN)✅ Commit realizado!$(NC)"

## Git: Sube cambios al repositorio remoto
git-push:
	@echo "$(BLUE)⬆️  Subiendo cambios al repositorio remoto...$(NC)"
	git push origin $$(git branch --show-current)
	@echo "$(GREEN)✅ Cambios subidos!$(NC)"

## Git: Descarga cambios del repositorio remoto
git-pull:
	@echo "$(BLUE)⬇️  Descargando cambios del repositorio remoto...$(NC)"
	git pull origin $$(git branch --show-current)
	@echo "$(GREEN)✅ Cambios descargados!$(NC)"

## Git: Muestra ramas disponibles
git-branch:
	@echo "$(BLUE)🌿 Ramas disponibles:$(NC)"
	git branch -a

## Git: Deploy completo (add + commit + push)
git-deploy:
	@if [ -z "$(MSG)" ]; then \
		echo "$(RED)Error: Debes especificar un mensaje$(NC)"; \
		echo "$(YELLOW)Uso: make git-deploy MSG='tu mensaje'$(NC)"; \
		exit 1; \
	fi
	@$(MAKE) git-add
	@$(MAKE) git-commit MSG="$(MSG)"
	@$(MAKE) git-push
	@echo "$(GREEN)🚀 Deploy completado!$(NC)"

## Workflow completo de desarrollo
workflow:
	@echo "$(BLUE)🔄 Ejecutando workflow completo...$(NC)"
	@$(MAKE) git-pull
	@$(MAKE) install
	@$(MAKE) lint-fix
	@$(MAKE) format
	@$(MAKE) test
	@$(MAKE) build
	@echo "$(GREEN)✅ Workflow completado!$(NC)"
