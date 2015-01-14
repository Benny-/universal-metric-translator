
all: universal-metric-translator.user.js universal-metric-translator.meta.js
	

universal-metric-translator.meta.js:
	cat "./src/browser/userscript.js" > "universal-metric-translator.meta.js"

universal-metric-translator.user.js: src/browser/userscript.js src/universal-metric-translator.js src/browser/dom_functions.js
	cat "./src/browser/userscript.js" "./src/universal-metric-translator.js" "./src/browser/dom_functions.js" > "universal-metric-translator.user.js"

