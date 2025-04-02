const http = require('http');
const fs = require('fs');
const url = require('url'); // 요구하다. require // 나 이제 url모듈을 사용할거야. 
const qs = require('querystring');

// const args = process.argv;
// console.log(args);


//refactoring 코드개선 
const template = {
  html: (title, list, body, control) => {
    return `
              <!doctype html>
              <html>
                <head>
                  <title>WEB - ${title}</title>
                  <meta charset="utf-8">
                </head>
                <body>
                  <h1><a href="/">WEB</a></h1>
                  ${list}
                  ${control}
                  ${body}
                </body>
              </html>
              
              `;
  },
  list: (filelist) => {
    let listHtml = `<ul>`;
    let i = 0;
    while(i < filelist.length){
      listHtml += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i++;
    }
    listHtml += `</ul>`;
  
    return listHtml;
  }
}


const app = http.createServer((request,response)=>{
    let _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    let title = queryData.id;
    let des = null;
    let html = null;
    let list = null;
    if(pathname === '/'){
      if(queryData.id === undefined){
          //루트경로로 진입했을 때
          fs.readdir('./data', (err, filelist)=>{
            title = 'Welcome';
            des = 'Hello, Node.js'; 
            //파일리스트 출력하기 
            list = template.list(filelist);
            html = template.html(title, list, 
              `<h2>✅${title}</h2>${des}`,
              `<a href="/create">Create</a>`
            );
            response.writeHead(200);
            response.end(html);
          });
          //루트경로로 진입했을 때 끝.
      }else{
        //루트경로인데 아이디를 가지고있을때, 예, /?id=css
        fs.readdir('./data', (err, filelist)=>{
          fs.readFile(`data/${queryData.id}`,'utf-8', (err, description)=>{
            title = queryData.id;
            des = description;
            list = template.list(filelist);
            html = template.html(title, list, 
              `<h2>✅${title}</h2>${des}`,
              `<a href="/create">Create</a>
              <a href="/update?id=${title}">Update</a>
              <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="Delete">
              </form>`
            );
            response.writeHead(200);
            response.end(html);
        });
        //루트경로인데 아이디를 가지고 있을 때 끝.
      });
    }

    } else if(pathname === '/create'){
      //새 글 쓰기 페이지
      fs.readdir('./data', (err, filelist)=>{
        title = 'create';
        //파일리스트 출력하기 
        list = template.list(filelist);
        html = template.html(title, list, `
          <form action="/create_process" method="post">
            <div><input type="text" name="title" placeholder="title"></div>
            <div><textarea name="description" placeholder="description"></textarea></div>
            <div><input type="submit"></div>
          </form>
          `,``);
        response.writeHead(200);
        response.end(html);
        //새 글 쓰기 페이지 끝.
      }); 
    } else if(pathname==="/create_process"){
      //새글 쓰기에서 submit을 눌렀을 때의 상황.
      let body = "";
      request.on('data', (data)=>{
        //엄청 많이 들어올 것을 대비해서 조각조각 정보를 담는다.
        body += data;
      });
      request.on('end',()=>{
        //더이상 들어올 정보가 없다면,
        const post = qs.parse(body); //모든 정보 객체화.
        const bodyTitle = post.title;
        const bodyDescription = post.description;
        fs.writeFile(`data/${bodyTitle}`, bodyDescription, 'utf8', (err)=>{
          response.writeHead(302,{Location:`/?id=${bodyTitle}`});
          response.end();
        })
      });
      //새글 쓰기에서 submit을 눌렀을 때. 끝.
    } else if(pathname === "/update"){
      //수정하기 페이지
      fs.readdir('./data', (err, filelist)=>{
        fs.readFile(`data/${queryData.id}`,'utf-8', (err, description)=>{
          title = queryData.id;
          des = description;
          list = template.list(filelist);
          html = template.html(title, list, 
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <div><input type="text" name="title" placeholder="title" value="${title}"></div>
              <div><textarea name="description" placeholder="description">${des}</textarea></div>
              <div><input type="submit"></div>
            </form> 
            `,
            `<a href="/create">Create</a>
            <a href="/update?id=${title}">Update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
        //수정하기 페이지 끝.
      });

    } else if(pathname==="/update_process"){
      // 수정하기에서 submit을 눌렀을 때의 상황.
      let body = "";
      request.on('data', (data)=>{
        //엄청 많이 들어올 것을 대비해서 조각조각 정보를 담는다.
        body += data;
      });
      request.on('end',()=>{
        //더이상 들어올 정보가 없다면,
        const post = qs.parse(body); //모든 정보 객체화.
        const bodyId = post.id;
        const bodyTitle = post.title;
        const bodyDescription = post.description;
        fs.rename(`data/${bodyId}`,`data/${bodyTitle}`,(err)=>{
          fs.writeFile(`data/${bodyTitle}`, bodyDescription, 'utf8', (err)=>{
            response.writeHead(302,{Location:`/?id=${bodyTitle}`});
            response.end();
          })
        })
        
      });
      //수정하기에서 submit을 눌렀을 때의 상황 끝.

    } else if(pathname === "/delete_process"){

      //어떤 페이지에서 delete로 진입했을 때를 post로 작성해서 가져옴. 
      //여기서 get방식으로 가져오지않은이유는 이 링크를 누군가가 어디로 붙여넣기했을때 삭제될 수 도 있으니까!!! 너무위험하다
      let body = "";
      request.on('data', (data)=>{
        body += data;
      });
      request.on('end',()=>{
        const post = qs.parse(body); //모든 정보 객체화.
        const bodyId = post.id;
        
        fs.unlink(`data/${bodyId}`, (err)=>{
          response.writeHead(302,{Location:`/`});
          response.end(); 
        })
        
      });
      // delete눌렀을때의 상황 끝.

    }else {
      response.writeHead(404);
      response.end('Not Found');
    }

    
});
app.listen(3000);
