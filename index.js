"use strict";

const dayjs = require("dayjs");

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

function FilmLibrary() {
    this.films = [];
    this.addNewFilm = (film) => this.films.push(film);
    this.print = () => this.films.forEach((elem) => elem.print());
    this.sortByDate = () => [...this.films].sort((a, b) => {
        if (a.date === undefined && b.date === undefined)
            return 0;
        if (a.date === undefined)
            return 1;
        if (b.date === undefined)
            return -1;
        return a.date.isAfter(b.date) ? 1 : -1;
    });
    this.deleteFilm = (id) => {
        let k = this.films.findIndex((elem) => elem.id === id);
        if (k === -1)
            return;
        this.films.splice(k, 1);
        return;
    };
    this.resetWatchedFilms = () => this.films.forEach((elem) => elem.reset());
    this.getRated = () => this.films.filter((elem) => elem.date != undefined).sort((a, b) => b.rating - a.rating);
}

let filmObj = new FilmLibrary();

filmObj.addNewFilm(new Movie(1, "pulp fiction", true, "2023-03-10", 5));
filmObj.addNewFilm(new Movie(2, "21 grams", true, "2023-03-17", 4));
filmObj.addNewFilm(new Movie(3, "star wars"));
filmObj.addNewFilm(new Movie(4, "matrix"));
filmObj.addNewFilm(new Movie(5, "shrek", false, "2023-03-21", 3));

filmObj.print();

console.log("---------------------")

filmObj.sortByDate().forEach((elem) => elem.print());

console.log("---------------------")
filmObj.getRated().forEach((elem) => elem.print());

console.log("---------------------")
filmObj.resetWatchedFilms();
filmObj.print();

console.log("---------------------")
filmObj.deleteFilm(5);
filmObj.deleteFilm(2);
filmObj.print();
