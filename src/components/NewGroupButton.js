import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function NewGroupButton() {
    const navigate = useNavigate();
    let plc = useSelector(state => state.plc)

    return (
        <Stack spacing={2} direction="row-reverse">
            <Button variant="contained" disabled={plc == null} onClick={() => navigate("/NewGroup")}>קבוצה חדשה</Button>
        </Stack>
    );
}