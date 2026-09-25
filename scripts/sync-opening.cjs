// Keep the opener's first-paint HTML in sync with its readable source files.
const fs=require('node:fs');
const file='public/paper/index.html';let html=fs.readFileSync(file,'utf8');
const css=fs.readFileSync('public/paper/opening.css','utf8');
const js=fs.readFileSync('public/paper/opening.js','utf8');
html=html.replace(/<link rel="stylesheet" href="\/paper\/opening.css">/,'').replace(/<script defer src="\/paper\/opening.js"><\/script>/,'');
html=html.replace(/<style id="opening-critical">[\s\S]*?<\/style>/,'').replace(/<script id="opening-bootstrap">[\s\S]*?<\/script>/,'');
html=html.replace('</head>','<style id="opening-critical">'+css+'</style></head>');
html=html.replace('<body>','<body><script id="opening-bootstrap">'+js+'</script>');
fs.writeFileSync(file,html);
