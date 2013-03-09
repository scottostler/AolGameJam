set "ver=0.0.0"
md minified\js
md minified\js\game
md minified\js\lib
md minified\js\slb
copy /b js\game\main.js+js\game\ui\LoadingScreen.js+js\game\ui\MainMenu.js+js\game\ui\PauseScreen.js+js\game\ui\GameOver.js js\game\game-debug.js
java -jar yuicompressor-2.4.7.jar --charset utf-8 -o minified\js\game\game-min-%ver%.js js\game\game-debug.js
java -jar yuicompressor-2.4.7.jar --charset utf-8 -o minified\js\game.js js\game.js
xcopy font minified\font /e /y
xcopy audio minified\audio /e /y
xcopy images minified\images /e /y
xcopy audio minified\assets-%ver%\audio /e /y
xcopy images minified\assets-%ver%\images /e /y
xcopy icons minified\icons /e /y
xcopy banners minified\banners /e /y
xcopy screenshots minified\screenshots /e /y
copy js\lib\head.min.js minified\js\lib
copy apple-touch-icon.png minified
copy cache.manifest minified
copy channel.html minified
copy favicon.ico minified
copy index.html minified\index.html
copy style.css minified
copy web-image.jpg minified