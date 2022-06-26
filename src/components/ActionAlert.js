import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import NewActionAlertButton from './NewActionAlertButton';
import ActionAlertDetails from './ActionAlertDetails';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setActioAlerts } from '../store/actions/user';

const theme = createTheme();

export default function ActionAlert() {
    let actionAlerts = useSelector(state => state.actionAlert)
    
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        // direction: 'rtl'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <AccessTimeFilledIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        הגדרת שעון
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 5 }}>
                        <Grid container spacing={2}  >
                            <NewActionAlertButton />
                        </Grid>
                    </Box>
                    <Box>
                        {actionAlerts != null ? actionAlerts.map(
                            item => (<ActionAlertDetails key={item._id} oneActionAlert={item} />)) : ''}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}