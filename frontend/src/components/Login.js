import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import toast, { Toaster } from 'react-hot-toast';

import axios from 'axios';
// const baseURL = 'http://localhost:8080';
const baseURL = '/api';


const Login = ({ setUser, setJobs }) => {
    const [formType, setFormType] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const switchFormType = (type) => {
        setFormType(type);
        setUsername('');
        setPassword('');
    }

    const login = (e) => {
        e.preventDefault();
        if (!username && !password) {
            toast.error("Please enter username and password");
            return
        }
        if (!username) {
            toast.error("Please enter username");
            return
        }
        if (!password) {
            toast.error("Please enter password");
            return
        }
        axios
            .post(baseURL + '/login',
                {
                    username: username,
                    password: password
                }).then((res) => {
                    toast(`Welcome ${username}!`, {
                        icon: '🤗',
                      });
                    localStorage.setItem("auth_token", res.data.access_token);
                    localStorage.setItem("username", res.data.username);
                    localStorage.setItem("jobs", JSON.stringify(res.data.jobs));
                    setUser(res.data.username);
                    setJobs(res.data.jobs);
                }).catch((err) => {
                    if (err.response && err.response.status === 404) {
                        toast.error("Account does not exist");
                    } else if (err.response && err.response.status === 401) {
                        toast.error("Incorrect username and/or password")
                    } else if (err.response && err.response.status === 500) {
                        toast.error("Error connecting with backend server. Please try again later.")
                    } else {
                        toast.error("Oops, an unexpected error occured. Please try again later.")
                    }
                });
    }

    const register = (e) => {
        e.preventDefault();
        if (!username && !password) {
            toast.error("Please enter a username and password");
            return
        }
        if (!username) {
            toast.error("Please enter a username");
            return
        }
        if (!password) {
            toast.error("Please enter a password");
            return
        }
        toast.loading('Registering...');
        axios
            .post(baseURL + '/register',
                {
                    username: username,
                    password: password
                }).then((res) => {
                    setTimeout(() => {
                        toast.dismiss();
                        toast.success("Successfully registered!");
                        localStorage.setItem("auth_token", res.data.access_token);
                        localStorage.setItem("username", res.data.username);
                        localStorage.setItem("jobs", JSON.stringify([]));
                        setUser(res.data.username);
                        setJobs([]);
                    }, 3000);
                }).catch((err) => {
                    toast.dismiss();
                    if (err.response.status === 401) {
                        toast.error("Sorry! This username is taken.")
                    } else {
                        toast.error("Please try again later...")
                    }
                });
    }

    if (formType === 'login') {
        return (
            <div>
                <Toaster />
                <h2 className="main-page-heading center-text">Job Tracker</h2>
                <Form onSubmit={login}>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="string" autoComplete="off" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" autoComplete="off" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" style={{float: 'right'}} type="submit">
                        Login
                    </Button>
                    <Button variant="primary" style={{float: 'right', marginRight: '5px'}} onClick={() => {
                        setUsername("demo");
                        setPassword("demoabc123");
                    }}>
                        Demo Account
                    </Button>
                    <Button variant="link" style={{ paddingRight: '0px', paddingLeft: '0px' }} onClick={() => switchFormType('register')}>Register</Button>
                </Form>
            </div>
        )
    } else if (formType === 'register') {
        return (
            <div>
                <Toaster />
                <h2 className="main-page-heading center-text">Register</h2>
                <Form onSubmit={register} autoComplete="off">
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="string" autoComplete="off" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" autoComplete="off" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" style={{float: 'right'}} type="submit">
                        Sign up
                    </Button>
                    <Button variant="link" style={{ paddingRight: '0px', paddingLeft: '0px' }} onClick={() => switchFormType('login')}>Login</Button>
                </Form>
            </div>
        )
    }
}

export default Login;
