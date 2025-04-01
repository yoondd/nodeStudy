const http = require('http');
const fs = require('fs');
const url = require('url'); // 요구하다. require // 나 이제 url모듈을 사용할거야. 
const qs = require('querystring');

// const args = process.argv;
// console.log(args);

const templateHTML = (title, list, body, control) => {
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
}
const templateList = (filelist) => {
  let list = `<ul>`;
  let i = 0;
  while(i < filelist.length){
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list += `</ul>`;

  return list;
}

const app = http.createServer((request,response)=>{
    let _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    let title = queryData.id;
    let des = null;
    let template = null;
    if(pathname === '/'){
      if(queryData.id === undefined){
       
          fs.readdir('./data', (err, filelist)=>{
            console.log(filelist);
            title = 'Welcome';
            des = 'Hello, Node.js'; 
            //파일리스트 출력하기 
            list = templateList(filelist);
            template = templateHTML(title, list, 
              `<h2>✅${title}</h2>${des}`,
              `<a href="/create">Create</a>`
            );
            response.writeHead(200);
            response.end(template);
          });
      }else{

        fs.readdir('./data', (err, filelist)=>{
          fs.readFile(`data/${queryData.id}`,'utf-8', (err, description)=>{
            title = queryData.id;
            des = description;
            list = templateList(filelist);
            template = templateHTML(title, list, 
              `<h2>✅${title}</h2>${des}`,
              `<a href="/create">Create</a>
              <a href="/update?id=${title}">Update</a>
              <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="Delete">
              </form>`
            );
            response.writeHead(200);
            response.end(template);
        });
      });
    }

    } else if(pathname === '/create'){
      fs.readdir('./data', (err, filelist)=>{
        console.log(filelist);
        title = 'create';
        //파일리스트 출력하기 
        list = templateList(filelist);
        template = templateHTML(title, list, `
          
          <form action="/create_process" method="post">
            <div><input type="text" name="title" placeholder="title"></div>
            <div><textarea name="description" placeholder="description"></textarea></div>
            <div><input type="submit"></div>
          </form>
          
          `,``);
        response.writeHead(200);
        response.end(template);
      }); 
    } else if(pathname==="/create_process"){

      let body = "";
      request.on('data', (data)=>{
        //엄청 많이 들어올 것을 대비해서 조각조각 정보를 담는다.
        body += data;
      });
      request.on('end',()=>{
        //더이상 들어올 정보가 없다면,
        const post = qs.parse(body); //모든 정보 객체화.
        console.log(post);
        const bodyTitle = post.title;
        const bodyDescription = post.description;
        fs.writeFile(`data/${bodyTitle}`, bodyDescription, 'utf8', (err)=>{
        
          response.writeHead(302,{Location:`/?id=${bodyTitle}`});
          response.end();
        })
      });
    } else if(pathname === "/update"){
      
      fs.readdir('./data', (err, filelist)=>{
        fs.readFile(`data/${queryData.id}`,'utf-8', (err, description)=>{
          title = queryData.id;
          des = description;
          list = templateList(filelist);
          template = templateHTML(title, list, 
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
          response.end(template);
        });
      });

    } else if(pathname==="/update_process"){

      let body = "";
      request.on('data', (data)=>{
        //엄청 많이 들어올 것을 대비해서 조각조각 정보를 담는다.
        body += data;
      });
      request.on('end',()=>{
        //더이상 들어올 정보가 없다면,
        const post = qs.parse(body); //모든 정보 객체화.
        console.log(post);
        const bodyId = post.id;
        const bodyTitle = post.title;
        const bodyDescription = post.description;
        console.log(post);
        fs.rename(`data/${bodyId}`,`data/${bodyTitle}`,(err)=>{
          fs.writeFile(`data/${bodyTitle}`, bodyDescription, 'utf8', (err)=>{
            response.writeHead(302,{Location:`/?id=${bodyTitle}`});
            response.end();
          })
        })
        
      });

    } else if(pathname === "/delete_process"){

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

    }else {
      response.writeHead(404);
      response.end('Not Found');
    }


    console.log(url.parse(_url, true).pathname);    


    
    
    
    // console.log(__dirname+_url);
    // response.end(fs.readFileSync(__dirname + _url));
    
});
app.listen(3000);
