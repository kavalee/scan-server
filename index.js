"use scrict"
const spawn = require('child_process').spawn;
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

const scanArgs = ["--format=jpeg" ];
const download_name = "unititled.jpeg"
const target = "/tmp/" + download_name;

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
	res.download(target);
    });
    scan.stderr.on('data', (err) =>{
	console.log(err);
	res.send(`<p>${err}</p>`);
    });
});

const port = process.env.PORT || 3000;
app.listen( port, () => console.log(`Listening on port ${port}`));

