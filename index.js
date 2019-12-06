// importando o módulo express
const express = require("express");
const app = express();

// Conectando database
const connection = require('./database/database');
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

//importando o body-parser
const bodyParser = require("body-parser");

// Importando o model
const Pergunta = require("./database/Pergunta");

// Informando ao express usar o EJS
app.set('view engine', 'ejs');

//Informando os arquivos estáticos
app.use(express.static('public'))

//linkando o body parser ao express
//o comando abaixo permite que ao enviar os dados do formulário, o body parse traduza os dados em uma estrutura javascript
app.use(bodyParser.urlencoded({extended: false}));

//permite a leitura dos dados do formulário enviado via json
app.use(bodyParser.json());

// Criando uma rota padrão
app.get("/", function (req, res) {
    // select * from pergunta 
    Pergunta.findAll().then(perguntas => {
        console.log(perguntas);
    });
    res.render("index")
})

app.get("/perguntar", function(req, res) {
    res.render("perguntar");
});

//rota para pegar os dados do formulário e salvar no banco de dados
app.post("/salvarpergunta", function(req, res) {
    //pegando as informações do formulário
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var data = new Date(); //captura a data universal
    //Convertendo para o horário de Brasília
    var dataBrasilia =  new Date(data.valueOf() - data.getTimezoneOffset() * 6000);
    // método create é equivalente ao inserte do sql.
    Pergunta.create({
        titulo: titulo,
        descricao: descricao,
        createdAt: dataBrasilia,
        updatedAt: dataBrasilia
    }).then(() => {
        res.redirect("/");
    });
});


// Configurando o servidor
app.listen(3000, () => { console.log("Servidor funcionando"); });