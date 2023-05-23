/*import React from 'react';
import axios from "axios";
import {useState} from "react";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, settel] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState('');

    const handleRegistration = (event) => {
        event.preventDefault();

        axios.post('http://localhost:8080/api/auth/register', {
            username: username,
            password: password,
            firstname:firstname,
            lastname:lastname,
            telephone:telephone,
            role:role,
            email: email
        }).then(response => {
            localStorage.setItem('token', response.data.token);
            window.location = '/';
        }).catch(error => {
            setError(error.response.data.message);
        });
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegistration}>
                <div>
                    <label>Username:</label>
                    <input type="text" onChange={event => setUsername(event.target.value)} />
                </div>
                <div>
                    <label>FirstName:</label>
                    <input type="text" onChange={event => setFirstName(event.target.value)} />
                </div>
                <div>
                    <label>LastNAme:</label>
                    <input type="text" onChange={event => setLastName(event.target.value)} />
                </div>
                <div>
                    <label>Telephone:</label>
                    <input type="text" onChange={event => settel(event.target.value)} />
                </div>
                <div>
                    <label>Role:</label>
                    <input type="text" onChange={event => setRole(event.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" onChange={event => setPassword(event.target.value)} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" onChange={event => setEmail(event.target.value)} />
                </div>
                <button type="submit">Register</button>

            </form>
            <button onClick={() => window.location.href="/login"}>login</button>


            {error && <div>{error}</div>}
        </div>
    );
}
*/
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";


const theme = createTheme();

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, settel] = useState("");
    const [adresse, setAdresse] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState('');

    const handleRegistration = (event) => {
        event.preventDefault();

        axios.post('http://localhost:8080/api/auth/register', {
            username: username,
            password: password,
            firstname:firstname,
            lastname:lastname,
            telephone:telephone,
            adresse:adresse,
            role: 'USER',
            email: email
        }).then(response => {
            window.location = '/';
        }).catch(error => {
            setError(error.response.data.message);
        });
    };





  /*  const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };
*/
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleRegistration} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    onChange={event => setFirstName(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    onChange={event => setLastName(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="UserName"
                                    name="UserName"
                                    autoComplete="family-name"
                                    onChange={event => setUsername(event.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="tel"
                                    label="Phone number"
                                    name="tel"
                                    autoComplete="family-name"
                                    onChange={event => settel(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={event => setEmail(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Address"
                                    name="address"
                                    autoComplete="address"
                                    onChange={event => setAdresse(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={event => setPassword(event.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to={"/"} variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}