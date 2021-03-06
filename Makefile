
git_branch := $(shell git rev-parse --abbrev-ref HEAD)

.PHONY: install build tests

test:
	$(shell npm bin)/eslint src

install:
	npm install

build: install test
	mkdir -p dist

	$(shell npm bin)/rollup src/lumiere.js --output.format cjs --output.file dist/lumiere.js
	$(shell npm bin)/rollup src/lumiere.js --output.format umd --output.file dist/lumiere.umd.js -n lumiere
	$(shell npm bin)/uglifyjs dist/lumiere.umd.js -o dist/lumiere.min.js -c -m

	$(shell npm bin)/rollup src/detect-duration.js --output.format cjs --output.file dist/detect-duration.js
	$(shell npm bin)/rollup src/detect-duration.js --output.format umd --output.file dist/detect-duration.umd.js -n detectDuration
	$(shell npm bin)/uglifyjs dist/detect-duration.umd.js -o dist/detect-duration.min.js -c -m

npm.version: build
	git pull --tags
	git add dist
	npm version patch
	git push origin $(git_branch) && git push --tags

npm.publish: build
	cp package.json dist
	cp README.md dist
	cp LICENSE dist
	- cd dist && npm publish --access public
	- node -e "var fs = require('fs'); var pkg = require('./dist/package.json'); pkg.name = 'lumiere'; fs.writeFile('dist/package.json', JSON.stringify(pkg, null, '  '), 'utf8', function (err) { if( err ) console.log('Error: ' + err); });"
	- cd dist && npm publish
	rm dist/package.json
	rm dist/README.md
	rm dist/LICENSE

github.release: export PKG_VERSION=$(shell node -e "console.log('v'+require('./package.json').version);")
github.release: export RELEASE_URL=$(shell curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${GITHUB_TOKEN}" \
	-d '{"tag_name": "${PKG_VERSION}", "target_commitish": "$(git_branch)", "name": "${PKG_VERSION}", "body": "", "draft": false, "prerelease": false}' \
	-w '%{url_effective}' "https://api.github.com/repos/kiltjs/lumiere/releases" )
github.release:
	@echo ${RELEASE_URL}
	@true

release: test npm.version npm.publish github.release

.DEFAULT_GOAL := build
