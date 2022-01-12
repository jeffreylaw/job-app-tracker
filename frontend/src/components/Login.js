import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import toast, { Toaster } from 'react-hot-toast';

import axios from 'axios';
const baseURL = 'http://localhost:8080';


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
                    localStorage.setItem("auth_token", res.data.access_token);
                    localStorage.setItem("username", res.data.username);
                    localStorage.setItem("jobs", JSON.stringify(res.data.jobs));
                    setUser(res.data.username);
                    setJobs(res.data.jobs);
                    toast(`Welcome ${username}!`, {
                        icon: '🤗',
                      });
                }).catch((err) => {
                    if (err.response) {
                        console.log(err.response.data)
                    }
                    if (err.response && err.response.data.status_code === 401) {
                        toast.error("Incorrect username and/or password")
                    } else {
                        toast.error("Please try again later...")
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
                <h1>Job Tracker</h1>
                <Form onSubmit={login}>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="string" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" style={{float: 'right'}} type="submit">
                        Login
                    </Button>
                    <Button variant="primary" style={{float: 'right', marginRight: '5px'}} onClick={() => {
                        setUsername("demo");
                        setPassword("demo");
                    }}>
                        Demo Account
                    </Button>
                    <Button variant="link" style={{ paddingRight: '0px', paddingLeft: '0px' }} onClick={() => switchFormType('register')}>Register here!</Button>
                </Form>
            </div>
        )
    } else if (formType === 'register') {
        return (
            <div>
                <Toaster />
                <h1>Register</h1>
                <Form onSubmit={register}>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="string" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" style={{float: 'right'}} type="submit">
                        Sign up
                    </Button>
                    <p><Button variant="link" style={{ paddingRight: '0px', paddingLeft: '0px' }} onClick={() => switchFormType('login')}>Login</Button></p>
                </Form>
            </div>
        )
    }
}

export default Login;