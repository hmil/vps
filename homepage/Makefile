
all: www/style.css scene/node_modules www/scene.js

www/style.css: www/style.less
	lessc www/style.less www/style.css

scene/node_modules: scene/package.json
	cd scene && npm install

www/scene.js: $(wildcard scene/src/*.ts) $(wildcard scene/src/shades/*)
	cd scene && npm run dist
	