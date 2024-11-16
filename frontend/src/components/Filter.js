import React from 'react';
import Form from 'react-bootstrap/Form';

const Filter = ({ filter, setFilter }) => {

    return (
        <Form>
            <div className="filter-main">
                <div className="filter-section">
                    <Form.Group className="mb-1" controlId="formSearch">
                        <Form.Control type="text" placeholder="Enter search value" onChange={
                            (e) => {
                                let newFilter = JSON.parse(JSON.stringify(filter));
                                newFilter.searchQuery = e.target.value;
                                setFilter(newFilter);
                            }
                        } />
                        <Form.Text className="text-muted">
                            Search by title, company, and description (highlighted).
                        </Form.Text>
                    </Form.Group>
                </div>

                <div className="filter-section">
                    <Form.Select aria-label="Default select example"
                        onChange={(e) => {
                            let newFilter = JSON.parse(JSON.stringify(filter));
                            newFilter.resultsToShow = e.target.value;
                            setFilter(newFilter)
                        }}
                    >
                        <option value="active">Active</option>
                        <option value="not applied">Not Applied</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="waiting">Waiting</option>
                        <option value="rejected">Rejected</option>
                        <option value="all">Show All</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                        Show applications by status.
                    </Form.Text>
                </div>
            </div>
        </Form>
    )
}

export default Filter;