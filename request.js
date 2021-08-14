var request = require('request');
var fs = require('fs');
var path = require("path");
var url = "https://17x4yl3c71.execute-api.us-east-2.amazonaws.com/Develop/html-to-pdf-OS";
var html = fs.readFileSync('./index.html', 'utf8');
var filename = "converted.pdf";

var options = {
	url: url,
	method: 'post',
	json: {
		html_base64: html
	}
};

request(options, function (error, response, body) {
	if (error){
		console.log('Request error:', error);
	}else{
		fs.writeFile(`./${filename}`, body.pdf_base64, 'base64', function(err) {
			if (err){
				console.log("Error trying to convert base64 string to PDF file.")
			}else{
				console.log(`PDF downloaded at: "${path.resolve(`./${filename}`)}"`);
			}
		});
	}
});