import 'dayjs';
import { useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap/'
import NewFilmForm from './newFilmForm';

let FilmList = (props) => {
  const [addFormVisible, setAddFormVisible] = useState(false);

  return (
    <>
      <h1>{props.filter.label}</h1>
      <Table striped>
        <tbody>
          {props.films.filter(props.filter.filterFunction).map((film) => <FilmRow filmData={film} key={film.id} />)}
        </tbody>
      </Table>

      <div className='d-grid gap-2'>
        <Button variant={addFormVisible ? 'outline-danger' : 'outline-primary'} size="lg" onClick={() => setAddFormVisible(!addFormVisible)}>
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
        <Form.Check type="checkbox" label="Favorite" defaultChecked={props.filmData.favorite ? true : false} />
      </td>
      <td>
        <small>{formatWatchDate(props.filmData.date, 'YYYY/MM/DD')}</small>
      </td>
      <td>
        <Rating rating={props.filmData.rating} maxStars={5} />
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