//função para gerar hash
function geraStringAleatoria(tamanho) {
  var stringAleatoria = '';
  var caracteres =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < tamanho; i++) {
    stringAleatoria += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length),
    );
  }
  return stringAleatoria;
}

//função para conectar
async function connect() {
  if (global.connection && global.connection.state !== 'disconnected')
    return global.connection;

  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection(
    'mysql://root:@localhost:3306/dbsite',
  );
  global.connection = connection;
  return connection;
}

//função selecionar alunos
async function selectCostumers() {
  const conn = await connect();
  const [rows] = await conn.query('SELECT * FROM alunos;');
  return await rows;
}

//função cadastrar dados
async function insertCustomer(customer) {
  const conn = await connect();
  let id = geraStringAleatoria(16);
  const sql =
    'INSERT INTO alunos(nome,cpf,atividadeCertificado,tempo,homologar,documento,id) VALUES(?,?,?,?,?,?,?);';
  const values = [
    customer.nome,
    customer.cpf,
    customer.atividadeCertificado,
    customer.tempo,
    customer.homologar,
    customer.documento,
    id,
  ];
  await conn.query(sql, values);
}

//função atualizar dados
async function updateCustomer(customer) {
  const conn = await connect();
  const sql =
    'UPDATE alunos SET atividadeCertificado=?, tempo=?, homologar=?, documento=? WHERE id=?;';
  const values = [
    customer.atividadeCertificado,
    customer.tempo,
    customer.homologar,
    customer.documento,
    customer.id,
  ];
  return await conn.query(sql, values);
}

//função validar certificado
async function validateCustomer(customer) {
  const conn = await connect();
  const sql = 'UPDATE alunos SET homologar=? WHERE id=?;';
  const values = [customer.homologar, customer.id];
  return await conn.query(sql, values);
}

//função de excluir dados
async function deleteCustomer(id) {
  const conn = await connect();
  const sql = 'DELETE FROM alunos WHERE id=?;';
  return await conn.query(sql, [id]);
}

module.exports = {
  selectCostumers,
  insertCustomer,
  updateCustomer,
  deleteCustomer,
  validateCustomer,
};
