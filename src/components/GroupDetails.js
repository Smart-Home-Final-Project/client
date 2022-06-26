import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { setGroups } from '../store/actions/user';
import { useSelector, useDispatch } from 'react-redux';
import swal from 'sweetalert'

export default function GroupDetails(props) {
    const navigate = useNavigate();
    let dispatch = useDispatch()
    let groupsRedux = useSelector(state => state.groups);


    const deleteGroup = async () => {
        swal({
            text: `למחוק את הקבוצה ${props.oneGroup.groupName} ?`,
            icon: "warning",
            dangerMode: true,
        })
            .then(async(willDelete) => {
                if (willDelete) {                   
                    
                    await fetch(`http://localhost:4500/ChannelGroup/${props.oneGroup._id}`,
                    { method: "DELETE" }).then(response => response.json())
                    .then(result => console.log(result));
                    let groupsArr = groupsRedux.filter(e => e._id != props.oneGroup._id)
                    console.log(groupsArr)
                    dispatch(setGroups(groupsArr))
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
                <Button onClick={deleteGroup}><DeleteIcon />מחיקה</Button>
                <Button onClick={() => navigate("/newGroup", { state: { group: props.oneGroup } })}> <EditIcon />עריכה</Button>
                <Button >{props.oneGroup.groupName}</Button>
            </ButtonGroup>
        </Box>
    );
}
