.PHONY: help
help: ## show make targets
	@node -e "const fs = require('fs'); const lines = fs.readFileSync('$(firstword $(MAKEFILE_LIST))', 'utf8').split(/\r?\n/); for (const line of lines) { const match = line.match(/^([a-zA-Z_-]+):.*?## (.*)$$/); if (match) console.log(' ' + match[1].padEnd(20) + '  ' + match[2]); }"

.PHONY: install build test

install:  ## install project dependencies from the lockfile
	pnpm install --frozen-lockfile

build: ## build the project
	pnpm build

test: ## run tests
	pnpm test
