const mysql = require('mysql')

const HOST = 'localhost'
const USER = 'root'
const PASSWORD = 'password'
const DATABASE = 'people_database'


let mySqlConnection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database:  DATABASE,
    multipleStatements: true
})

mySqlConnection.connect((error) => {
    if (error)
        console.log("Error in connecting to database - " + error)
    else
        console.log("Connected to database successfully")
})

module.exports = mySqlConnection