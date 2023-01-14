import React from 'react';
import Form from 'react-bootstrap/Form';

const Filter = ({ filter, setFilter }) => {

    return (
        <Form>
            <div className="filter-main">
                <div className="filter-section">
                    <h4>Search Filter</h4>
                    <Form.Group className="mb-1" controlId="formSearch">
                        <Form.Control type="text" placeholder="Enter search value" onChange={
                            (e) => {
                                let newFilter = JSON.parse(JSON.stringify(filter));
                                newFilter.searchQuery = e.target.value;
                                setFilter(newFilter);
                            }
                        }/>
                        <Form.Text className="text-muted">
                        Filter by <b>title</b>, <b>company</b>, and <b>description</b> (highlighted).
                        </Form.Text>
                    </Form.Group>
                </div>

                <div className="filter-section">
                    <h4>Filter by Status</h4>
                    <Form.Select aria-label="Default select example"
                        onChange={(e) => {
                            let newFilter = JSON.parse(JSON.stringify(filter));
                            newFilter.resultsToShow = e.target.value;
                            setFilter(newFilter)
                        }}
                    >
                        <option value="active">Active (default)</option>
                        <option value="all">All Applications</option>
                        <option value="not applied">Not Applied</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="waiting">Waiting</option>
                        <option value="rejected">Rejected</option>
                    </Form.Select>
                </div>

                <div className="filter-section">
                    <h4>Toggle Categories</h4>
                    <div className="filter-hide-section">
                        {Object.keys(filter.categoriesToShow).map((key) => {
                            if (["result", "job_title", "company"].some(i => i === key)) {
                                return null
                            }
                            return (
                            <div key={key} className="filter-hide-category">
                                <Form.Check
                                    type="checkbox"
                                    id={filter.categoriesToShow[key].name}
                                    label={filter.categoriesToShow[key].name}
                                    defaultChecked={filter.categoriesToShow[key].show}
                                    onClick={(e) => {
                                        let newFilter = JSON.parse(JSON.stringify(filter));
                                        newFilter.categoriesToShow[key].show = e.target.checked;
                                        setFilter(newFilter)
                                    }}
                                />
                            </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Form>
    )
}

export default Filter;