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
            sqlCreateTable = "CREATE TABLE questions (id INT, type VARCHAR(255), content JSON, answer INT, history_attempts INT, history_correct INT, rating FLOAT)";
            db.query(sqlCreateTable, (err, result) => {
                console.log(err);
            });
        }
    });

    const sqlSelect = "SELECT * FROM movie_reviews;";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});

app.post('/api/insert', (req, res) => {
    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;

    const sqlInsert = "INSERT INTO movie_reviews (movieName, movieReview) VALUES (?,?);"
    db.query(sqlInsert, [movieName, movieReview], (err, result) => {
        if (err) {
            console.log(err);
        }
    });
});

app.delete('/api/delete/:movieName', (req, res) => {
    const name = req.params.movieName;
    
    const sqlDelete = "DELETE FROM movie_reviews WHERE movieName = ?;"
    db.query(sqlDelete, name, (err, result) => {
        if (err) {
            console.log(err);
        }
    });
});

app.put('/api/update/', (req, res) => {
    const name = req.body.movieName;
    const review = req.body.movieReview;

    const sqlUpdate = "UPDATE movie_reviews SET movieReview = ? WHERE movieName = ?;"
    db.query(sqlUpdate, [review, name], (err, result) => {
        if (err) {
            console.log(err);
        }
    });
});

app.listen(3001, () => {
    console.log('running on pot 3001');
});