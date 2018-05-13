"use scrict"
const spawn = require('child_process').spawn;
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const target = __dirname + "/untitled.jpeg";
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));
const scanArgs = ["--format=jpeg" ];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/submit', (req, res) => {
    console.log("submitted");
    let scanArgsRes = scanArgs;
    scanArgsRes.push(`--resolution=${req.query.res}`);
    scanArgsRes.push(`--mode=${req.query.mode}`);
    console.log(scanArgsRes);
    var s = fs.createWriteStream(target);
    var scan = spawn('scanimage', scanArgsRes);
    scan.stdout.on('data', (data) => {
	s.write(data);
	console.log("scanning!");
    });
    scan.stdout.on('end', () => {
	res.download('untitled.jpeg');
	//res.redirect('/download');
    });
    scan.stderr.on('data', (err) =>{
	console.log(err);
	res.send(`<p>${err}</p>`);
    });
});
app.get('/download', (req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename=unititled.jpeg');
    res.end();
    //res.download(target);
    console.log("file downloaded!");
    //res.end();
});

const port = process.env.PORT || 3000;
app.listen( port, () => console.log(`Listening on port ${port}`));

