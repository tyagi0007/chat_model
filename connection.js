const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chat_model'
})
connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
    // var result = connection.query('select * from tb_channels',[])
    // console.log(result)
})

// connection.query(`select * from tb_chat`, [], function(err, result) {
//     if (err) {
//         console.log(err)
    
        
//     } else {
        
//         console.log(result)
//     }
// });

module.exports= connection;

