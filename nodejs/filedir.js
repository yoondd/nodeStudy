const fs = require('fs');
const testFolder = './data';

fs.readdir(testFolder, (err, list)=>{
    console.log(list);
});