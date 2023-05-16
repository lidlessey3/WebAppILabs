import { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import TopBar from './components/topBar.jsx';
import FilmList from './components/filmList';
import LateralBar from './components/lateralBar';
import { Routes, Route, BrowserRouter, Outlet, useParams } from 'react-router-dom'
import dayjs from 'dayjs';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NewFilmForm from './components/newFilmForm.jsx';

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

const FILMS = [new Movie(0, "pulp fiction", true, "03/10/2023", 5),
new Movie(1, "21 grams", true, "03/17/2023", 4),
new Movie(2, "star wars"), new Movie(3, "matrix"),
new Movie(4, "shrek", false, "03/21/2023", 3)];


const filters = {
  'filter-all': { label: 'All', id: 'filter-all', filterFunction: () => true },
  'filter-favorite': { label: 'Favorites', id: 'filter-favorite', filterFunction: film => film.favorite },
  'filter-best': { label: 'Best Rated', id: 'filter-best', filterFunction: film => film.rating >= 5 },
  'filter-lastmonth': { label: 'Seen Last Month', id: 'filter-lastmonth', filterFunction: film => isSeenLastMonth(film) },
  'filter-unseen': { label: 'Unseen', id: 'filter-unseen', filterFunction: film => film.date ? false : true }
};

const isSeenLastMonth = (film) => {
  if ('date' in film) {  // Accessing watchDate only if defined
    const diff = film.date.diff(dayjs(), 'month')
    const isLastMonth = diff <= 0 && diff > -1;      // last month
    return isLastMonth;
  }
}

function App() {
  const [films, setFilms] = useState(FILMS);
  const [nextID, setNextID] = useState(5);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<>
            <TopBar></TopBar>
            <Container fluid>
              <Outlet></Outlet>
            </Container>
          </>}>
            <Route path="/filter/:filter" element={
              <>
                <Row className='vh-100' id="MainPage">
                  <Col md={4} xl={3} bg="light" id="left-sidebar">
                    <LateralBar filters={filters}></LateralBar>
                  </Col>
                  <Col md={8} xl={9} >
                    <FilmList films={films} filters={filters} setFilms={setFilms} nextID={nextID} advanceID={() => setNextID(nextID + 1)}></FilmList>
                  </Col>
                </Row>
              </>
            }></Route>
            <Route path="/newFilm" element={<>
              <NewFilmForm></NewFilmForm>
            </>}></Route>
            <Route path="/editFilm/:id" element={<>
              <NewFilmForm></NewFilmForm>
            </>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
