import React from 'react';
import Form from 'react-bootstrap/Form';

const Filter = ({ filter, setFilter }) => {

    return (
        <Form>
            <h4>Show Categories</h4>
            {Object.keys(filter.categoriesToShow).map((key) => {
                if (["result", "job_title", "company"].some(i => i === key)) {
                    return null
                }
                return (
                <div key={key}>
                    <Form.Check
                        type="checkbox"
                        id={filter.categoriesToShow[key].name}
                        label={filter.categoriesToShow[key].name}
                        defaultChecked={filter.categoriesToShow[key].show}
                        onClick={(e) => {
                            let newFilter = JSON.parse(JSON.stringify(filter));
                            newFilter.categoriesToShow[key].show = e.target.checked;
                            setFilter(newFilter)
                            console.log(filter.categoriesToShow[key])
                        }}
                    />
                </div>
                )
            })}
            <br />
            <h4>Show applications for specific results</h4>
            <Form.Select aria-label="Default select example"
                onChange={(e) => {
                    let newFilter = JSON.parse(JSON.stringify(filter));
                    newFilter.resultsToShow = e.target.value;
                    setFilter(newFilter)
                    console.log(newFilter)
                }}
            >
                <option value="all">All results (default)</option>
                <option value="not applied">Not Applied</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="waiting">Waiting</option>
                <option value="rejected">Rejected</option>
            </Form.Select>
        </Form>
    )
}

export default Filter;


// if (["result", "job_title", "company"].includes(key)) {
    
// }