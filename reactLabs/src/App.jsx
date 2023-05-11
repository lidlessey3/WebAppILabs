import { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import TopBar from './components/topBar.jsx';
import FilmList from './components/filmList';
import LateralBar from './components/lateralBar';
import dayjs from 'dayjs';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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

let Films = [new Movie(0, "pulp fiction", true, "10/03/2023", 5),
new Movie(1, "21 grams", true, "17/03/2023", 4),
new Movie(2, "star wars"), new Movie(3, "matrix"),
new Movie(4, "shrek", false, "21/03/2023", 3)];

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Container>
        <Row>
          <Col>
            <TopBar></TopBar>
          </Col>
        </Row>
        <Row>
          <Col>
            <LateralBar></LateralBar>
          </Col>
          <Col>
            <FilmList films={Films}></FilmList>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default App
