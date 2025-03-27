const http = require('http');
const fs = require('fs');
const url = require('url'); // 요구하다. require // 나 이제 url모듈을 사용할거야. 

const app = http.createServer((request,response)=>{
    let _url = request.url;
    const queryData = url.parse(_url, true).query;

    let title = queryData.id;
    // console.log(queryData.id);
    if(_url == '/'){
      title = 'Welcome'; // 라우팅이 /으로 들어왔을때의 내용. 
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    const template = `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
        <h2>${title}</h2>
        <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
        <img src="coding.jpg" width="100%">
        </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
        </p>
      </body>
      </html>

    `;
    // console.log(__dirname+_url);
    // response.end(fs.readFileSync(__dirname + _url));
    response.end(template);

});
app.listen(3000);
