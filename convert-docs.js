'use strict';
/**
 (convert-docs:File)<-[:MADE {on: 12/11/2017}]-(Stefan:Coder)
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const file_out = path.join(__dirname, 'public', 'html', 'docs.html');

const showdown = require('showdown');
const converter = new showdown.Converter();
converter.setFlavor('github');

(async () => {

  // 16.1.0 docs
  // const md = await fetch('https://raw.githubusercontent.com/hapijs/joi/7164e00a338b9b8ec4493e5446987d821c74f5d6/API.md').then(x => x.text());
  const md = await fetch('https://raw.githubusercontent.com/hapijs/joi/master/API.md').then(x => x.text());

  // const md = await fetch('https://raw.githubusercontent.com/legraphista/joi/master/API.md').then(x => x.text());

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Docs</title>
    <style>
      .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;
      }
    
      @media (max-width: 767px) {
        .markdown-body {
          padding: 15px;
        }
      }
    </style>
    <link rel="stylesheet" type="text/css" href="../../lib/gh.css">
</head>
<body>
    <article class="markdown-body">
        ${converter.makeHtml(md)}
    </article>
</body>
</html>
  `;

  fs.writeFileSync(file_out, html);
})();