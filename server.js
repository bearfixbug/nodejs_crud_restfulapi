const express = require('express');
const app = express();
const mysql = require('mysql');
const _ = require('lodash');
const bodyParser = require('body-parser')
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const server = app.listen(3000, () => {
    console.log('Nodejs is running on port 3000!')
})


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: 'movie'
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//create
app.post('/api/createmovie', (req, res) => {
    var moviename = _.get(req, ["body", "name"]);
    var mil = _.get(req, ["body", "mil"]);

    console.log('moviename', moviename)
    console.log('mil', mil)

    try {
        if(moviename && mil) {
            db.query('insert into tbl_movie (name, mil) values (?,?) ', [
                moviename, mil
            ], (err, resp, field) => {
                if(resp) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success'
                    })
                }
                else {
                    console.log('ERR 2! : Bad sql')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: bad sql',
                        Log: 2
                    })
                }
            }) 
        }
        else {
            console.log('ERR 1! : Invalid request')
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad: Invalid request',
                Log: 1
            })
        }
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

//get
app.get('/api/getallmovie', (req, res) => {
    try {
        db.query('select * from tbl_movie', [],
        (err, data, fil) => {
            if(data && data[0]) {

                // for (let i = 0; i < data.length; i++) {
                //     delete data[i].id                    
                // }

                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'success',
                    Result: data
                })
            }
            else {
                console.log('ERR 1! : not found data')
                return res.status(200).json({
                    RespCode: 400,
                    RespMessage: 'bad: not found data',
                    Log: 1
                })
            }
        })
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

//get by id
app.get('/api/getmoviebyid', (req, res) => {
    var movieid = _.get(req, ["body", "id"]);

    try {
        if(movieid) {
            db.query('select * from tbl_movie where id = ?', [
                movieid
            ],
            (err, data, fil) => {
                if(data && data[0]) {
    
                    for (let i = 0; i < data.length; i++) {
                        delete data[i].id                    
                    }
    
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                        Result: data
                    })
                }
                else {
                    console.log('ERR 1! : not found data')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: not found data',
                        Log: 1
                    })
                }
            })
        }
        else {
            console.log('ERR 2! : Invalid data')
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad: Invalid data',
                Log: 2
            })
        }
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

//update
app.put('/api/updatemovie', (req, res) => {
    var id = _.get(req, ["body", "id"]);
    var name = _.get(req, ["body", "name"]);
    var mil = _.get(req, ["body", "mil"]);

    try {
        if(id && name && mil) {
            db.query('update tbl_movie set name = ?, mil = ? where id = ?', [
                name, mil, parseInt(id)
            ], (err, data, fil) => {
                if(data) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                    })
                }
                else {
                    console.log('ERR 2! : Update fail')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: Update fail',
                        Log: 2
                    })
                }
            })
        }
        else {
            console.log('ERR 1! : Invalid data')
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad: Invalid data',
                Log: 1
            })
        }
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

//delete
app.delete('/api/deletemoviebyid', (req, res) => {
    var id = _.get(req, ["body", "id"]);

    try {
        if(id) {
            db.query('delete from tbl_movie where id = ? ', [
                parseInt(id)
            ], (err, resp, fil) => {
                if(resp) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'good',
                    })
                }
                else {
                    console.log('ERR 2! : bad sql')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: bad sql',
                        Log: 2
                    })
                }
            })
        }
        else {
            console.log('ERR 1! : Invalid id')
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad: Invalid id',
                Log: 1
            })
        }
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

module.exports = app;