var fs = require("fs");
var pdf = require("html-pdf");
const Handlebars = require("handlebars");

const { bag } = require("./mockData");

var html = fs.readFileSync(
  "./proposta_comercial_modelo_locacao_in_progress.html",
  "utf8"
);

const context = {
  ...bag.templateRequest.tplparams,
};

const template = Handlebars.compile(html);
const compiledTemplate = template(context);

fs.writeFile("./compiledTemplate_copy.html", compiledTemplate, () => {});

var options = {
  format: "A4",
  orientation: "portrait",
};

pdf
  .create(compiledTemplate, options)
  .toFile("./files/generated.pdf", function (err, res) {
    if (err) return console.log(err);
    console.log(`PDF generated at: "${res.filename}"`);
  });
