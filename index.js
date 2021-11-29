const express = require("express")
const fs = require("fs");
const https = require("https");

var app = express();

const port = 3000;

https.createServer({
	cert: fs.readFileSync('.test.crt'),
	key: fs.readFileSync('.test.key')
}, app).listen(port, function(){
	console.log('Server runnig',port);
});

app.get('/', function(req, res){
	res.send("Hola estas en la pagina principal");
	console.log("Peticion GET recibida")
})