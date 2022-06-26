import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { setActioAlerts } from '../store/actions/user';
import swal from 'sweetalert';

export default function ActionAlertDetails(props) {
    const navigate = useNavigate();
    let actionAlerts = useSelector(state => state.actionAlert)
    let dispatch = useDispatch();

    const fetchDelete = async () => {
        let alertDeleted;
        await fetch(`http://localhost:4500/actionAlert/${props.oneActionAlert._id}`,
            { method: "DELETE" })
            .then(response => response.json())
            .then(result => alertDeleted = result).catch(error => console.log(error));
        return alertDeleted;
    }
    //יש לבדוק האם הפונ'ק הנ"ל עובדת בפוסטמן
    const deleteActionAlert = async () => {
        swal({
            text: `למחוק את השעון?`,
            icon: "warning",
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    let deletedAlert = await fetchDelete();
                    let alertArr = actionAlerts.filter(e => e._id != deletedAlert._id)
                    console.log(alertArr)
                    dispatch(setActioAlerts(alertArr))
                }
            });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& > *': {
                    m: 1,
                },
            }}
            width={450}
        >
            <ButtonGroup variant="outlined" aria-label="outlined button group" fullWidth>
                <Button onClick={deleteActionAlert}><DeleteIcon />מחיקה</Button>
                <Button onClick={() => navigate("/newAlert", { state: { alert: props.oneActionAlert } })}> <EditIcon />עריכה</Button>
                <Button>{props.oneActionAlert.name}</Button>
            </ButtonGroup>
        </Box>
    );
}

