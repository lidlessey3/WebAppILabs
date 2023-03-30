"use strict";

const dayjs = require("dayjs");
const sqlite = require("sqlite3");
const http = require("http");
const fs = require('fs').promises;

const db = new sqlite.Database("films.sqlite", (err) => { if (err) throw err });

function ex0(strings) {
    return strings.map((string) => {
        if (string.length < 2)
            return "";
        return string.substring(0, 2) + string.substring(string.length - 2);
    });
}

console.log(ex0(["spring", "it", "cat"]));

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
    this.reset = () => {
        this.date = undefined;
        this.rating = undefined;
    }
    this.print = () => console.log("Id: ", this.id, ", Title: ", this.title, ", Favorite: ", this.favorite, ", Watch date: ", this.date != undefined ? this.date.format("YYYY-MM-DD") : "<not defined>", ", Score: ", this.rating, ".");
}

function FilmLibrary(database) {
    this.db = database;
    this.addNewFilm = (film) => {
        if (film.rating != undefined) {
            const sql = "INSERT INTO LIBRARY VALUES(?,?,?,?,?)";
            return new Promise((resolve, reject) => db.run(sql, [film.id, film.title, film.favorite, film.date.toISOString(), film.rating], (result, err) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            }));
        } else {
            const sql = "INSERT INTO LIBRARY VALUES(?,?,?, NULL, NULL)";
            return new Promise((resolve, reject) => db.run(sql, [film.id, film.title, film.favorite], (result, err) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            }));
        }
    };

    this.getAllFilms = () => {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM LIBRARY;";
            this.db.all(sql, [], (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.dateW, elem.rating)));
            });
        });
    }

    this.print = async () => (await this.getAllFilms().then()).forEach((elem) => elem.print());
    this.sortByDate = async () => [...(await this.getAllFilms().then())].sort((a, b) => {
        if (a.date === undefined && b.date === undefined)
            return 0;
        if (a.date === undefined)
            return 1;
        if (b.date === undefined)
            return -1;
        return a.date.isAfter(b.date) ? 1 : -1;
    });
    this.deleteFilm = (id) => {
        return new Promise((resolve, reject) => {
            let sql = "DELETE FROM LIBRARY WHERE id = ?;";
            this.db.run(sql, [id], (result, err) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    };
    this.resetWatchedFilms = () => new Promise((resolve, reject) => {
        let sql = "UPDATE LIBRARY WHERE dateW IS NOT NULL SET dateW = NULL, rating = NULL";
        this.db.run(sql, [], (result, err) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
    this.getRated = async () => (await this.getAllFilms().then()).filter((elem) => elem.date != undefined).sort((a, b) => b.rating - a.rating);

    this.getFavorites = () => new Promise((resolve, reject) => {
        let sql = "SELECT * FROM LIBRARY WHERE favorite = TRUE;";
        this.db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.dateW, elem.rating)));
        });
    });

    this.getWatchedToday = () => new Promise((resolve, reject) => {
        let sql = "SELECT * FROM LIBRARY WHERE dateW IS NOT NULL AND datediff(day, dateW, ?) = 0";
        this.db.all(sql, [dayjs().toISOString()], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.dateW, elem.rating)));
        });
    });

    this.getAfterDate = (date) => new Promise((resolve, reject) => {
        let sql = "SELECT * FROM LIBRARY WHERE dateW IS NOT NULL AND dateW >= ?;";
        this.db.all(sql, [dayjs(date).toISOString()], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.dateW, elem.rating)));
        });
    });

    this.getBetterRating = (rating) => new Promise((resolve, reject) => {
        let sql = "SELECT * FROM LIBRARY WHERE rating IS NOT NULL AND rating >= ?;";
        this.db.all(sql, [rating], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.dateW, elem.rating)));
        });
    });

    this.searchByTitle = (title) => new Promise((resolve, reject) => {
        sql = "SELECT * FROM LIBRARY WHERE title LIKE %?%;";
        this.db.all(sql, [title], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.map((elem) => new Movie(elem.id, elem.title, elem.favorite, elem.dateW, elem.rating)));
        });
    });
}

async function main() {
    await new Promise((resolve, reject) =>
        db.run("DROP TABLE IF EXISTS LIBRARY;", (result, err) => {
            if (!err) {
                db.run("CREATE TABLE LIBRARY(\
                id NUMBER PRIMARY KEY, \
                title varchar(30) NOT NULL, \
                favorite bool NOT NULL, \
                dateW DATE, \
                rating NUMBER \
            );", (result, err) => { if (!err) resolve(true); });
            }
        })); // drop table if it exists

    let filmObj = new FilmLibrary(db);

    await filmObj.addNewFilm(new Movie(1, "pulp fiction", true, "2023-03-10", 5));
    await filmObj.addNewFilm(new Movie(2, "21 grams", true, "2023-03-17", 4));
    await filmObj.addNewFilm(new Movie(3, "star wars"));
    await filmObj.addNewFilm(new Movie(4, "matrix"));
    await filmObj.addNewFilm(new Movie(5, "shrek", false, "2023-03-21", 3));

    filmObj.print();

    console.log("---------------------");

    (await filmObj.sortByDate()).forEach((elem) => elem.print());

    console.log("---------------------");
    (await filmObj.getRated()).forEach((elem) => elem.print());

    console.log("---------------------");
    await filmObj.resetWatchedFilms();
    filmObj.print();

    console.log("---------------------");
    await filmObj.deleteFilm(5);
    await filmObj.deleteFilm(2);
    filmObj.print();

    const host = 'localhost';
    const port = 8000;
    let indexFile;

    const requestListener = function (req, res) {
        switch (req.url) {
            case "/":
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(indexFile);
                break;
            case "/JSON/all":
                filmObj.getAllFilms().then((ret) => {
                    res.setHeader("Content-Type", "text/json");
                    res.writeHead(200);
                    res.end(JSON.stringify(ret));
                });
                break;
            case "/JSON/favorites":
                filmObj.getFavorites().then((ret) => {
                    res.setHeader("Content-Type", "text/json");
                    res.writeHead(200);
                    res.end(JSON.stringify(ret));
                });
                break;
            case "/JSON/bestRated":
                filmObj.getRated().then((ret) => {
                    res.setHeader("Content-Type", "text/json");
                    res.writeHead(200);
                    res.end(JSON.stringify(ret));
                });
                break;
            case "/JSON/seenLastMonth":
                filmObj.getWatchedToday().then((ret) => {
                    res.setHeader("Content-Type", "text/json");
                    res.writeHead(200);
                    res.end(JSON.stringify(ret));
                });
                break;
            case "/JSON/unseen":
                filmObj.getAllFilms().then((ret) => {
                    res.setHeader("Content-Type", "text/json");
                    res.writeHead(200);
                    res.end(JSON.stringify(ret.filter((elem) => elem.dateW === undefined)));
                });
                break;
        }
    };

    const server = http.createServer(requestListener);

    fs.readFile(__dirname + "/index.html")
        .then(contents => {
            indexFile = contents;
            server.listen(port, host, () => {
                console.log(`Server is running on http://${host}:${port}`);
            });
        })
        .catch(err => {
            console.error(`Could not read index.html file: ${err}`);
            process.exit(1);
        });
}

main();
