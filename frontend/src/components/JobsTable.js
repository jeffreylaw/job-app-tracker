import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import { AiOutlineDelete } from 'react-icons/ai'
import { AiOutlineEdit } from 'react-icons/ai';
import ReadMore from './ReadMore';

const JobsTable = ({ filter, filteredJobs, setShowEditJob, setJobToEdit, deleteJob, setShowNotes }) => {

    return (
        <Table bordered hover responsive>
            <thead>
                <tr className="table-header-row">
                    {filter.categoriesToShow.result.show && <th>Result</th>}
                    {filter.categoriesToShow.job_title.show && <th>Title</th>}
                    {filter.categoriesToShow.company.show && <th>Company</th>}
                    {filter.categoriesToShow.job_description.show && <th>Description</th>}
                    {filter.categoriesToShow.salary.show && <th>Salary</th>}
                    {filter.categoriesToShow.post_date.show && <th>Posted</th>}
                    {filter.categoriesToShow.applied_date.show && <th>Applied</th>}
                    {filter.categoriesToShow.notes.show && <th>Notes</th>}
                    <th></th>
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
                                {filter.categoriesToShow.job_title.show && <td>
                                    {job.link ? <a href={job.link.startsWith("http://") || job.link.startsWith("https://") ? job.link : "//" + job.link} target="_blank" rel="noreferrer">{job.job_title}</a> : <span>{job.job_title}</span>}
                                </td>}
                                {filter.categoriesToShow.company.show && <td>{job.company}</td>}
                                {filter.categoriesToShow.job_description.show && <td className="job-description-td">
                                    <ReadMore filter={filter} text={job.job_description} highlightable={true}></ReadMore>
                                </td>}

                                {filter.categoriesToShow.salary.show && <td className="center-text">{job.salary !== 0 ? "$" + job.salary : 'n/a'}</td>}
                                {filter.categoriesToShow.post_date.show && <td className="center-text">{job.post_date ? job.post_date.split('T')[0] : 'n/a'}</td>}
                                {filter.categoriesToShow.applied_date.show && <td className="center-text">{job.applied_date ? job.applied_date.split('T')[0] : 'n/a'}</td>}
                                {/* {filter.categoriesToShow.notes.show && <td>{job.notes}</td>} */}
                                {filter.categoriesToShow.notes.show &&
                                    <td><button
                                        onClick={() => {
                                            console.log("Opening Notes")
                                            setJobToEdit(job);
                                            setShowNotes(true);
                                        }}>
                                        Open
                                    </button>
                                    </td>}

                                <td className="edit-delete-btns">
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