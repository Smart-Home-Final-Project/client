import * as React from 'react';
import { Grid } from '@mui/material';
import { Card, CardActionArea, CardContent, Avatar } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { setGroups } from '../store/actions/user';
import { useDispatch } from 'react-redux';
import AppsIcon from '@mui/icons-material/Apps';


export const GroupsMenu = () => {
    let groups = useSelector(state => state.groups)
    let dispatch = useDispatch();

    //fetchUpdate
    const fetchUpdate = async (group, index) => {
        var groupUpdate
        var statusCheck = group.status == false ? true : false;
        group.status = statusCheck;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify(group)
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        await fetch(`http://localhost:4500/ChannelGroup/update/${group._id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                groupUpdate = result
                console.log("after update" + result)
            })
            .catch(error => console.log('error', error));
        let temp = [...groups]
        temp[index] = groupUpdate
        dispatch(setGroups(temp))
    }

    //turn on group and update the status

    const handleOn = async (group, index) => {
        // await fetchOn(group)
        await fetchUpdate(group, index)
        console.log(group)
    }

    //turn off group and update the status

    const handelOff = async (group, index) => {
        // await fetchOff(group)
        await fetchUpdate(group, index)
        console.log(group)
    }


    return (
        <Grid sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'center' }} spacing={3}>

            {groups != null ? groups.map((group, index) => (
                <Grid key={group._id} spacing={4} padding={3}>
                    <Card sx={{ minWidth: 155, minHeight: 160 }} defaultChecked={group.status}
                        style={{ backgroundColor: group.status ? 'lightgrey' : 'white' }} onClick={() => {
                            group.status ?
                                handelOff(group, index) : handleOn(group, index)
                        }
                        }
                    >
                        <CardActionArea sx={{ alignItems: 'center' }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    <Avatar sx={{ alignSelf: 'center' }}>
                                        <AppsIcon />
                                    </Avatar>
                                </Typography>
                                <Typography gutterBottom variant="h5" component="div">
                                    {group.groupName}
                                </Typography>
                                <Typography>
                                    {group.status ? 'פועל' : 'כבוי'}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            )) : ' '}
        </Grid>

    )
} 