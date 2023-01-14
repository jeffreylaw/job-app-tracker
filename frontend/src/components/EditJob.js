import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import toast from 'react-hot-toast';
import axios from 'axios';
// const baseURL = 'http://localhost:8000';
const baseURL = '/api';

const EditJob = ({ handleClose, show, jobToEdit, setJobToEdit, jobs, setJobs }) => {
    const [addJobStatus, setAddJobStatus] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [salary, setSalary] = useState(0);
    const [jobPostDate, setJobPostDate] = useState('');
    const [jobAppliedDate, setJobAppliedDate] = useState('');
    const [link, setLink] = useState('');
    const [notes, setNotes] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        setAddJobStatus(jobToEdit.result);
        setJobTitle(jobToEdit.job_title);
        setCompany(jobToEdit.company);
        setJobDescription(jobToEdit.job_description);
        setSalary(jobToEdit.salary);
        setLink(jobToEdit.link);
        setNotes(jobToEdit.notes);

        setJobPostDate('')
        setJobAppliedDate('')

        if (jobToEdit.post_date) {
            setJobPostDate(jobToEdit.post_date.split('T')[0]);
        }

        if (jobToEdit.applied_date) {
            setJobAppliedDate(jobToEdit.applied_date.split('T')[0]);
        }

    }, [jobToEdit.result, jobToEdit.job_title, jobToEdit.company, jobToEdit.job_description, jobToEdit.salary, jobToEdit.post_date, jobToEdit.applied_date, jobToEdit.link, jobToEdit.notes])

    const radios = [
        { name: 'Not applied', value: 'not applied', variant: 'outline-secondary' },
        { name: 'Applied', value: 'applied', variant: 'outline-warning' },
        { name: 'Interview', value: 'interview', variant: 'outline-info' },
        { name: 'Waiting', value: 'waiting', variant: 'outline-success' },
        { name: 'Rejected', value: 'rejected', variant: 'outline-danger' },
    ];

    const updateJob = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }
        toast.loading('Updating job...');
        const token = localStorage.getItem("auth_token");
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        axios
            .put(baseURL + '/jobs',
                {
                    job_id: jobToEdit.job_id,
                    result: addJobStatus,
                    job_title: jobTitle,
                    company: company,
                    job_description: jobDescription,
                    salary: salary,
                    post_date: jobPostDate,
                    applied_date: jobAppliedDate,
                    link: link,
                    notes: notes
                }, config
            ).then((res) => {
                toast.dismiss();
                toast.success("Updated job");
                if (res.status === 200) {
                    let newJobs = jobs.map((job) => job.job_id === jobToEdit.job_id ? res.data.job : job)
                    setJobs(newJobs)
                    localStorage.setItem("jobs", JSON.stringify(newJobs));
                    handleClose();
                    setJobToEdit(null);
                }
            }).catch((err) => {
                console.log(err);
                toast.dismiss();
                toast.error("Failed to update job. Please try again.")
            })
    }

    const closeModal = () => {
        clearForm();
        handleClose();
    }

    const clearForm = () => {
        setJobTitle('');
        setCompany('');
        setJobDescription('');
        setSalary('');
        setJobPostDate('');
        setJobAppliedDate('');
        setLink('');
        setNotes('');
        setAddJobStatus('not applied')
    }

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" dialogClassName="addJobModal">
            <Modal.Header closeButton>
                <Modal.Title>Edit Application</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated} onSubmit={updateJob}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Select Job Status</Form.Label>
                        <div>
                            <ButtonGroup className="mb-2">
                                {radios.map((radio, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        id={`radio-${idx}`}
                                        type="radio"
                                        variant={radio.variant}
                                        name="radio"
                                        value={radio.value}
                                        checked={addJobStatus === radio.value}
                                        onChange={(e) => setAddJobStatus(e.currentTarget.value)}
                                    >
                                        {radio.name}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formJobTitle">
                        <Form.Label>Job Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Please enter a job title.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCompany">
                        <Form.Label>Company</Form.Label>
                        <Form.Control type="text" placeholder="Enter company name" required value={company} onChange={(e) => setCompany(e.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Please enter a company name.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formJobDescription">
                        <Form.Label>Job Description</Form.Label>
                        <Form.Control as="textarea" rows="3" placeholder="Enter description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formSalary">
                        <Form.Label>Salary</Form.Label>
                        <Form.Control type="number" min="0" max="500000" value={salary} onChange={(e) => setSalary(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formJobPostDate">
                        <Form.Label>Posted Date</Form.Label>
                        <Form.Control type="date" value={jobPostDate} onChange={(e) => setJobPostDate(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formJobAppliedDate">
                        <Form.Label>Applied Date</Form.Label>
                        <Form.Control type="date" value={jobAppliedDate} onChange={(e) => setJobAppliedDate(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formLink">
                        <Form.Label>Link</Form.Label>
                        <Form.Control type="text" placeholder="Enter url" value={link} onChange={(e) => setLink(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formNotes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control as="textarea" rows="3" placeholder="Enter any notes here" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Update
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal >
    )
}

export default EditJob;
