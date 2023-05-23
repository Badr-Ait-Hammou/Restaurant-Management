/*import React, { useState, useEffect, useReducer } from "react";
import axios from '../service/callerService';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import 'bootstrap/dist/css/bootstrap.css';
import UserTable from "../components/UserTable";

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();
export default function User() {


    const [user, setUser] = useState([]);
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [telephone, settel] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [upTB, forceUpdate] = useReducer((x) => x + 1, 0);
    const [tableKey, setTableKey] = useState(Date.now());


    useEffect(() => {
        axios.get("/api/controller/users/").then((response) => {
            setUser(response.data);
        });
    }, [upTB]);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("/api/controller/auth/register", {
            firstname,
            lastname,
            email,
            username,
            role,
            password,
            telephone,
        })
            .then((response) => {
                setFirstName("");
                setLastName("");
                setEmail("");
                setUserName("");
                setPassword("");
                settel("");
                setRole("");
                forceUpdate();
                setTableKey(Date.now());
            })
            .catch((error) => {
                console.error(error);
            });
    };


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <form onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >

                        <Typography component="h1" variant="h5">
                            Users
                        </Typography>

                        <Grid container spacing={2}>


                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth

                                    label="firstName"

                                    autoComplete="firstName"
                                    id="firstName"
                                    value={firstname}
                                    onChange={(event) => setFirstName(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth

                                    label="lastName"

                                    autoComplete="lastName"
                                    id="lastName"
                                    value={lastname}
                                    onChange={(event) => setLastName(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth

                                    label="email"

                                    autoComplete="email"
                                    id="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth

                                    label="username"

                                    autoComplete="username"
                                    id="username"
                                    value={username}
                                    onChange={(event) => setUserName(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth

                                    label="role"

                                    autoComplete="role"
                                    id="role"
                                    value={role}
                                    onChange={(event) => setRole(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth

                                    label="password"

                                    autoComplete="password"
                                    id="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth

                                    label="telephone"

                                    autoComplete="telephone"
                                    id="tel"
                                    value={telephone}
                                    onChange={(event) => settel(event.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                            variant="contained"
                        >
                            add
                        </Button>


                    </Box>

                </form>

            </Container>

            <UserTable key={tableKey}/>

        </ThemeProvider>
    );
}*/