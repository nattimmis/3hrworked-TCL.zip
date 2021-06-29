
module.exports.query=(connection,input)=> {

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

function rollback(err,connection) {
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