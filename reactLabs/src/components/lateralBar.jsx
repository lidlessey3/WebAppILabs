import { useNavigate, useParams } from "react-router-dom";

function LateralBar(props) {
    let data = useParams();
    return (
        <div className="list-group list-group-flush">
            {Object.values(props.filters).map((filter) => <Filter data={filter} key={filter.id} selected={data.filter === filter.id}></Filter>)}
        </div>
    );
}

function Filter(props) {
    const navigate = useNavigate();
    let classes = "list-group-item list-group-item-action";
    if (props.selected)
        classes += " active";
    return (<>
        <a href="#" onClick={() => navigate('/filter/' + props.data.id)} className={classes}>
            <p>{props.data.label}</p>
        </a>
    </>);
}

export default LateralBar;