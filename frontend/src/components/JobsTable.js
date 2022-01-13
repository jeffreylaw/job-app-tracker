import react from 'react';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import { AiOutlineDelete } from 'react-icons/ai'
import { AiOutlineEdit } from 'react-icons/ai';

const JobsTable = ({ filter, filteredJobs, setShowEditJob, setJobToEdit, deleteJob }) => {


    return (
        <Table striped bordered hover>
            <thead>
                <tr className="table-header-row">
                    {filter.categoriesToShow.result.show && <th>Result</th>}
                    {filter.categoriesToShow.job_title.show && <th>Job Title</th>}
                    {filter.categoriesToShow.company.show && <th>Company</th>}
                    {filter.categoriesToShow.job_description.show && <th>Job Description</th>}
                    {filter.categoriesToShow.salary.show && <th>Salary</th>}
                    {filter.categoriesToShow.applied_date.show && <th>Applied Date</th>}
                    {filter.categoriesToShow.post_date.show && <th>Post Date</th>}
                    {filter.categoriesToShow.link.show && <th>Link</th>}
                    {filter.categoriesToShow.notes.show && <th>Notes</th>}
                </tr>
            </thead>
            <tbody>
                {
                    filteredJobs.map((job) => {
                        return (
                            <tr key={job.job_id}>
                                {job.result === 'not applied' && <td><Badge bg="secondary">{job.result.toUpperCase()}</Badge></td>}
                                {job.result === 'applied' && <td><Badge bg="warning">{job.result.toUpperCase()}</Badge></td>}
                                {job.result === 'interview' && <td><Badge bg="info">{job.result.toUpperCase()}</Badge></td>}
                                {job.result === 'waiting' && <td><Badge bg="success">{job.result.toUpperCase()}</Badge></td>}
                                {job.result === 'rejected' && <td><Badge bg="danger">{job.result.toUpperCase()}</Badge></td>}
                                {filter.categoriesToShow.job_title.show && <td>{job.job_title}</td>}
                                {filter.categoriesToShow.company.show && <td>{job.company}</td>}
                                {filter.categoriesToShow.job_description.show && <td>{job.job_description}</td>}
                                {filter.categoriesToShow.salary.show && <td>{job.salary !== 0 ? job.salary : 'n/a'}</td>}
                                {filter.categoriesToShow.applied_date.show && <td className="center-text">{job.applied_date.split('T')[0]}</td>}
                                {filter.categoriesToShow.post_date.show && <td className="center-text">{job.post_date.split('T')[0]}</td>}
                                {filter.categoriesToShow.link.show && <td><a href={"//" + job.link} target="_blank" rel="noreferrer">{job.link}</a></td>}
                                {filter.categoriesToShow.notes.show && <td>{job.notes}</td>}

                                <td>
                                    <AiOutlineEdit
                                        size="1.5em"
                                        onClick={() => {
                                            setShowEditJob(true);
                                            setJobToEdit(job);
                                        }}
                                        className="hover-btn"
                                    />
                                    <AiOutlineDelete
                                        size="1.5em"
                                        onClick={() => deleteJob(job.job_id)}
                                        className="hover-btn"
                                    />

                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}

export default JobsTable;