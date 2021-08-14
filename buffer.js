var fs = require("fs");
var pdf = require("html-pdf");
var html = fs.readFileSync("./index.html", "utf8");
var options = {
  format: "A4",
  orientation: "portrait",
};

pdf.create(html, options).toBuffer(function (err, buffer) {
  if (err) return console.log(err);
  console.log(`PDF buffered: "${Buffer.from(buffer)}"`);
});
