import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { AiOutlineDelete } from 'react-icons/ai'
import { AiOutlineEdit } from 'react-icons/ai';
import ReadMore from './ReadMore';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const JobsTable = ({ filter, filteredJobs, setShowEditJob, setJobToEdit, deleteJob, setShowNotes }) => {
    const deleteApplication = (id, title, company) => {
        confirmAlert({
            title: 'Delete application',
            message: 'Are you sure you want to delete (' + title + ' - ' + company + ')?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteJob(id)
                },
                {
                    label: 'No'
                }
            ]
        });
    };

    return (
        <Table bordered hover responsive>
            <thead>
                <tr className="table-header-row">
                    {filter.categoriesToShow.result.show && <th>Status</th>}
                    {filter.categoriesToShow.company.show && <th>Company</th>}
                    {filter.categoriesToShow.job_title.show && <th>Job Position</th>}
                    {filter.categoriesToShow.job_description.show && <th>Description</th>}
                    {filter.categoriesToShow.applied_date.show && <th>Applied</th>}
                    {filter.categoriesToShow.notes.show && <th>Notes</th>}
                    {/* {filter.categoriesToShow.salary.show && <th>Salary</th>} */}
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
                                {filter.categoriesToShow.company.show && <td>{job.company}</td>}
                                {filter.categoriesToShow.job_title.show && <td>
                                    {job.link ? <a href={job.link.startsWith("http://") || job.link.startsWith("https://") ? job.link : "//" + job.link} target="_blank" rel="noreferrer">{job.job_title}</a> : <span>{job.job_title}</span>}
                                </td>}
                                {filter.categoriesToShow.job_description.show && <td className="job-description-td">
                                    <ReadMore filter={filter} text={job.job_description} highlightable={true}></ReadMore>
                                </td>}

                                {filter.categoriesToShow.applied_date.show && 
                                    <td className="center-text">
                                        <p>
                                            {job.applied_date ? job.applied_date.split('T')[0] : 'n/a'}                                        
                                        </p>
                                        <span>
                                        {job.applied_date ? "(" + Math.round((new Date() - new Date(job.applied_date)) / (1000 * 3600 * 24)) + " days ago)" : ''}
                                        </span>
                                    </td>}
                                {filter.categoriesToShow.notes.show && job.notes.length > 0 &&
                                    <td>
                                        <Button variant="link"
                                            onClick={() => {
                                                setJobToEdit(job);
                                                setShowNotes(true);
                                            }}>Open
                                        </Button>
                                    </td>}

                                {filter.categoriesToShow.notes.show && !job.notes && <td></td>}
                                {filter.categoriesToShow.salary.show && <td className="center-text">{job.salary !== 0 ? "$" + job.salary : 'n/a'}</td>}

                                <td className="edit-delete-btns">
                                    <div className="hover-btn">
                                        {/* <span className="tooltiptext"
                                            onClick={() => {
                                                setShowEditJob(true);
                                                setJobToEdit(job);
                                            }}>Edit</span> */}
                                        <AiOutlineEdit
                                            onClick={() => {
                                                setShowEditJob(true);
                                                setJobToEdit(job);
                                            }}
                                        />
                                    </div>
            
                                    <div className="hover-btn">
                                        {/* <span className="tooltiptext" onClick={() => deleteJob(job.job_id)}>Delete</span> */}
                                        <AiOutlineDelete
                                            onClick={() => deleteApplication(job.job_id, job.job_title, job.company)}
                                        />
                                    </div>

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