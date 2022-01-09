import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Login from './components/Login';
import toast, { Toaster } from 'react-hot-toast';

import './App.css';


const App = () => {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);


    const logout = () => {
        localStorage.clear();
        setUser(null);
    }

    console.log(jobs);

    if (user) {
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
                <h1>Logged in</h1>
                <div className="jobsList">

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
