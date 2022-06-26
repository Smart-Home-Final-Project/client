import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NewGroupButton from './NewGroupButton';
import AppIcon from '@mui/icons-material/Apps'
import { useSelector } from 'react-redux';
import GroupDetails from './GroupDetails';
const theme = createTheme();

export default function Groups() {
    let groups = useSelector(state => state.groups)

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
                        <AppIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        הגדרת קבוצה
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 5 }}>
                        <Grid container spacing={2}  >
                            <NewGroupButton />
                        </Grid>
                    </Box>
                    <Box>
                        {groups != null ? groups.map(
                            item => (<GroupDetails key={item._id} oneGroup={item} />)) : ''}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}