const fs = require("fs"); // 파일시스템을 이제 다룰 수 있음

fs.readFile('sample.txt', 'utf-8', (err, data)=>{
    console.log(data);
});