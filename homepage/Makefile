
all: www/style.css app

www/style.css: src/style.less
	yarn lessc src/style.less www/style.css

.PHONY: app
app:
	rm -f www/bundle-*.json
	yarn build