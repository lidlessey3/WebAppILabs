

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


function filterAll() {
    fetch('/JSON/all')
        .then((response) => response.json())
        .then((json) => {
            films = json.map((elem) => new Movie(elem['id'], elem['title'], elem['favorite'], elem['date'], elem['rating']));
            console.log(films);

            setFilms(films);
        });

    document.getElementById("filter-title").textContent = "All";
    document.getElementsByClassName("active")[0].className = document.getElementsByClassName("active")[0].className.replace(" active", "");
    document.getElementById("filter-all").className += " active";
}

function filterFavorites() {
    fetch('/JSON/favorites')
        .then((response) => response.json())
        .then((json) => {
            films = json.map((elem) => new Movie(elem['id'], elem['title'], elem['favorite'], elem['date'], elem['rating']));
            console.log(films);

            setFilms(films);
        });

    document.getElementById("filter-title").textContent = "Favorites";
    document.getElementsByClassName("active")[0].className = document.getElementsByClassName("active")[0].className.replace(" active", "");
    document.getElementById("filter-favorites").className += " active";
}

function filterRated() {
    fetch('/JSON/bestRated')
        .then((response) => response.json())
        .then((json) => {
            films = json.map((elem) => new Movie(elem['id'], elem['title'], elem['favorite'], elem['date'], elem['rating']));
            console.log(films);

            setFilms(films);
        });

    document.getElementById("filter-title").textContent = "Best Rated";
    document.getElementsByClassName("active")[0].className = document.getElementsByClassName("active")[0].className.replace(" active", "");
    document.getElementById("filter-best").className += " active";
}

function filterSeenThisMonth() {
    fetch('/JSON/seenLastMonth')
        .then((response) => response.json())
        .then((json) => {
            films = json.map((elem) => new Movie(elem['id'], elem['title'], elem['favorite'], elem['date'], elem['rating']));
            console.log(films);

            setFilms(films);
        });

    document.getElementById("filter-title").textContent = "Seen Last Month";
    document.getElementsByClassName("active")[0].className = document.getElementsByClassName("active")[0].className.replace(" active", "");
    document.getElementById("filter-seen-last-month").className += " active";
}

function filterUnseen() {
    fetch('/JSON/unseen')
        .then((response) => response.json())
        .then((json) => {
            films = json.map((elem) => new Movie(elem['id'], elem['title'], elem['favorite'], elem['date'], elem['rating']));
            console.log(films);

            setFilms(films);
        });

    document.getElementById("filter-title").textContent = "Unseen";
    document.getElementsByClassName("active")[0].className = document.getElementsByClassName("active")[0].className.replace(" active", "");
    document.getElementById("filter-unseen").className += " active";
}

function setFilms(films) {
    document.getElementById("list-films").replaceChildren(...films.map((film) => {
        let listElem = document.createElement("li");
        listElem.className = "list-group-item";
        listElem.id = film.title.replace(" ", "");

        let divElem = document.createElement("div");
        divElem.className = "d-flex w-100 justify-content-between";

        let pElem = document.createElement("p");
        pElem.className = "text-start col-md-4 col-3";
        if (film.favorite)
            pElem.className += " favorite"
        pElem.textContent = film.title;

        let favoriteSpan = document.createElement("span");
        favoriteSpan.className = "custom-control custom-checkbox col-md-2 col-3";

        let favoriteInput = document.createElement("input");
        favoriteInput.classList = "custom-control-input";
        favoriteInput.type = "checkbox";
        favoriteInput.checked = film.favorite;
        favoriteInput.id = "check-" + film.title.replace(" ", "");

        let favoriteText = document.createElement("label");
        favoriteText.className = "custom-control-label";
        favoriteText.htmlFor = "check-" + film.title.replace(" ", "");
        favoriteText.textContent = "Favorite";

        favoriteSpan.appendChild(favoriteInput);
        favoriteSpan.appendChild(favoriteText);

        let smallDate = document.createElement("small");
        smallDate.className = "watch-date col-md-3 col-3";
        if (film.date !== undefined)
            smallDate.textContent = film.date.format("DD/MM/YYYY");


        let ratingSpan = document.createElement("span");
        ratingSpan.className = "rating text-end col-md-3 col-3";
        if (film.rating === undefined)
            film.rating = 0;

        for (let i = 0; i < film.rating; i++) {
            ratingSpan.appendChild(getSVGStar(true));
        }

        for (let i = 0; i < (5 - film.rating); i++) {
            ratingSpan.appendChild(getSVGStar(false));
        }

        divElem.appendChild(pElem);
        divElem.appendChild(favoriteSpan);
        divElem.appendChild(smallDate);
        divElem.appendChild(ratingSpan);
        listElem.appendChild(divElem);

        return listElem;
    }));
}

document.getElementById("filter-all").addEventListener("click", filterAll);
document.getElementById("filter-favorites").addEventListener("click", filterFavorites);
document.getElementById("filter-best").addEventListener("click", filterRated);
document.getElementById("filter-seen-last-month").addEventListener("click", filterSeenThisMonth);
document.getElementById("filter-unseen").addEventListener("click", filterUnseen);

function getSVGStar(fill){
    const sgv = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sgv.setAttribute("width", 16);
    sgv.setAttribute("height", 16);
    sgv.setAttribute("fill", "currentColor");
    sgv.setAttribute("viewBox", "0 0 16 16");

    if (fill) {
        sgv.setAttribute("class", "bi bi-star-fill");
        sgv.innerHTML = '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>';
    }else{
        sgv.setAttribute("class", "empty-star bi bi-star");
        sgv.innerHTML = '<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>';
    }

    return sgv;
}
