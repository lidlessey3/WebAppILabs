function LateralBar(props) {
    return (
        <div className="list-group list-group-flush">
                {Object.values(props.filters).map((filter) => <Filter data={filter} key={filter.id} updateFunc={props.updateFunc} selected={props.selected === filter.id}></Filter>)}
        </div>
    );
}

function Filter(props) {
    let classes = "list-group-item list-group-item-action";
    if (props.selected)
        classes += " active";
    return (<>
        <a href="#" onClick={() => props.updateFunc(props.data.id)} className={classes}>
            <p>{props.data.label}</p>
        </a>
    </>);
}

export default LateralBar;