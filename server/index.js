const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

//configure credentials
const host = "localhost"
const user = "root"
const passwd = ""
const database = "triplem"
const db = mysql.createPool({
    host: host,
    user: user,
    password: passwd,
    database: database
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extend: true}));

app.get("/api/get", (req, res) => {
    sqlCheck = "SHOW TABLES;"
    db.query(sqlCheck, (err, result) => {
        console.log(result);
        if (!result.length) {
            sqlCreateTable = "CREATE TABLE questions (id INT NOT NULL primary key AUTO_INCREMENT, type VARCHAR(255) NOT NULL, content JSON NOT NULL, answer INT NOT NULL, history_attempts INT NOT NULL, history_correct INT NOT NULL, rating FLOAT NOT NULL)";
            db.query(sqlCreateTable, (err, result) => {
                console.log(err);
            });
        }
    });

    const sqlSelect = "SELECT * FROM questions;";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});

// example: {"type": "addition", "content": '{"1": "14", "2": "27"}', "answer": "test", "attempts": "0", "correct": "0", "rating": "0"}
app.post('/api/insert', (req, res) => {
    const type = req.body.type;
    const content = req.body.content;
    const answer = req.body.answer;
    const attempts = req.body.attempts;
    const correct = req.body.correct;
    const rating = req.body.rating;

    const sqlInsert = "INSERT INTO questions (type, content, answer, history_attempts, history_correct, rating) VALUES (?,?,?,?,?,?);"
    db.query(sqlInsert, [type, content, answer, attempts, correct, rating], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});

// example: { "id": "7" }
app.delete('/api/delete', (req, res) => {
    const id = req.body.id;
    
    const sqlDelete = "DELETE FROM questions WHERE id = ?;"
    db.query(sqlDelete, id, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});

// example: {"id": "8", "type": "addition", "content": '{"1": "21", "2": "21"}', "answer": "test", "attempts": "0", "correct": "0", "rating": "0"}
app.put('/api/update/', (req, res) => {
    const id = req.body.id;
    const type = req.body.type;
    const content = req.body.content;
    const answer = req.body.answer;
    const attempts = req.body.attempts;
    const correct = req.body.correct;
    const rating = req.body.rating;

    const sqlUpdate = "UPDATE questions SET type = ?, content = ?, answer = ?, history_attempts = ?, history_correct = ?, rating = ? WHERE id = ?;"
    db.query(sqlUpdate, [type, content, answer, attempts, correct, rating, id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});

app.listen(3001, () => {
    console.log('running on pot 3001');
});