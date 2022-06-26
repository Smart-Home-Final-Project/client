import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setActioAlerts, setChannels, setGroups, setPlc, setUser } from '../store/actions/user';
import { fetchActionAlert, fetchChannels, fetchGroups, fetchPlc } from './fetch';
import swal from 'sweetalert';

const theme = createTheme();

export default function SignIn() {

    const navigate = useNavigate();
    let dispatch = useDispatch();

    const handleSubmit = async event => {
        event.preventDefault();
        let data = new FormData(event.currentTarget);
        let res;
        let newUser = {
            userName: data.get('userName'),
            password: data.get('password'),
        };
        await fetch('http://localhost:4500/user/login',
            {
                method: "POST", headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                , body: JSON.stringify(newUser)
            }).then(response => response.json())
            .then(dt => res = dt).then(result => console.log(result));
        if (res.message) {
            swal({
                title: "משתמש לא קיים",
                text: "אינך רשום במערכת להרשמה הקש אישור",
                icon: "info",
                button: {
                    text: "אישור",
                    closeModal: true,
                },
            })
                .then(willSubscribe => {
                    if (willSubscribe) {
                        navigate("/register", { state: { userName: newUser.userName, password: newUser.password } })
                    }
                });
        }
        else {
            swal({
                text: `ברוך שובך ${res.userName}`,
                icon: 'success',

            });
            await dispatch(setUser(res))
            let plc = await fetchPlc(res);
            if (plc[0]) {
                await dispatch(setPlc(plc[0]));
                let channels = await fetchChannels(plc[0]);
                await dispatch(setChannels(channels))
            }
            let groups = await fetchGroups(res)
            await dispatch(setGroups(groups))
            let alerts = await fetchActionAlert(res)
            await dispatch(setActioAlerts(alerts))
            navigate("/")
        }

    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs"  >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1 }} style={{ backgroundColor: "blue" }} />
                    <Typography component="h1" variant="h5">
                        כניסה
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="userName"
                            label="שם משתמש"
                            name="userName"
                            autoComplete="userName"
                            dir='rtl'
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="סיסמה"
                            type="password"
                            id="password"
                            dir='rtl'
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            style={{ backgroundColor: "blue" }}
                        >
                            היכנס
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
