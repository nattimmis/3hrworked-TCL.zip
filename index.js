const mysql = require('mysql')
const { promisify } = require('util')
// const{deploy} = require('./sendtransaction')
// const {query} = require('./lockdatabase');

const connection = mysql.createConnection({
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  password: process.env.MYSQL_PASS,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER
})

function checktransaction(row) {
  return row.status === "pending";
}

async function start () {
  connection.query("SELECT * FROM WithdrawalRequest", function(err, rows, fields) {
    rows.forEach(async function(row) {
      if(checktransaction(row)){
        const result= await query({sql:update(row.id)})
        console.log(result);
      }
    });
    console.log('Finish');
    process.exit()

  });
}

function update(id){
  return`
START TRANSACTION;
  # update the database
  UPDATE WithdrawalRequest SET status = 'complete' WHERE id=${id};
COMMIT;
`;
}


function query(input){

  const _defaults = {
    params: []
  };
  const {sql, params, autorollback} = Object.assign(_defaults, input);


  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, resp) => {

      if(err && autorollback) {
        return resolve(rollback(err,connection));
      }
      else if (err) {
        return reject(err);
      }
      resolve(resp);
    });
  });
}

function rollback(err) {
  return new Promise((resolve, reject) => {
    connection.query('ROLLBACK;', [], (rollbackErr) => {
      if(rollbackErr) {
        // Fall back to torching the connection
        connection.destroy();

        console.error(rollbackErr);
      }
      reject(err);
    });
  });
}

start()
