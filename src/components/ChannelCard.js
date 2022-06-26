import * as React from 'react';
import { styled } from '@mui/material/styles';
import {Accordion} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    color: theme.palette.text.secondary,
}));
const fetchList = async () => {
    let res
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    await fetch("http://localhost:4500/channel/AllChannels/", requestOptions)
        .then(response => response.json())
        .then(result => res = result)
        .catch(error => console.log('error', error));
    return res
}
//Fix(update status)
const fetchUpdat = async (channelId,channel) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "plcId": "62804086a3957eb65d45074f",
        "name": "lamp bedroom",
        "category": "Lamp",
        "status": 0
    });
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(`http:/localhost:4500/channel/update/?id=${channelId}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
//Fix
const fetchOn = async (channel) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "plcId": "62804086a3957eb65d45074f",
        "name": "lamp bedroom",
        "category": "Lamp",
        "status": 0
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("localhost:4500/channel/switchToOn", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
//Fix
const fetchOff = async (channel) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "plcId": "62804086a3957eb65d45074f",
        "name": "lamp bedroom",
        "category": "Lamp",
        "status": 0
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("localhost:4500/channel/switchToOff", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
const handelOff = async (channel) => {
    //? id 
    await fetchUpdat(channel.id,channel)
    await fetchOn(channel)
    //Change status fetch del ch and creat 
}
const handelOn = async (channel) => {
    //id ?
    await fetchUpdat(channel.id,channel)
    await fetchOff(channel)
}
export const ChannelCard = () => {
    const icon = ["🕓", "♨", '❄', "🎶"];
    const [channels, setChannels] = React.useState([])
    React.useEffect(() => {
        const HundelfetchList = async () => {
            let arr = await fetchList();
            setChannels(arr)
        }
        let lis = HundelfetchList();
        console.log(channels)
    }, [channels])
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {channels.map((channel, index) =>
            (
                <ListItem>
                    <Grid>
                        <ListItemAvatar >
                            <Avatar>
                                {icon[parseInt(channel.category)]}
                            </Avatar>
                        </ListItemAvatar> </Grid>
                    <ListItemText primary="Photos" secondary={channel.name} />
                    {(channel.status == 0) ? <button onClick={()=>{handelOn(channels[index])}} name={index}>on</button> :
                        <button onClick={()=>{handelOff(channels[index])}} name={index}>off</button>}
                </ListItem>
            )

            )}
        </List>
    );
}
