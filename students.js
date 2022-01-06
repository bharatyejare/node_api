const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mysql = require("mysql");
const querystring = require('querystring');
const path = require('path');
const db=require('./database');

app.get('/students/:id/', function(req, res) {
    var sql='SELECT * FROM students where id='+req.params['id'];
    db.query(sql, function (err, response) {
    if (err) throw err;
       res.send(JSON.stringify({data:response}));
  });
});

app.set("views", path.join(__dirname));
app.set("view engine", "ejs");
app.get("/students", function(req, res){ 
    var resultStatus = req.query.resultStatus;
    var sql='SELECT * FROM students where result_status="'+resultStatus+'"';
    db.query(sql, function (err, response) {
    if (err) throw err;
       res.send(JSON.stringify({data:response}));
  });
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))