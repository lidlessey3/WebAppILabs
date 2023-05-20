"use strict";

const dayjs = require('dayjs');
const express = require('express');
const sqlite = require('sqlite3');

// creating the express app

const app = express();

// opening db connection

const database = new sqlite.Database("films.db", (err) => { if (err) throw err });

function Movie(id, title, favorite = false, date = undefined, rating = undefined) {
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    if (date != undefined)
        this.date = dayjs(date);
    if (rating != undefined)
        this.rating = rating < 1 ? 1 : rating > 5 ? 5 : rating;
    this.watch = (date, rating) => {
        this.date = dayjs(date);
        this.rating = rating < 1 ? 1 : rating > 5 ? 5 : rating;
    };
}

function FilmLibrary(database) {
    this.db = database;
    this.addNewFilm = (film, user) => {
        let id = {then: () => film.id};
        if (film.id === -1) {
            const sql = "SELECT MAX(id) AS maxID FROM films;"
            id = new Promise((resolve, reject) => {
                this.db.run(sql, [], (result, err) => {
                    if (err)
                        reject(err);
                    else
                        resolve(result.maxID + 1);
                })
            })
        }
        
        if (film.rating != undefined) {
            const sql = "INSERT INTO films VALUES(?, ?, ?, ?, ?, ?)";
            return new Promise((resolve, reject) => db.run(sql, [id.then(), film.title, film.favorite, film.date.toISOString(), film.rating, user], (result, err) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            }));
        } else {
            const sql = "INSERT INTO films VALUES(?,?,?, NULL, NULL)";
            return new Promise((resolve, reject) => db.run(sql, [film.id, film.title, film.favorite], (result, err) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            }));
        }
    };

    this.getAllFilms = (user) => {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM films WHERE user = ?;";
            this.db.all(sql, [user], (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.watchdate, elem.rating)));
            });
        });
    }

    this.deleteFilm = (id, user) => {
        return new Promise((resolve, reject) => {
            let sql = "DELETE FROM films WHERE id = ? AND user = ?;";
            this.db.run(sql, [id, user], (result, err) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    };

    this.getFavorites = (user) => new Promise((resolve, reject) => {
        let sql = "SELECT * FROM films WHERE favorite = TRUE AND user = ?;";
        this.db.all(sql, [user], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.watchdate, elem.rating)));
        });
    });

    this.getWatchedToday = (user) => new Promise((resolve, reject) => {
        let sql = "SELECT * FROM films WHERE watchdate IS NOT NULL AND JULIANDAY(watchdate) - JULIANDAY(?) = 0 AND user = ?";
        this.db.all(sql, [dayjs().toISOString(), user], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.watchdate, elem.rating)));
        });
    });

    this.getUnseen = (user) => new Promise((resolve, reject) => {
        let sql = "SELECT * FROM films WHERE watchdate IS NULL AND user = ?;";
        this.db.all(sql, [user], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.watchdate, elem.rating)));
        });
    });

    this.getBetterRating = (rating, user) => new Promise((resolve, reject) => {
        let sql = "SELECT * FROM films WHERE rating IS NOT NULL AND rating >= ? AND user = ?;";
        this.db.all(sql, [rating, user], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.watchdate, elem.rating)));
        });
    });

    this.searchByTitle = (title, user) => new Promise((resolve, reject) => {
        let sql = "SELECT * FROM films WHERE title LIKE ? AND user = ?;";
        this.db.all(sql, ['%' + title + '%', user], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.watchdate, elem.rating)));
        });
    });
}

app.listen(3178);

let films = new FilmLibrary(database);


app.get('/:user/films', (req, res) => {
    films.getAllFilms(req.params.user).then((data) => {
        res.status(200).json(data);
        res.end();
    })
});

app.get('/:user/films/favorites', (req, res) => {
    films.getFavorites(req.params.user).then((data) => {
        res.status(200).json(data);
        res.end();
    })
});

app.get('/:user/films/best', (req, res) => {
    films.getBetterRating(5, req.params.user).then((data) => {
        res.status(200).json(data);
        res.end();
    })
});

app.get('/:user/films/search', (req, res) => {
    films.searchByTitle(req.query.title, req.params.user).then((data) => {
        res.status(200).json(data);
        res.end();
    })
});

app.get('/:user/films/unseen', (req, res) => {
    films.getUnseen(req.params.user).then((data) => {
        res.status(200).json(data);
        res.end();
    })
});

app.post('/:user/films/new', express.json, (req, res) => {
    let newFilm = new Movie(-1, req.body.title, req.body.favorite, req.body.date, req.body.rating);
    films.addNewFilm(newFilm, req.params.user);
    res.status(200).end();
});
