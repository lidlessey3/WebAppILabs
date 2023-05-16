import { Button, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import 'dayjs';

function NewFilmForm(props) {
    return (
        <>
            <Form id="FilmForm" onSubmit={(event) => {
                event.preventDefault();
                if (props.rating === '' || props.date === undefined)
                    props.setRating(undefined);
                props.success();
             }}>
                <Form.Control className='FilmFormElem' id="FormTitle" type='text' placeholder='Title...'
                    value={props.title} onChange={(x) => props.setTitle(x.target.value)} required></Form.Control>
                <Form.Check className='FilmFormElem' id="FormFavorite" type='checkbox' label='Favorite'
                    checked={props.favorite} onChange={(x) => props.setFavorite(x.target.checked)}></Form.Check>
                <Form.Control className='FilmFormElem' id="FormDate" type='date' value={props.date !== undefined ? props.date.format('YYYY-MM-DD') : ''} onChange={(x) => {
                    if (x.target.value === '')
                        props.setDate(undefined);
                    else
                        props.setDate(dayjs(x.target.value, "YYYY-MM-DD"));
                }}></Form.Control>
                <Form.Select className='FilmFormElem' id="FormRating" value={props.rating === undefined ? 0 : props.rating}
                    disabled={props.date === undefined} required={props.date !== undefined} onChange={(x) => props.setRating(x.target.value)}>
                    <option value={''}>Rate</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </Form.Select>
                <div className='d-grid gap-2'>
                    <Button variant='outline-success' type='submit' className='FilmFormElem' size="lg">Save</Button>
                </div>
            </Form>
        </>
    );
}

export default NewFilmForm;