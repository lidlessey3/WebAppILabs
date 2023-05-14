import 'dayjs';
import { useState } from 'react';
import { Table, Button, Collapse } from 'react-bootstrap/'
import NewFilmForm from './newFilmForm';
import dayjs from 'dayjs'

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

let FilmList = (props) => {
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [FormTitle, setFormTitle] = useState('');
  const [FormFavorite, setFormFavorite] = useState(false);
  const [FormDate, setFormDate] = useState(undefined);
  const [FormRating, setFormRating] = useState(undefined);
  const [FormID, setFormID] = useState(props.nextID);

  const resetForm = () => {
    setFormTitle('');
    setFormFavorite(false);
    setFormDate(undefined);
    setFormRating(undefined);
    setFormID(props.nextID);
  }

  return (
    <>
      <h1>{props.filter.label}</h1>
      <Table striped>
        <tbody>
          {props.films.filter(props.filter.filterFunction).map((film) => <FilmRow filmData={film} key={film.id} editForm={() => {
            setAddFormVisible(true);
            setFormID(film.id);
            setFormTitle(film.title);
            setFormFavorite(film.favorite);
            setFormDate(film.date);
            setFormRating(film.rating);
          }} />)}
        </tbody>
      </Table>
      <Collapse in={addFormVisible}>
        <div>
          <NewFilmForm title={FormTitle} favorite={FormFavorite} date={FormDate} rating={FormRating}
            setTitle={setFormTitle} setFavorite={setFormFavorite} setDate={setFormDate} setRating={setFormRating}
            success={() => {
              let newFilms = props.films.map((film) => new Movie(film.id, film.title, film.favorite, film.date, film.rating));
              if (FormID == props.nextID) {
                let newFilm = new Movie(props.nextID, FormTitle, FormFavorite, FormDate, FormRating);
                props.advanceID();
                newFilms.push(newFilm);
              }
              else {
                for (let i = 0; i < newFilms.length; i++) {
                  if (newFilms[i].id === FormID) {
                    newFilms[i].title = FormTitle;
                    newFilms[i].favorite = FormFavorite;
                    newFilms[i].date = FormDate;
                    newFilms[i].rating = FormRating;
                  }
                }
              }
              resetForm();
              setAddFormVisible(false);
              props.setFilms(newFilms);
            }}></NewFilmForm>
        </div>
      </Collapse>
      <div className='d-grid gap-2'>
        <Button variant={addFormVisible ? 'outline-danger' : 'outline-primary'} size="lg" onClick={() => {
          if (addFormVisible) {
            resetForm();
          }
          setAddFormVisible(!addFormVisible);
        }}>
          {addFormVisible ? <i key="minusButton" className='bi bi-x-circle' /> : <i key="plusButton" className='bi bi-plus' />}
        </Button>
      </div>
    </>
  );
}

function FilmRow(props) {

  const formatWatchDate = (dayJsDate, format) => {
    return dayJsDate ? dayJsDate.format(format) : '';
  }

  return (
    <tr>
      <td>
        <p className={props.filmData.favorite ? "favorite" : ""} >
          {props.filmData.title}
        </p>
      </td>
      <td>
        <i className={props.filmData.favorite ? 'bi bi-check-circle' : 'hidden'} style={{ color: 'green' }} />
      </td>
      <td>
        <small>{formatWatchDate(props.filmData.date, 'YYYY/MM/DD')}</small>
      </td>
      <td>
        <Rating rating={props.filmData.rating} maxStars={5} />
      </td>
      <td>
        <Button variant='outline-secondary' onClick={props.editForm}>
          <i class="bi bi-pencil-fill"></i>
        </Button>
      </td>
    </tr>
  );
}

function Rating(props) {
  return [...Array(props.maxStars)].map((el, index) =>
    <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"} />
  )
}

export default FilmList;