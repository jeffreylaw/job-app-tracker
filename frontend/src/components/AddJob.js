import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import toast from 'react-hot-toast';
import axios from 'axios';
// const baseURL = 'http://localhost:8000';
const baseURL = '/api';

const AddJob = ({ handleClose, show, jobs, setJobs }) => {
    const [jobStatus, setJobStatus] = useState('not applied');
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [salary, setSalary] = useState(0);
    const [jobPostDate, setJobPostDate] = useState('');
    const [jobAppliedDate, setJobAppliedDate] = useState('');
    const [link, setLink] = useState('');
    const [notes, setNotes] = useState('');
    const [validated, setValidated] = useState(false);

    const radios = [
        { name: 'Not applied', value: 'not applied', variant: 'outline-secondary' },
        { name: 'Applied', value: 'applied', variant: 'outline-warning' },
        { name: 'Interview', value: 'interview', variant: 'outline-info' },
        { name: 'Waiting', value: 'waiting', variant: 'outline-success' },
        { name: 'Rejected', value: 'rejected', variant: 'outline-danger' },
    ];

    const createJob = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }
        toast.loading('Adding job...');
        const token = localStorage.getItem("auth_token");
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        axios
            .post(baseURL + '/jobs',
                {
                    result: jobStatus,
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
                toast.success("Added new job!");
                if (res.status === 200) {
                    setJobs([...jobs, res.data.job])
                    localStorage.setItem("jobs", JSON.stringify([...jobs, res.data.job]));
                    clearForm();
                    handleClose();
                }
            }).catch((err) => {
                console.log(err);
                toast.dismiss();
                toast.error("Failed to add job. Please try again.")
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
        setJobStatus('not applied')
    }

    const fillInFormValues = () => {
        const d = new Date();
        let month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1).toString() : d.getMonth() + 1
        let day = d.getDate() < 10 ? '0' + d.getDate().toString() : d.getDate()

        let d2 = d.addDays(5);
        let month2 = d2.getMonth() + 1 < 10 ? '0' + (d2.getMonth() + 1).toString() : d2.getMonth() + 1
        let day2 = d2.getDate() < 10 ? '0' + d2.getDate().toString() : d2.getDate()

        setJobStatus('interview')
        setJobTitle('Cybersecurity Analyst');
        setCompany('Untitled Tech Company');
        setJobDescription(`Conduct in-depth forensics analysis on compromised Windows and Linux operating systems
        Develop threat intelligence based on the artifacts and indicators of compromise during investigations
        Identify attack vectors and other affected systems
        Perform memory forensics and malware analysis
        Work closely with the Security teams to contain and remediate incidents`);
        setSalary(123456);
        setJobPostDate(`${d.getFullYear()}-${month}-${day}`);
        setJobAppliedDate(`${d.getFullYear()}-${month2}-${day2}`);
        setLink('indeed.ca');
    }

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" dialogClassName="addJobModal">
            <Modal.Header closeButton>
                <Modal.Title>New Application</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated} onSubmit={createJob}>
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
                                        checked={jobStatus === radio.value}
                                        onChange={(e) => setJobStatus(e.currentTarget.value)}
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
                        <Form.Control type="number" min="0" max="500000" value={salary} onChange={(e) => setSalary(parseInt(e.target.value))} />
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
                        <Form.Label>Job Posting URL</Form.Label>
                        <Form.Control type="text" placeholder="Enter URL" value={link} onChange={(e) => setLink(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formNotes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control as="textarea" rows="3" placeholder="Enter notes here" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" style={{ marginRight: "auto" }} onClick={fillInFormValues}>
                        Demo: Fill in sample values
                    </Button>
                    <Button variant="warning" onClick={clearForm}>
                        Clear
                    </Button>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Save Job
                    </Button>
                </Modal.Footer>
            </Form>

        </Modal >
    )
}

export default AddJob;
