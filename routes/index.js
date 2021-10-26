var express = require('express');
var router = express.Router();
const db = require('../models/db');
const multer = require('multer');
let alunos = [];

//Função para armazenar arquivo diretório 'public/uploads',
//gerar nome por data + extensão para salvar arquivo

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
  },
});
const upload = multer({ storage: storage });

(async () => {
  //Router CADASTRAR CERTIFICADO
  router.get('/enviar', function (req, res, next) {
    res.render('enviar');
  });

  //Router ENVIAR CERTIFICADO
  router.post(
    '/enviar-cadastro',
    upload.single('documento'),
    function (req, res, next) {
      db.insertCustomer({
        atividadeCertificado: req.body.atividadeCertificado,
        tempo: req.body.tempo,
        homologar: 'em análise',
        documento: req.file.filename,
      });
      res.redirect('/');
    },
  );
  alunos = await db.selectCostumers();

  //Router PESQUISAR
  router.get('/pesquisar', function (req, res, next) {
    let dados = [];
    if (req.query.atividadeCertificado == '') {
      dados = alunos;
    } else {
      for (let i = 0; i < alunos.length; i++) {
        if (
          alunos[i].atividadeCertificado
            .toLowerCase()
            .indexOf(req.query.atividadeCertificado.toLowerCase()) != -1
        ) {
          dados.push(alunos[i]);
        }
      }
    }
    res.render('index', { alunos: dados });
  });

  //Router EXCLUIR
  router.get('/excluir', function (req, res, next) {
    db.deleteCustomer(req.query.id);
    (async () => {
      alunos = await db.selectCostumers();
    })();
    res.redirect('/');
  });

  //Router INDEX ;)
  router.get('/', function (req, res, next) {
    let total = 0;
    (async () => {
      alunos = await db.selectCostumers();
    })();
    for (let i = 0; i < alunos.length; i++) {
      if (alunos[i].homologar == 'Aprovado') {
        total = total + alunos[i].tempo;
      }
    }
    res.render('index', { alunos: alunos, total: total });
  });

  //Router SECRETARIA
  router.get('/secretaria', function (req, res, next) {
    (async () => {
      alunos = await db.selectCostumers();
    })();

    res.render('secretaria', { alunos: alunos });
  });

  //Router VALIDANDO CERTIFICADO
  router.get('/secretaria-validar', function (req, res, next) {
    (async () => {
      alunos = await db.selectCostumers();
    })();
    for (let i = 0; i < alunos.length; i++) {
      if (req.query.id == alunos[i].id) {
        db.validateCustomer({
          homologar: 'Aprovado',
          id: req.query.id,
        });
        break;
      }
    }
    res.redirect('/secretaria');
  });

  //Router NEGANDO VALIDAÇÃO DO CERTIFICADO
  router.get('/secretaria-negar', function (req, res, next) {
    (async () => {
      alunos = await db.selectCostumers();
    })();
    for (let i = 0; i < alunos.length; i++) {
      if (req.query.id == alunos[i].id) {
        db.validateCustomer({
          homologar: 'Negado',
          id: req.query.id,
        });
        break;
      }
    }
    res.redirect('/secretaria');
  });

  //Router ALTERAR - ALTERAR.EJS
  router.get('/alterar', function (req, res, next) {
    (async () => {
      alunos = await db.selectCostumers();
    })();
    let aluno;
    for (let i = 0; i < alunos.length; i++) {
      if (req.query.id == alunos[i].id) {
        aluno = alunos[i];
        break;
      }
    }
    res.render('alterar', { aluno: aluno });
  });

  //Router ATUALIZANDO DADOS
  router.post(
    '/alterar-pessoa',
    upload.single('documento'),
    function (req, res, next) {
      (async () => {
        alunos = await db.selectCostumers();
      })();
      for (let i = 0; i < alunos.length; i++) {
        if (req.body.identificador == alunos[i].id) {
          db.updateCustomer({
            atividadeCertificado: req.body.atividadeCertificado,
            tempo: req.body.tempo,
            homologar: 'Em análise',
            documento: req.file.filename,
            id: req.body.identificador,
          });
          break;
        }
      }
      res.redirect('/');
    },
  );
})();

module.exports = router;
