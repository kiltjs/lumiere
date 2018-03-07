
.PHONY: install build

test:
	$(shell npm bin)/eslint src

install:
	npm install

build: install test
	mkdir -p dist

	$(shell npm bin)/rollup src/lumiere.js --format cjs --output dist/lumiere.js
	$(shell npm bin)/rollup src/lumiere.js --format umd --output dist/lumiere.umd.js -n lumiere
	$(shell npm bin)/uglifyjs dist/lumiere.umd.js -o dist/lumiere.min.js -c -m

	$(shell npm bin)/rollup src/detect-duration.js --format cjs --output dist/detect-duration.js
	$(shell npm bin)/rollup src/detect-duration.js --format umd --output dist/detect-duration.umd.js -n detectDuration
	$(shell npm bin)/uglifyjs dist/detect-duration.umd.js -o dist/detect-duration.min.js -c -m

	cp package.json dist/package.json
	cp README.md dist/README.md

publish: build
	cd dist; npm publish

.DEFAULT_GOAL := build
