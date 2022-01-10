import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Login from './components/Login';
import toast, { Toaster } from 'react-hot-toast';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import { AiOutlineDelete } from 'react-icons/ai'
import './App.css';
import axios from 'axios';
const baseURL = 'http://localhost:8080';


const App = () => {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        if (!user && localStorage.getItem("username")) {
            setUser(localStorage.getItem("username"));
        }

        if (jobs && jobs.length === 0 && localStorage.getItem("jobs")) {
            setJobs(JSON.parse(localStorage.getItem("jobs")));
        }
    }, [])
    

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setJobs(null);
    }

    const deleteJob = (id) => {
        const token = localStorage.getItem("auth_token");
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        axios
            .delete(baseURL + '/jobs/' + id, config)
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    toast.success("Job deleted");
                    let newJobs = jobs.filter(job => job.job_id !== res.data.job_id);
                    localStorage.setItem("jobs", JSON.stringify(newJobs));
                    setJobs(newJobs);
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    console.log(jobs)

    if (user && jobs) {
        return (
            <div>
                <Toaster />
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand >Job Tracker</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="#">Add Job</Nav.Link>
                            <Nav.Link onClick={() => logout()}>Logout ({user})</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
                <div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Result</th>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Job Description</th>
                                <th>Salary</th>
                                <th>Applied Date</th>
                                <th>Post Date</th>
                                <th>Link</th>
                                <th>Notes</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                jobs.map((job) => {
                                    return (
                                        <tr key={job.job_id}>
                                            {job.result === 'waiting' && <td><Badge bg="primary">{job.result.toUpperCase()}</Badge></td>}
                                            {job.result === 'rejected' && <td><Badge bg="danger">{job.result}</Badge></td>}
                                            {job.result === 'interview' && <td><Badge bg="success">{job.result}</Badge></td>}
                                            <td>{job.job_title}</td>
                                            <td>{job.company}</td>
                                            <td>{job.job_description}</td>
                                            <td>{job.salary !== 0 ? job.salary : 'n/a'}</td>
                                            <td>{job.applied_date.split('T')[0]}</td>
                                            <td>{job.post_date.split('T')[0]}</td>
                                            <td><a href={job.link}>{job.link}</a></td>
                                            <td>{job.notes}</td>
                                            <td>Edit and <AiOutlineDelete onClick={() => deleteJob(job.job_id)}/></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <Login setUser={setUser} setJobs={setJobs} />
            </div>
        );
    }
}

export default App;
