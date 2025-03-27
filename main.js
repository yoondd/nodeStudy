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

    fs.readFile(`data/${queryData.id}`,'utf-8', (err, discription)=>{

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
        <p>${discription}</p>
      </body>
      </html>

      `;
      response.end(template);
    })

    
    // console.log(__dirname+_url);
    // response.end(fs.readFileSync(__dirname + _url));

});
app.listen(3000);
