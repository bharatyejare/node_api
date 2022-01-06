const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
const multer = require('multer');
const path = require('path');
const db=require('./database');

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
        callBack(null, './uploads/')    
  },
  filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }

})
 
var upload = multer({
    storage: storage
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single("uploadfile"), (req, res) =>{
  if(path.extname(req.file.filename)==='.csv'){
    UploadCsvDataToMySQL(__dirname + '/uploads/' + req.file.filename);
    res.send("File Uploaded Successfully");
  }else{
    fs.unlinkSync(__dirname + '/uploads/' + req.file.filename);
    res.send("Please upload CSV format file");
  }
    
});

function UploadCsvDataToMySQL(filePath){
  let stream = fs.createReadStream(filePath);
  let csvData = [];
  let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
      csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();
    csvData.forEach(element => {
    if(element[2]>35 && element[3]>35 && element[4]>35) {
      var result_status='passed';
      element.push(result_status);
    }else{
      var result_status='failed';
      element.push(result_status);
    }
    });
  let query =
      "INSERT INTO students (name, age, mark_one,mark_two,mark_three,result_status) VALUES ?";
      db.query(query, [csvData], (error, response) => {
      console.log(error || response);
      fs.unlinkSync(filePath);
    });
 
  });
  stream.pipe(csvStream); 
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))