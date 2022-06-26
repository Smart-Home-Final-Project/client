import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { Box, Grid } from '@mui/material';
import { useSelector } from 'react-redux';

export default function Menu() {
    const navigate = useNavigate();
    let user = useSelector(state => state.user)
    return (
        <>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Stack spacing={2} direction="row">

                    <Grid >
                        <Button variant="contained" disabled={user == null} onClick={() => navigate("/groups")}> הגדרת קבוצת ערוצים</Button>
                    </Grid>

                    <Grid >
                        <Button variant="contained" disabled={user == null} onClick={() => navigate("/actionAlert")}>הגדרת שעונים</Button>
                    </Grid>

                    <Grid>
                        <Button variant="contained" disabled={user == null} onClick={() => navigate("/smartHome")}>שליטה על הבית החכם</Button>
                    </Grid>
                    
                    <Grid >
                        <Button variant="contained" disabled={user == null} onClick={() => navigate("/controllerSetting")}>הגדרת בקר</Button>
                    </Grid>
                </Stack>
            </Box>
        </>
    );
}
